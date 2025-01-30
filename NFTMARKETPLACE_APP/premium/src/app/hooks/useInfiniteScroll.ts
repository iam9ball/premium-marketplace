

import { useEffect, useCallback, useState } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { useInView } from 'react-intersection-observer';
// import { listings } from '../contracts/listingInfo';
// import useInfiniteScrollStore from "./useInfiniteScrollStore";


interface InfiniteScrollOptions<T> {
  fetchData: (key: string) => Promise<{ items: T[]; totalCount: number } | undefined> ;
  initialTotalCount: number | undefined;
  revalidateKey: string;
  getTotalCount?: () => Promise<number | undefined>;
}

export function useInfiniteScroll<T>({
  fetchData,
  initialTotalCount = undefined,
  revalidateKey,
  getTotalCount,
}: InfiniteScrollOptions<T>) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: '100px'
  });
  
  const [isMounted, setIsMounted] = useState(false);
    const [totalCount, setTotalCount] = useState<number | undefined>(initialTotalCount);
    


  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const initializeTotalCount = async () => {
    if (getTotalCount) {
      try{
        const newTotalCount = await getTotalCount();
        setTotalCount(newTotalCount);
      } catch (error) {
        console.error('Error updating total count:', error);
        throw error;
      }
     };
   }
    initializeTotalCount();
  }, [getTotalCount]);

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex, previousPageData) => {
      if (!isMounted) return null;
      if (previousPageData && !previousPageData.items.length) return null;
      return `${revalidateKey}-page-${pageIndex}`;
    },
    [isMounted, revalidateKey]
  );

  const {
    data: pages,
    error,
    isValidating: isLoading,
    size,
    setSize,
    mutate: originalMutate,
  } = useSWRInfinite(getKey, fetchData, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    persistSize: false,
    refreshInterval: 5000,
    shouldRetryOnError: false,
    
  });

  const handleMutation = useCallback(async () => {
    try {
     
      if (getTotalCount) {
        const newTotalListings = await getTotalCount();
        setTotalCount(newTotalListings);
      }
      return originalMutate()
    } catch (error) {
      console.error('Error updating after mutation:', error);
      throw error;
    }
  }, [originalMutate, getTotalCount]);

  useEffect(() => {
    if (isMounted && inView && !isLoading && totalCount !== undefined) {
      const currentItemCount = pages?.reduce(
        (total, page) => total + (page?.items?.length || 0),
        0
      ) || 0;

      if (totalCount && currentItemCount < totalCount) {
        setSize((prev) => prev + 1);
      }
    }
  }, [inView, isLoading, totalCount, pages, setSize, isMounted]);
  console.log("ERROR", error);

  return {
    ref,
    pages,
    error,
    isLoading,
    size,
    setSize,
    mutate: handleMutation,
    totalCount,
    
  };
}