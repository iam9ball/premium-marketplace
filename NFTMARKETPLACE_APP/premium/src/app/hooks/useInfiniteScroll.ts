

import { useEffect, useCallback, useState } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { useInView } from 'react-intersection-observer';
// import { listings } from '../contracts/listingInfo';
// import useInfiniteScrollStore from "./useInfiniteScrollStore";


interface InfiniteScrollOptions<T> {
  fetchData: (key: string) => Promise<{ items: T[]; totalCount: number }>;
  initialTotalCount: number | null;
  revalidateKey: string;
  getTotalCount?: () => Promise<number | null>;
}

export function useInfiniteScroll<T>({
  fetchData,
  initialTotalCount,
  revalidateKey,
  getTotalCount,
}: InfiniteScrollOptions<T>) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: '100px'
  });
  
  const [isMounted, setIsMounted] = useState(false);
    const [totalCount, setTotalCount] = useState<number | null>(initialTotalCount);
    


  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const initializeTotalCount = async () => {
    if (getTotalCount && totalCount === null) {
      try{
        const newTotalCount = await getTotalCount();
        setTotalCount(newTotalCount);
      } catch (error) {
        console.error('Error updating total count:', error);
      }
     };
   }
    initializeTotalCount();
  }, [getTotalCount, totalCount]);

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex, previousPageData) => {
      if (!isMounted || totalCount === null) return null;
      if (previousPageData && !previousPageData.items.length) return null;
      return `${revalidateKey}-page-${pageIndex}`;
    },
    [isMounted, totalCount, revalidateKey]
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
    refreshInterval: 5000
    
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
    }
  }, [originalMutate, getTotalCount]);

  useEffect(() => {
    if (isMounted && inView && !isLoading && totalCount !== null) {
      const currentItemCount = pages?.reduce(
        (total, page) => total + (page?.items?.length || 0),
        0
      ) || 0;

      if (currentItemCount < totalCount) {
        setSize((prev) => prev + 1);
      }
    }
  }, [inView, isLoading, totalCount, pages, setSize, isMounted]);

  return {
    ref,
    pages,
    error,
    isLoading,
    size,
    setSize,
    mutate: handleMutation,
    totalCount,
    inView
  };
}