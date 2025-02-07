"use client";
import { useCallback, useEffect, useState } from "react";
import Card from "@/app/components/card/Card";

import { fetchNFT, getListing } from "@/app/contracts/listingInfo";
import { ipfsToHttp } from "@/app/utils/ipfsToHttp";
import useMakeOfferModal from "@/app/hooks/useMakeOfferModal";
import EmptyState from "@/app/components/EmptyState";
import Error from "@/app/components/Error";
import { CardContainer } from "@/app/components/card/CardContainer";
import Container from "@/app/components/Container";
import CardSkeletonContainer from "@/app/components/card/CardSkeleton";
import { fetchCurrencyInfo, useCurrency } from "@/app/hooks/useCurrency";
import MyListingsSidebar from "./MyListingsSidebar";
import { Contract } from "../utils/Contract";
import { getMyOffers } from "../graphClient";
import { toEther } from "thirdweb";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import useInfiniteScrollMutateStore from "../hooks/useInfiniteScrollMutateStore"
import { NATIVE_TOKEN } from "../utils/address";
import { getOffer } from "../contracts/offerInfo";
import {ListingItem} from "./MyListings";
import MyOffersSidebar from "./MyOffersSidebar";
import authAddress from "../utils/authAddress";

type OfferItem = {
  offerId: bigint;
  price: string;
  offerStatus: number;
  offerPrice: string;
}



export type Offers = OfferItem & ListingItem; 

export default function MyOffers() {
  const [selectedListing, setSelectedListing] = useState<Offers>();
  const [isVisible, setIsVisible] = useState(false);
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const { setMutateListings } = useInfiniteScrollMutateStore();
  const { formattedCurrency, isLoading: isCurrencyLoading } = useCurrency();

  const fetchActiveOffersWithCount = async (page: number, size: number) => {
    try {
        const address = await authAddress();
      const limitedOffer = await getMyOffers(address!);
      console.log("limitedOffer", limitedOffer);
      const activeOffers: any[] = [];

      const result = await Promise.allSettled(
         limitedOffer.map(async (offer: any) => {
          const offerResult = await getOffer(offer.offerId, offer.listingId);

         
          return { ...offerResult , offerId: offer.offerId };
        })
      );
      console.log("result", result);

      result.forEach((res: any) => {
        if (res.status === "fulfilled" && res.value) {
          activeOffers.push(res.value);
        }
      });

      const totalCount = activeOffers.length;

      const paginatedOffers = activeOffers.slice(page, size);
      console.log("page", paginatedOffers);

      console.log("page", paginatedOffers);
      return { totalCount, paginatedOffers };
    } catch (error) {
      console.error("Error fetching active listings:", error);
      throw error;
    }
  };

  const handleCardClick = useCallback((listing: Offers) => {
    setSelectedListing(listing);
    setIsVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
    // Clear selected listing after animation completes

    setTimeout(() => {
      setSelectedListing(undefined);
    }, 300);
  }, []);

  const fetchMyOffersPage = useCallback(
    async (key: string) => {
      try {
        const pageIndex =
          parseInt(key.split("-page-")[1]?.split("-")[0], 10) || 0;
        const start = pageIndex * PAGE_SIZE;

        const { paginatedOffers } = await fetchActiveOffersWithCount(
          start,
          PAGE_SIZE
        );
        console.log("paginatedListings", paginatedOffers);

        if (!Array.isArray(paginatedOffers)) {
          return { items: [], totalCount: 0 };
        }

        const results = await Promise.allSettled(
          paginatedOffers.map(async (offers) => {
            try {
              const listing = await getListing(offers.listingId);
              if (!listing) {
                
                return null;
              }
              const contract = Contract(listing.assetContract);

              const nft = await fetchNFT(contract, listing);
              const { symbol } = await fetchCurrencyInfo(listing.currency);

              if (!nft?.metadata) {
                console.error(
                  "Missing NFT metadata for listing:",
                  listing.listingId
                );
                return null;
              }

              const Offers = {
                key: listing.listingId.toString(),
                alt: nft.metadata.name || "NFT",
                id: listing.tokenId.toString(),
                src: ipfsToHttp(nft.metadata.image || ""),
                price: toEther(listing.pricePerToken),
                listingId: listing.listingId,
                name: nft.metadata.name || "",
                currency: listing.currency,
                status: listing.status,
                symbol: symbol,
                listingPlan: listing.listingType,
                offerId: offers.offerId,
                offerStatus: offers.status,
                offerPrice: toEther(offers.totalPrice),
              };
              console.log("yes");
              return (
                <Card
                  key={Offers.key}
                  alt={Offers.alt}
                  id={Offers.id}
                  src={Offers.src}
                  price={Offers.price}
                  listingId={Offers.listingId}
                  name={Offers.name}
                  currency={Offers.symbol}
                  status={Offers.status}
                  variant={"secondary"}
                  onClick={() => handleCardClick(Offers)}
                />
              );
            } catch (error) {
              console.error(
                `Error fetching offers for ${offers.listingId}:`,
                error
              );
              throw error;
            }
          })
        );

        console.log("results", results);
        const fulfilledResults = results
          .filter((result) => result.status === "fulfilled")
          .map(
            (result) => (result as PromiseFulfilledResult<JSX.Element>).value
          );
        console.log("fulfilledResults", fulfilledResults);

        return {
          items: fulfilledResults.filter(Boolean),
          totalCount: paginatedOffers.length,
        };
      } catch (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }
    },
    [ handleCardClick]
  );

  const getTotalCount = useCallback(async () => {
    try {
      const { totalCount } = await fetchActiveOffersWithCount(0, 1);
      return totalCount;
    } catch (error) {
      console.error("Error fetching total count:", error);
      throw error;
    }
  }, []);

  const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData: fetchMyOffersPage,
    initialTotalCount: undefined,
    revalidateKey: "myOffers",
    getTotalCount,
  });

  useEffect(() => {
    setMutateListings("dashboardMutate", mutate);
    setInitialLoading(false);

    return () => {
      setSelectedListing(undefined);
      setIsVisible(false);
    };
  }, [mutate]);

  console.log("error", error);
  if (error) return <Error error={error} />;

  if (initialLoading || !pages || (isCurrencyLoading && !error)) {
    return (
      <Container>
        <CardContainer>
          <CardSkeletonContainer />
        </CardContainer>
      </Container>
    );
  }

  const allItems = pages?.flatMap((page) => page?.items) || [];

  if (!initialLoading && allItems.length === 0 && !error) {
    return (
      <EmptyState
        title="Oops!"
        subtitle="You don't have any offers yet."
       
      />
    );
  }

  return (
    <>
      <Container>
        <div className="relative">
          {isVisible && (
            <div className="fixed inset-0 bg-black/50 opacity-50 z-10"></div>
          )}
          <div
            className={`relative ${
              isVisible ? "pointer-events-none" : ""
            } z-0 `}
          >
            <CardContainer>{allItems}</CardContainer>
            <div ref={ref} className="h-full mb-auto w-full">
              {isLoading && (
                <CardContainer>
                  <CardSkeletonContainer />
                </CardContainer>
              )}
            </div>
          </div>
        </div>
      </Container>
      {selectedListing && (
        <MyOffersSidebar
          listing={selectedListing}
          onClose={onClose}
          isVisible={isVisible}
        />
      )}
    </>
  );
}
