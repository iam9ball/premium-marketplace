
'use client'
import { useCallback, useEffect, useState } from "react";
import Card from "@/app/components/card/Card";

import { fetchNFT, getApprovedBuyer, listings } from "@/app/contracts/listingInfo";
import { ipfsToHttp } from "@/app/utils/ipfsToHttp";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import EmptyState from "@/app/components/EmptyState";
import Error from "@/app/components/Error";
import {CardContainer} from "@/app/components/card/CardContainer";
import Container from "@/app/components/Container";
import CardSkeletonContainer from "@/app/components/card/CardSkeleton";
import { fetchCurrencyInfo } from "@/app/hooks/useCurrency";
import MyListingsSidebar from "./MyListingsSidebar";
import { Contract } from "../utils/Contract";
import { getLimitedListings, getListingLength } from "../graphClient";
import { toEther } from "thirdweb";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export type ListingItem = {
  key?: string;
  alt: string;
  id: string;
  src: string;
  price: string;
  listingId: bigint;
  name: string;
  symbol?: any;  // Optional since it's using `currency` prop
  status: number;
  currency: string;
  buyer?: string;
 
}

export default function MyListings() {
    
  const createListingModal = useCreateListingModal();
  const [selectedListing, setSelectedListing] = useState<ListingItem>();
  const [isVisible, setIsVisible] = useState(false)
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);





  const handleCardClick = async (listing: ListingItem) => {
     const buyer = await getApprovedBuyer(listing?.listingId);
    setSelectedListing({...listing, buyer});
    setIsVisible(true);
   

  }

  const onClose = () => {
    setIsVisible(false);
  }
 
  const fetchMyListingsPage = async (key: string) => {
    try {
      const pageIndex = parseInt(key.split('-page-')[1]?.split('-')[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;

      const pageListings = await getLimitedListings("0xfc3c3F0d793EaC242051C98fc0DC9be60f86d964",start, PAGE_SIZE);

       if (!Array.isArray(pageListings)) {
        return { items: [], totalCount: 0 };
      }

     
      const results = await Promise.allSettled(pageListings.map(async (listing) => {
        try {
          const contract = Contract(listing.assetContract)
          
           
                
          const nft = await fetchNFT(contract, listing);
          const currency = await fetchCurrencyInfo(listing.currency)
          
          if (!nft?.metadata) {
            console.error('Missing NFT metadata for listing:', listing.listingId);
            return null;
          }
          const listingDetails = {
            key: listing.listingId.toString(),
            alt: nft.metadata.name || 'NFT',
            id: listing.tokenId.toString(),
            src: ipfsToHttp(nft.metadata.image || ''),
            price: toEther(listing.pricePerToken),
            listingId: listing.listingId,
            name: nft.metadata.name || '',
            currency: currency.symbol,
            status: listing.status,
            symbol: currency.symbol,


          }
          
          return (
            <Card
            key={listingDetails.key}
            alt={listingDetails.alt}
            id={listingDetails.id}
            src={listingDetails.src}
            price={listingDetails.price}
            listingId={listingDetails.listingId}
            name={listingDetails.name}
            currency={listingDetails.currency}
            status={listingDetails.status}
            variant={"secondary"}
            onClick={() => handleCardClick(listingDetails)}
            />
           
          );
        } catch (error) {
          console.error('Error fetching listing:', listing.listingId, error);
          
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
      throw error
    }
  };

  const getTotalCount = useCallback(async () => {
      try {
        const totalListings = await getListingLength("0xfc3c3F0d793EaC242051C98fc0DC9be60f86d964");
        return totalListings;
        
      } catch (error) {
        console.error('Error fetching total count:', error);
        return null;
      }
    }, []);

   const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
      fetchData: fetchMyListingsPage,
      initialTotalCount: null,
      revalidateKey: 'myListings',
      getTotalCount,
    })
    
    useEffect(() => {
    //STORE MUTATE WITH KEY
    setInitialLoading(false);
    },[])


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
  const allItems = pages?.flatMap(page => page?.items) || [];

  
 if (!initialLoading && allItems.length === 0 && !error) {
  return (
    <EmptyState
       title="Oops!"
      subtitle="No listing at the moment. Try creating one"
      label="Create listing"
      showButton
      onClick={createListingModal.onOpen}
    />
  )
 }

  
   return ( 
    <>
    <Container>
      <div className="relative">  
        {isVisible && <div className="fixed inset-0 bg-black/50 opacity-50 z-10"></div>}
      <div className={`relative ${isVisible ? 'pointer-events-none' : ''} z-0 `}>
     <CardContainer>
      
      {allItems}
      
    </CardContainer>
      <div ref={ref} className="h-full mb-auto w-full">
      {isLoading &&  <CardContainer><CardSkeletonContainer /></CardContainer>}
      </div> 
     </div>
    </div>
    </Container>
      {selectedListing && (
      <MyListingsSidebar listing={selectedListing}  onClose={() => onClose()} isVisible={isVisible}/>
      )}
     
      </>
     
      
   
  );
}


