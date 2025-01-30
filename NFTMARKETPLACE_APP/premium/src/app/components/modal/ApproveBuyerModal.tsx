"use client";

import Heading from "../Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import { useSWRConfig } from "swr";
import { usePathname } from "next/navigation";
import { approveBuyerForListing } from "@/app/contracts/listing";
import useInfiniteScrollMutateStore from "@/app/hooks/useInfiniteScrollMutateStore";

interface ApprovedBuyerProps {
  onClose: () => void;
  isOpen: boolean;
  listingId: bigint;
  onSuccess: () => void;
}

const ApproveBuyerModal = ({
  onClose,
  isOpen,
  listingId,
  onSuccess: closeSideBar,
}: ApprovedBuyerProps) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      buyerAddress: "",
    },
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const account = useActiveAccount();
 const {dashboardRefreshListings} = useInfiniteScrollMutateStore()
  

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (account) {
      setIsDisabled(true);
      try {
        await approveBuyerForListing(
          listingId,
          data.buyerAddress,
          account
        ).then(async (data: any) => {
          if (data.success) {
            toast.success(data.message!);
            onClose();
            await dashboardRefreshListings?.();
            closeSideBar();
            reset();
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
      onClose();
      showToast();
    }
  };

  let bodyContent;
  {
    bodyContent = (
      <>
        <Heading
          title="Approve a buyer for this listing"
          
          titleClassName="font-light text-sm text-neutral-500 mt-1  mb-2"
        />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="buyerAddress"
            className="block text-sm font-black text-black"
          >
            Recipient Address
          </label>
          <input
            type="text"
            id="buyerAddress"
            {...register("buyerAddress", {
              required: true,
            })}
            className="border border-gray-300 rounded-lg p-2 w-full pl-6 placeholder:text-sm"
            placeholder="0x123...789"
          />
        </div>
      </>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      forward={handleSubmit(onSubmit)}
      forwardLabel={"Submit"}
      backwardLabel={""}
      backward={() => {}}
      title="Approve a buyer"
      body={bodyContent}
      disabled={isDisabled}
    />
  );
};

export default ApproveBuyerModal;
