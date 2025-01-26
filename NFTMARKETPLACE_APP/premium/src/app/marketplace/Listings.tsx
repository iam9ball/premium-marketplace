'use client'
import { useEffect, useCallback, useState, useMemo } from "react";
import Card from "../components/card/Card";
import { client } from "../client";
import { fetchNFT, listings } from "../contracts/listingInfo";
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
import useInfiniteScrollMutateStore from "@/app/hooks/useInfiniteScrollMutateStore";
import Container from "../components/Container";

export default function Listings() {
  const createListingModal = useCreateListingModal();
  const {  setMutateListings } = useInfiniteScrollMutateStore();
  const router = useRouter();
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
   const LimitedListings = async (start = 0, limit: null | number = null) => {
    try {
      const allListings = await listings();
      if (!allListings || allListings.length === 0) {
        return [];
      }
      const reversedListings = [...allListings].reverse();
      
      if (limit !== null) {
        return reversedListings.slice(start, start + limit);
      }
      
      return reversedListings;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  };
  
  

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

  const getTotalCount = useCallback(async () => {
    try {
      const totalListings = await listings();
      return totalListings?.length;
      
    } catch (error) {
      console.error('Error fetching total count:', error);
      return null;
    }
  }, []);

  const { ref, pages, isLoading, error, mutate, inView } = useInfiniteScroll({
    fetchData: fetchListings,
    initialTotalCount: null,
    revalidateKey: 'listings',
    getTotalCount,
  });
  
  useEffect(() => {
  setMutateListings(mutate);
  setInitialLoading(false);
  },[mutate, setMutateListings])
 


  

  if (initialLoading || !pages) {
    return (
      <Container>
      <CardContainer>
        <CardSkeletonContainer />
      </CardContainer>
      </Container>
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
    <Container>
      <CardContainer>
        {allItems}
      </CardContainer>
      <div ref={ref} className="h-full mb-auto w-full">
        {isLoading && <CardContainer><CardSkeletonContainer /></CardContainer>}
      </div>
    </Container>
  );
}