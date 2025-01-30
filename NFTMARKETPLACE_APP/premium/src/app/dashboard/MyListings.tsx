"use client";
import { useCallback, useEffect, useState } from "react";
import Card from "@/app/components/card/Card";

import { fetchNFT, getListing } from "@/app/contracts/listingInfo";
import { ipfsToHttp } from "@/app/utils/ipfsToHttp";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import EmptyState from "@/app/components/EmptyState";
import Error from "@/app/components/Error";
import { CardContainer } from "@/app/components/card/CardContainer";
import Container from "@/app/components/Container";
import CardSkeletonContainer from "@/app/components/card/CardSkeleton";
import { fetchCurrencyInfo, useCurrency } from "@/app/hooks/useCurrency";
import MyListingsSidebar from "./MyListingsSidebar";
import { Contract } from "../utils/Contract";
import { getMyListings } from "../graphClient";
import { toEther } from "thirdweb";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import useInfiniteScrollMutateStore from "../hooks/useInfiniteScrollMutateStore";
import { NATIVE_TOKEN } from "../utils/address";

export type ListingItem = {
  key?: string;
  alt: string;
  id: string;
  src: string;
  price: string;
  listingId: bigint;
  name: string;
  symbol?: any; // Optional since it's using `currency` prop
  status: number;
  currency: string;
  listingPlan: number;
};

export default function MyListings() {
  const createListingModal = useCreateListingModal();
  const [selectedListing, setSelectedListing] = useState<ListingItem>();
  const [isVisible, setIsVisible] = useState(false);
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const { setMutateListings } = useInfiniteScrollMutateStore();
  const { formattedCurrency, isLoading: isCurrencyLoading } = useCurrency();

  const fetchActiveListingsWithCount = async (page: number, size: number) => {
    try {
      const limitedListing = await getMyListings(
        "0xfc3c3F0d793EaC242051C98fc0DC9be60f86d964"
      );
      console.log("limitedListing", limitedListing);
      const activeListings: any[] = [];

      const result = await Promise.allSettled(
        limitedListing.map(async (listing: any) => {
          const activeListing = await getListing(listing.listingId);

          if (activeListing.status === 1) {
            return activeListing;
          }
          return null;
        })
      );

      result.forEach((res: any) => {
        if (res.status === "fulfilled" && res.value) {
          activeListings.push(res.value);
        }
      });

      const totalCount = activeListings.length;

      const paginatedListings = activeListings.slice(page, size);

      console.log("page", paginatedListings);
      return { totalCount, paginatedListings };
    } catch (error) {
      console.error("Error fetching active listings:", error);
      throw error;
    }
  };

  const handleCardClick = useCallback((listing: ListingItem) => {
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

  const fetchMyListingsPage = useCallback(
    async (key: string) => {
      try {
        const pageIndex =
          parseInt(key.split("-page-")[1]?.split("-")[0], 10) || 0;
        const start = pageIndex * PAGE_SIZE;

        const { paginatedListings } = await fetchActiveListingsWithCount(
          start,
          PAGE_SIZE
        );
        console.log("paginatedListings", paginatedListings);

        if (!Array.isArray(paginatedListings)) {
          return { items: [], totalCount: 0 };
        }

        const results = await Promise.allSettled(
          paginatedListings.map(async (listing) => {
            try {
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

             
              const listingDetails = {
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
              };
              console.log("yes");
              return (
                <Card
                  key={listingDetails.key}
                  alt={listingDetails.alt}
                  id={listingDetails.id}
                  src={listingDetails.src}
                  price={listingDetails.price}
                  listingId={listingDetails.listingId}
                  name={listingDetails.name}
                  currency={listingDetails.symbol}
                  status={listingDetails.status}
                  variant={"secondary"}
                  onClick={() => handleCardClick(listingDetails)}
                />
              );
            } catch (error) {
              console.error(
                "Error fetching listing:",
                listing.listingId,
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
          totalCount: paginatedListings.length,
        };
      } catch (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }
    },
    [formattedCurrency, handleCardClick]
  );

  const getTotalCount = useCallback(async () => {
    try {
      const { totalCount } = await fetchActiveListingsWithCount(0, 1);
      return totalCount;
    } catch (error) {
      console.error("Error fetching total count:", error);
      throw error;
    }
  }, []);

  const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData: fetchMyListingsPage,
    initialTotalCount: undefined,
    revalidateKey: "myListings",
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
        subtitle="You don't have any listings yet. Try creating one!"
        label="Create listing"
        showButton
        onClick={createListingModal.onOpen}
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
        <MyListingsSidebar
          listing={selectedListing}
          onClose={onClose}
          isVisible={isVisible}
        />
      )}
    </>
  );
}
