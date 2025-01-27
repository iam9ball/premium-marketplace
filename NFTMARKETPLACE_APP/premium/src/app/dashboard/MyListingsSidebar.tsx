"use client";

import { useState } from "react";
import { X, Edit, Trash, DollarSign, UserCheck, UserMinus } from "lucide-react";
import { ListingItem } from "./MyListings";
import Image from "next/image";
import {
  cancelListing,
  removeApprovedBuyerForListing
} from "../contracts/listing";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "@/app/components/WalletToast";
import UpdateListingModal from "../components/modal/UpdateListingModal";
import UpdateListingPlanModal from "../components/modal/UpdateListingPlanModal";

interface MyListingsSidebarProps {
  listing: ListingItem;
  onClose: () => void;
  isVisible: boolean;
}

export default function MyListingsSidebar({
  listing,
  onClose,
  isVisible,
}: MyListingsSidebarProps) {
  const account = useActiveAccount();
  const [openUpdateListingModal, setOpenUpdateListingModal] =
    useState<boolean>(false);
  const [openUpdateListingPlanModal, setOpenUpdateListingPlanModal] =
    useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openApproveBuyerForListing, setOpenApproveBuyerForListing] =
    useState(false);

  const handleClose = () => {
    setTimeout(onClose, 300);
  };

  // Update Listing Modal
  const handleOpenUpdateListingModal = () => {
    setOpenUpdateListingModal(true);
  };

  const handleCloseUpdateListingModal = () => {
    setOpenUpdateListingModal(false);
  };

  // Approve Buyer For Listing Modal
  const handleOpenApproveBuyerForListing = () => {
    setOpenApproveBuyerForListing(true);
  };
  const handleCloseApproveBuyerForListing = () => {
    setOpenApproveBuyerForListing(false);
  };

  // Update Listing Plan Modal
  const handleOpenUpdateListingPlan = () => {
    setOpenUpdateListingPlanModal(true);
  };
  const handleCloseUpdateListingPlan = () => {
    setOpenUpdateListingPlanModal(false);
  };


  const handleRemoveApprovedBuyerForListing = async () => {
    if (account) {
      try {
        setIsDisabled(true); //  setIsDisabled(true);
        await removeApprovedBuyerForListing(listing?.listingId, account).then(
          (data) => {
            if (data.success) {
              toast.success(data.message);
              //mutate
            } else {
              toast.error(data.message);
            }
          }
        );
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

  const handleCancel = async () => {
    if (account) {
      try {
        setIsDisabled(true);
        await cancelListing(listing.listingId, account).then((data) => {
          if (data.success) {
            toast.success(data.message);
            //mutate
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

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 right-0 top-0 z-50 flex flex-col h-[100vh]
          w-full sm:max-w-[calc(100vw-8rem)] md:max-w-[320px] lg:max-w-[460px]
          transform transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-x-0" : "translate-x-full"}
          bg-white shadow-xl`}
      >
        <div className="flex items-center justify-end p-2 sm:p-4 border-b border-gray-200">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 sm:p-4 space-y-4">
            {/* Card */}
            {listing && (
              <div className="w-full max-w-[90vw] sm:max-w-none mx-auto">
                <div className="relative h-[350px]">
                  <Image
                    src={listing.src}
                    alt={listing.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={handleOpenUpdateListingModal}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                    py-2.5 sm:py-3 px-4 rounded flex items-center justify-center 
                    transition-colors text-sm sm:text-base"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Edit Listing
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold 
                    py-2.5 sm:py-3 px-4 rounded flex items-center justify-center 
                    transition-colors text-sm sm:text-base"
                  disabled={isDisabled}
                >
                  <Trash className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Cancel Listing
                </button>
              </div>

              <button
                onClick={handleOpenUpdateListingPlan}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold 
                  py-2.5 sm:py-3 px-4 rounded flex items-center justify-center 
                  transition-colors text-sm sm:text-base"
              >
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Update Listing Plan
              </button>
            </div>

            {/* Buyers Section */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                Manage Buyers
              </h3>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto rounded-lg border border-gray-200">
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between 
                      p-3 sm:p-4 hover:bg-gray-50 transition-colors border-b 
                      last:border-b-0 border-gray-200 gap-3 sm:gap-4"
                >
                  <span className="font-medium text-sm sm:text-base">
                    {listing?.buyer
                      ? listing?.buyer
                      : "No approved buyer, Approve a buyer"}
                  </span>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 
                          text-white font-semibold py-2 px-3 rounded text-xs sm:text-sm 
                          flex items-center justify-center transition-colors"
                      onClick={handleOpenApproveBuyerForListing}
                    >
                      <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      Approve
                    </button>

                    {listing?.buyer && (
                      <button
                        className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 
                          text-white font-semibold py-2 px-3 rounded text-xs sm:text-sm 
                          flex items-center justify-center transition-colors"
                        onClick={handleRemoveApprovedBuyerForListing}
                      >
                        <UserMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                {/* ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateListingModal
        listing={listing}
        onClose={handleCloseUpdateListingModal}
        isOpen={openUpdateListingModal}
      />
      <UpdateListingPlanModal
        listingId={listing?.listingId}
        onClose={handleCloseUpdateListingPlan}
        isOpen={openUpdateListingPlanModal}
        
      />
    </>
  );
}
