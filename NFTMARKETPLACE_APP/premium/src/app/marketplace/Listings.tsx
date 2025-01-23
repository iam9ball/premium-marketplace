'use client'
import { useEffect, useCallback, useState, useMemo } from "react";
import Card from "../components/card/Card";
import { client } from "../client";
import { fetchNFT, LimitedListings, listings } from "../contracts/listingInfo";
import { ipfsToHttp } from "../utils/ipfsToHttp";
import useCreateListingModal from "../hooks/useCreateListingModal";
import EmptyState from "../components/EmptyState";
import Error from "../components/Error";
import { CardContainer } from "../components/card/CardContainer";
import CardSkeletonContainer from "../components/card/CardSkeleton";
import { fetchCurrencyInfo } from "../hooks/useCurrency";
import { useRouter } from "next/navigation";
import { toEther } from "thirdweb/utils";
import { Contract } from "../utils/Contract";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import useListingMutateStore from "@/app/hooks/useListingMutateStore";
// import { LoadingIndicator } from "../components/LoadingIndicator";

export default function Listings() {
  const createListingModal = useCreateListingModal();
  const router = useRouter();
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const setMutate = useListingMutateStore(state => state.setMutate);
  const useListingSetTotalCount = useListingMutateStore();
  const [listingLength, setListingLength] = useState<number | null>(null);

  const handleCardClick = (params: bigint) => {
    router.push(`/marketplace/listing/${params}`);
  };

  const fetchListings = useCallback(async (key: string) => {
    try {
      const pageIndex = parseInt(key.split('-page-')[1]?.split('-')[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;

      const pageListings = await LimitedListings(start, PAGE_SIZE);

      if (!Array.isArray(pageListings)) {
        return { items: [], totalCount: 0 };
      }

      const results = await Promise.allSettled(pageListings.map(async (listing) => {
        try {
          const contract = Contract(listing.assetContract);
          const nft = await fetchNFT(contract, listing);
          const currency = await fetchCurrencyInfo(listing.currency);

          if (!nft?.metadata) {
            console.error('Missing NFT metadata for listing:', listing.listingId);
            return null;
          }

          return (
            <Card
              key={listing.listingId.toString()}
              alt={nft.metadata.name || 'NFT'}
              id={listing.tokenId.toString()}
              src={ipfsToHttp(nft.metadata.image || '')}
              price={toEther(listing.pricePerToken)}
              listingId={listing.listingId}
              name={nft.metadata.name || 'NFT'}
              currency={currency.symbol}
              status={listing.status}
              variant="primary"
              onClick={() => handleCardClick(listing.listingId)}
            />
          );
        } catch (error) {
          console.error('Error fetching listing:', listing.listingId, error);
          return null;
        }
      }));

      const fulfilledResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<JSX.Element>).value);

      return {
        items: fulfilledResults.filter(Boolean),
        totalCount: pageListings.length
      };
    } catch (error) {
      console.error('Error fetching listings:', error);
      return { items: [], totalCount: 0 };
    }
  }, []);

  // useEffect(async () => {
  //   try {
  //     const newTotalListings = await listings();
  //     if (newTotalListings) {
  //       useListingSetTotalCount.setTotalCount(newTotalListings.length);
  //     }
      
  //   } catch (error) {
  //     console.error('Error updating after mutation:', error);
  //   } 
  // }, []);

  // const initialTotalCount = useMemo(async () => {
  //   const newTotalListings = await listings();
  //     if (newTotalListings) {
  //       // useListingSetTotalCount.setTotalCount(newTotalListings.length);
  //       return newTotalListings.length;
  //     }
  // }, [])

  const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData: fetchListings,
    initialTotalCount: null,
    revalidateKey: 'listings',
  });

  const handleMutation = useCallback(async () => {
    try {
       const newTotalListings = await listings();

       
       if (newTotalListings) {
         useListingSetTotalCount.setTotalCount(newTotalListings.length);
       }
        
     
      return await mutate();
    } catch (error) {
      console.error('Error in handleMutation:', error);
    } 
  }, [mutate, useListingSetTotalCount]);



  useEffect(() => {
    
    const initializeListings = async () => {
      try {
        const newTotalListings = await listings();

          if (newTotalListings) {
           useListingSetTotalCount.setTotalCount(newTotalListings.length);
          }
   
        
      } catch (error) {
        console.error('Error fetching initial listings:', error);
      } finally {
       
          setInitialLoading(false);
       
      }
    };

    initializeListings();
    setMutate(() => handleMutation);

   
  }, []);

  if (initialLoading || !pages) {
    return (
      <CardContainer>
        <CardSkeletonContainer />
      </CardContainer>
    );
  }

  if (error) return <Error error={error} />;

  const allItems = pages?.flatMap(page => page.items) || [];

  if (!initialLoading && allItems.length === 0) {
    return (
      <EmptyState
        title="Oops!"
        subtitle="No listing at the moment. Try creating one"
        label="Create listing"
        showButton
        onClick={createListingModal.onOpen}
      />
    );
  }

  return (
    <>
      <CardContainer>
        {allItems}
      </CardContainer>
      <div ref={ref} className="h-full mb-auto w-full">
        {isLoading && <CardContainer><CardSkeletonContainer /></CardContainer>}
      </div>
    </>
  );
}