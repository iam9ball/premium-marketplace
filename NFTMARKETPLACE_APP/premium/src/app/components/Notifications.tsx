"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button";
import { getMyListings, getMyOffersNotif } from "../graphClient";
import { prepareEvent, toEther, watchContractEvents } from "thirdweb";
import { fetchNFT, getListing, listings } from "../contracts/listingInfo";
import { ipfsToHttp } from "../utils/ipfsToHttp";
import { fetchCurrencyInfo, useCurrency } from "@/app/hooks/useCurrency";
import { marketContract } from "@/app/constant";
import { Contract } from "../utils/Contract";
import useSWR from "swr";
import { useNotifStore } from "../hooks/useNotifStore";
import { formatTimeAgo } from "../utils/timeFormatter";
import { acceptOffer, rejectOffer } from "../contracts/offer";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "./WalletToast";
import { shortenAddress } from "thirdweb/utils";
import Link from "next/link";
import { Copy } from "lucide-react";

interface Notification {
  id: string;
  action: string;
  time: number;
  tokenId?: string;
  totalPrice?: bigint;
  expirationTime?: string;
  name: string;
  image: string;
  currency?: string;
  nftAddress?: string;
  notificationType: "offer" | "nftCreated";
  buttons?: {
    declineLabel: string;
    acceptLabel: string;
    declineAction: () => void;
    acceptAction: () => void;
  };
}

interface NotificationProps {
  isOpen: boolean;
  address: string;
}

export default function Notification({ isOpen, address }: NotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const {
    readNotifications,
    markAsRead,
    markAllAsRead,
    setUnreadCount,
    getNftAddresses,
  } = useNotifStore();
  const [mounted, setMounted] = useState(false);
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);
    const [copied, setCopied] = useState(false);


  function isPromiseFulfilled<T>(
    result: PromiseSettledResult<T>
  ): result is PromiseFulfilledResult<T> {
    return result.status === "fulfilled";
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };


  const handleAcceptOffer = async (offerId: bigint, listingId: bigint) => {
    if (account) {
      setIsDisabled(true);
      try {
        await acceptOffer(offerId, listingId, account).then(async (data) => {
          if (data.success) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        });
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      } finally {
        setIsDisabled(false);
      }
    } else {
      showToast();
    }
  };

  const handleRejectOffer = async (offerId: bigint, listingId: bigint) => {
    if (account) {
      setIsDisabled(true);
      try {
        await rejectOffer(offerId, listingId, account).then(async (data) => {
          if (data.success) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        });
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      } finally {
        setIsDisabled(false);
      }
    } else {
      showToast();
    }
  };

  const addNotification = (newNotification: Notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        ...newNotification,
        buttons: newNotification.buttons,
      },
    ]);
  };

  const handleMarkAllAsRead = () => {
    if (!notifications?.length) {
      console.log("No notifications to mark as read");
      return;
    }

    const validNotificationIds = notifications
      .filter(
        (notif): notif is Notification =>
          notif !== null && notif !== undefined && typeof notif === "object"
      )
      .map((notif) => notif.id)
      .filter(
        (id): id is string =>
          id != null &&
          typeof id === "string" &&
          !readNotifications.includes(id)
      );

    if (validNotificationIds.length > 0) {
      try {
        markAllAsRead(validNotificationIds);
        console.log(
          `Marked ${validNotificationIds.length} notifications as read`
        );
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    } else {
      console.log("No valid notifications to mark as read");
    }
  };

  const toggleNotification = (id: string) => {
    if (id === null || typeof id !== "string") return;
    setExpandedId(expandedId === id ? null : id);
    if (!readNotifications.includes(id)) {
      markAsRead(id);
    }
  };

  const fetchMyNotifications = useCallback(async () => {
    if (!mounted || !address) {
      setNotifications([]); // Clear notifications if not mounted or no address
      return [];
    }

    try {
      const myListings = await getMyListings(address);

      const listingId_arr = myListings.map((listing: any) => listing.listingId);
      const notifications = await getMyOffersNotif(listingId_arr);

      const nftAddresses = getNftAddresses();

      const results = await Promise.allSettled(
        notifications.map(async (notif: any) => {
          const {
            listingId,
            offerId,
            totalPrice,
            expirationTime,
            blockTimestamp,
            transactionHash,
          } = notif;

          try {
            const listing = await getListing(listingId);
            if (!listing) {
              return null;
            }

            const contract = Contract(listing.assetContract);
            const nft = await fetchNFT(contract, listing);

            if (!nft?.metadata.image) {
              throw new Error(
                `Missing NFT metadata for listing: ${listing.listingId}`
              );
            }

            const currency = await fetchCurrencyInfo(listing.currency);
            const now = Math.floor(Date.now() / 1000);
            const remainingSeconds = Number(expirationTime) - now;
            const remainingDays = Math.ceil(remainingSeconds / 86400);

            const expireTime =
              remainingDays <= 0
                ? "Expired"
                : remainingDays === 1
                ? "1 Day Left"
                : `${remainingDays} Days left`;

            return {
              id: transactionHash,
              action: "You have received an offer",
              time: blockTimestamp,
              tokenId: listing.tokenId.toString(),
              totalPrice,
              expirationTime: expireTime,
              currency: currency?.symbol,
              name: nft?.metadata.name,
              image: ipfsToHttp(nft?.metadata?.image!),
              buttons: {
                declineLabel: "Decline",
                acceptLabel: "Accept",
                declineAction: () => handleRejectOffer(offerId, listingId),
                acceptAction: () => handleAcceptOffer(offerId, listingId),
              },
            };
          } catch (error) {
            console.error(
              `Failed to process notification for listing ${listingId}:`,
              error
            );
          }
        })
      );

      const nftCreationNotifications = await Promise.allSettled(
        nftAddresses.map((nft) => {
          return {
            id: nft.address,
            action: "Your NFT has been created successfully",
            time: nft.timestamp,
            name: nft.name,
            image: nft.image,
            notificationType: "nftCreated",
            nftAddress: nft.address,
          };
        })
      );
      const validOffers = results
        .filter(isPromiseFulfilled)
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<NonNullable<Notification>> =>
            result.value !== null
        )
        .map((result) => result.value);

      const validNftCreated = nftCreationNotifications
        .filter(isPromiseFulfilled)
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<
            Notification & { nftAddress: string }
          > => result.value !== null && result.value.nftAddress !== undefined
        )
        .map((result) => result.value);

      return [...validOffers, ...validNftCreated];
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  }, [address, mounted]);

  const { data: offers, isLoading, error } = useSWR(
    mounted && address ? "notif" : null, // Use address as part of the key
    fetchMyNotifications,
    {
      revalidateOnReconnect: true,
      revalidateOnFocus: true,
      revalidateIfStale: true,
    }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (offers && Array.isArray(offers)) {
      setNotifications(offers);
    }
  }, [offers]);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notif) => notif && notif.id && !readNotifications.includes(notif.id)
    );
    setUnreadCount(unreadNotifications.length);
  }, [notifications, readNotifications, setUnreadCount]);

  useEffect(() => {
    if (!mounted || !address) return;
    const fetchEvents = async () => {
      const myListings = await getMyListings(address);

      const newOfferEvent = prepareEvent({
        signature:
          "event NewOffer( uint256 indexed totalPrice, uint256 indexed expirationTime, uint256 indexed listingId, address sender, uint256 id)",
        filters: {
          listingId: myListings.map((listing: any) => listing.listingId),
        },
      });

      const unwatch = await watchContractEvents({
        contract: marketContract,
        events: [newOfferEvent],
        onEvents: (events) => {
          events.forEach(async (event) => {
            const { args, transactionHash } = event;
            const { listingId, totalPrice, expirationTime, id } = args;

            const listing = await getListing(listingId);

            if (!listing) {
              return;
            }
            const contract = Contract(listing.assetContract);
            const nft = await fetchNFT(contract, listing);

            if (!nft?.metadata.image) {
              console.error(
                "Missing NFT metadata for listing:",
                listing.listingId
              );
            }
            const currency = await fetchCurrencyInfo(listing.currency);

            const now = Math.floor(Date.now() / 1000);

            const remainingSeconds = Number(expirationTime) - now;
            const remainingDays = Math.ceil(remainingSeconds / 86400);

            let expireTime =
              remainingDays <= 0
                ? "Expired"
                : remainingDays === 1
                ? "1 Day Left"
                : `${remainingDays} Days left`;

            addNotification({
              id: transactionHash,
              action: "You have received an offer",
              time: now,
              tokenId: listing.tokenId.toString(),
              totalPrice,
              expirationTime: expireTime,
              currency: currency?.symbol,
              name: nft?.metadata.name!,
              image: ipfsToHttp(nft?.metadata?.image!),
              notificationType: "offer",
              buttons: {
                declineLabel: "Decline",
                acceptLabel: "Accept",
                declineAction: () => handleRejectOffer(id, listingId),
                acceptAction: () => handleAcceptOffer(id, listingId),
              },
            });
          });
        },
      });

      return () => unwatch();
    };

    fetchEvents();
  }, [mounted, address]);

  const message = useMemo(() => {
   
    if(isLoading) {
     return "Wait a moment for your notifications"
    }
    else if(error) {
      return "Error occured while fetching notifications"
    }
    else if(!isLoading && notifications.length === 0){
      return "You have no notifications at the moment";
    }


  }, [isLoading, error, notifications.length])

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute md:w-[300px] w-[230px] mx-auto shadow-md sm:right-14 md:right-16 right-6 top-20 z-50">
      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg relative">
          <div className="max-h-[215px] overflow-y-auto">
            {/* Header - will stick to top */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="flex justify-between items-center p-4">
                <h2 className="md:text-lg text-[14px] text-grey-300 font-bold">
                  Notifications
                </h2>
                <Button
                  classNames="text-rose-500 hover:text-rose-600 md:text-base text-xs"
                  actionLabel="Mark all as read"
                  onClick={() => handleMarkAllAsRead()}
                />
              </div>
            </div>

            {/* Notifications list */}
            {message ? (
              <div className="w-full flex justify-center items-center p-4">{message}</div>
            ) : (
              <div className="divide-y">
                {notifications
                  .filter((notif) => notif && notif.id)
                  .map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        expandedId === notif.id ||
                        readNotifications.includes(notif.id)
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleNotification(notif.id)}
                    >
                      {expandedId === notif.id ? (
                        <div>
                          {notif.notificationType === "nftCreated" ? (
                            <div>
                              <p className="md:text-base text-sm font-semibold mb-2 capitalize">
                                {notif.name}
                              </p>
                              <div className="flex gap-2">
                                <p className="mb-2 md:text-sm text-[10px]">
                                  Your NFT address is{" "}
                                  <Link
                                    href={`https://amoy.polygonscan.com/address/${notif.nftAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-800 hover:underline"
                                  >
                                    {shortenAddress(notif.nftAddress!)}
                                  </Link>
                                </p>
                                {copied ? (
                                  <p className="text-green-500 text-[10px]">
                                    Copied!
                                  </p>
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(notif.nftAddress!);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="md:text-base text-sm font-semibold mb-2 capitalize">
                                {notif.name} #{notif.tokenId}
                              </p>
                              <p className="mb-2 md:text-sm text-[10px]">
                                {notif.action} of {toEther(notif.totalPrice!)}
                                <span className="uppercase">
                                  {" "}
                                  {notif.currency}
                                </span>
                              </p>
                              <p className="md:text-sm text-[10px] text-gray-500 md:mb-2 mb-4">
                                {notif.expirationTime}
                              </p>
                              {notif.buttons && (
                                <div className="flex space-x-2">
                                  <Button
                                    classNames="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
                                    actionLabel={notif.buttons.declineLabel}
                                    disabled={isDisabled}
                                    onClick={notif.buttons.declineAction}
                                  />
                                  <Button
                                    classNames="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                                    actionLabel={notif.buttons.acceptLabel}
                                    disabled={isDisabled}
                                    onClick={notif.buttons.acceptAction}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-2 items-center">
                          <Image
                            src={notif.image}
                            alt="Notification image"
                            height={25}
                            width={25}
                            className="rounded"
                          />
                          <div className="flex flex-col space-y-2">
                            <div className="md:text-sm text-xs font-semibold capitalize">
                              {notif.notificationType === "nftCreated"
                                ? notif.name
                                : `${notif.name} #${notif.tokenId}`}
                            </div>
                            <div className="md:text-xs text-[10px]">
                              {notif.action}
                            </div>
                          </div>
                          <div className="md:text-xs text-[10px] text-end text-gray-500">
                            {formatTimeAgo(notif.time as number)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
