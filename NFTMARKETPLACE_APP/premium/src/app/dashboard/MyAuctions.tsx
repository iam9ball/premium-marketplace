



'use client'
import { useCallback, useEffect, useState } from "react";
import Card from "@/app/components/card/Card";
import { anvil } from "thirdweb/chains";
import { client } from "@/app/client";
import { fetchNFT, listings } from "@/app/contracts/listingInfo";
import { ipfsToHttp } from "@/app/utils/ipfsToHttp";
import useSWR from 'swr';
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import EmptyState from "@/app/components/EmptyState";
import Error from "@/app/components/Error";
import {CardContainer} from "@/app/components/card/CardContainer";
import Container from "@/app/components/Container";
import CardSkeletonContainer from "@/app/components/card/CardSkeleton";
import { fetchCurrencyInfo, useCurrency } from "@/app/hooks/useCurrency";
import { Contract } from "../utils/Contract";
import { toEther } from "thirdweb";
import useInfiniteScrollMutateStore from "@/app/hooks/useInfiniteScrollMutateStore";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {  getMyAuctions, getMyOffers } from "../graphClient";
import { getAuction } from "../contracts/auctionInfo";
import useCreateAuctionModal from "../hooks/useCreateAuctionModal";
import MyAuctionsSidebar from "./MyAuctionSideBar";
import authAddress from "../utils/authAddress";


export type auctionItem = {
  key: string;
  alt: string;
  auctionId: bigint;
  tokenId: bigint;
  minimumBidAmount: bigint;
  buyoutBidAmount: bigint;
  bidBufferBps: bigint;
  startTimestamp: bigint;
  endTimestamp: bigint;
  auctionCreator: string;
  assetContract: string;
  currency: string;
  tokenType: number;
  status: number;
  src: string;
  name: string;
};



export default function MyAuctions() {
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<auctionItem>();
  const createAuctionModal = useCreateAuctionModal();

  const { setMutateListings } = useInfiniteScrollMutateStore();
  const { formattedCurrency, isLoading: isCurrencyLoading } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);

  const handleCardClick = useCallback((listing: auctionItem) => {
    setSelectedAuction(listing);
    setIsVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
    // Clear selected listing after animation completes

    setTimeout(() => {
      setSelectedAuction(undefined);
    }, 300);
  }, []);

  const fetchActiveAuctionsWithCount = async (page: number, size: number) => {
    try {
        const address = await authAddress();
      const limitedAuction = await getMyAuctions(
        "0x26aD21B833F4676f5F838A1A4cBa236e1a179745"
      );

      const activeAuctions: any[] = [];

      const results = await Promise.allSettled(
        limitedAuction.map(async (auction: any) => {
          const auctionResult = await getAuction(auction.auctionId);

          return auctionResult;
        })
      );

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          activeAuctions.push(result.value);
        }
      });

      const totalCount = activeAuctions.length;
      console.log(totalCount);
      const paginatedActiveAuctions = activeAuctions.slice(page, size);
      console.log(paginatedActiveAuctions);

      return { paginatedActiveAuctions, totalCount };
    } catch (error) {
      console.error("Error in main function:", error);
      throw error;
    }
  };

  const fetchMyAuctionPage = useCallback(async (key: string) => {
    try {
      const pageIndex =
        parseInt(key.split("-page-")[1]?.split("-")[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;

      const { paginatedActiveAuctions } = await fetchActiveAuctionsWithCount(
        start,
        PAGE_SIZE
      );

      if (!Array.isArray(paginatedActiveAuctions)) {
        return { items: [], totalCount: 0 };
      }

      const nftCards = await Promise.allSettled(
        paginatedActiveAuctions.map(async (auction) => {
          try {
            const contract = Contract(auction.assetContract);

            const nft = await fetchNFT(contract, auction);
            const { symbol } = await fetchCurrencyInfo(auction.currency);
            if (!nft?.metadata) {
              console.error(
                `Missing metadata for listing ${auction?.auctionId}`
              );
              return null;
            }

            const auctionItem = {
              key: auction.auctionId.toString(),
              alt: nft.metadata.name || "NFT",
              name: nft.metadata.name || "NFT",
              auctionId: auction.auctionId.toString(),
              price: toEther(auction.buyoutBidAmount),
              tokenId: auction.tokenId,
              minimumBidAmount: auction.minimumBidAmount,
              buyoutBidAmount: auction.buyoutBidAmount,
              bidBufferBps: auction.bidBufferBps,
              startTimestamp: auction.startTimestamp,
              endTimestamp: auction.endTimestamp,
              auctionCreator: auction.auctionCreator,
              assetContract: auction.assetContract,
              currency: auction.currency,
              tokenType: auction.tokenType,
              status: auction.status,
              src: ipfsToHttp(nft.metadata.image || ""),
            };
            console.log("yes");
            return (
              <Card
                key={auctionItem.key}
                alt={auctionItem.alt}
                id={auctionItem.tokenId}
                src={auctionItem.src}
                price={auctionItem.price}
                listingId={auctionItem.auctionId}
                name={auctionItem.name}
                currency={symbol}
                status={auctionItem.status}
                variant={"secondary"}
                onClick={() => handleCardClick(auctionItem)}
              />
            );
          } catch (error) {
            console.error(
              `Error processing listing ${auction.auctionId}:`,
              error
            );
            // return null;
            throw error;
          }
        })
      );

      const validCards = nftCards
        .filter((result) => result.status === "fulfilled" && result.value)
        .map(
          (result) => (result as PromiseFulfilledResult<React.ReactNode>).value
        );

      return {
        items: validCards,
        totalCount: paginatedActiveAuctions.length,
      };
    } catch (error) {
      console.error("Error fetching listings page:", error);

      throw error;
    }
  }, []);

  const getTotalCount = useCallback(async () => {
    try {
      const { totalCount } = await fetchActiveAuctionsWithCount(0, 1);
      return totalCount;
    } catch (error) {
      console.error("Error fetching total count:", error);
      throw error;
    }
  }, []);

  const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData: fetchMyAuctionPage,
    initialTotalCount: undefined,
    revalidateKey: "myAuctions",
    getTotalCount,
  });

  useEffect(() => {
    setMutateListings("dashboardMutate", mutate);
    setInitialLoading(false);

    return () => {
      setSelectedAuction(undefined);
      setIsVisible(false);
    };
  }, [mutate]);

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
        onClick={createAuctionModal.onOpen}
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
      {selectedAuction && (
        <MyAuctionsSidebar
          auctions={selectedAuction}
          onClose={onClose}
          isVisible={isVisible}
        />
      )}
    </>
  );
}
