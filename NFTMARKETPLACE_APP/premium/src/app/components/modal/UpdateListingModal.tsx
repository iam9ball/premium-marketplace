"use client";

import Heading from "../Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import { useState, useCallback, useEffect, useMemo } from "react";
import { updateListing } from "@/app/contracts/listing";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import CurrencySelect, { CurrencySelectValue } from "../CurrencySelect";
import { ListingItem } from "@/app/dashboard/MyListings";
import { toEther } from "thirdweb";
import { NATIVE_TOKEN } from "@/app/utils/address";
import { useCurrency } from "@/app/hooks/useCurrency";
import useInfiniteScrollMutateStore from "@/app/hooks/useInfiniteScrollMutateStore";

interface UpdateListingModalProps {
  listing: ListingItem;
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
}

const UpdateListingModal = ({
  listing,
  onClose,
  isOpen,
  onSuccess: closeSideBar,
}: UpdateListingModalProps) => {
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);
  const { dashboardRefreshListings } = useInfiniteScrollMutateStore();
  const { formattedCurrency } = useCurrency();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      currencyAddress: listing.currency,
      assetPrice: listing.price,
    },
  });

  const currencyAddress = watch("currencyAddress");
  const assetPrice = watch("assetPrice");
 

  // Format the currency options
 
  const defaultCurrency = useMemo(() => {
   return formattedCurrency?.find(
      (option) => {
        console.log("option", option.address);
        
        return option.address == listing.currency
      }
    );
  }, [formattedCurrency, listing.currency]);

  console.log("defaultCurrency", defaultCurrency);

  const setCustomValues = useCallback(
    (key: string, value: any) => {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  useEffect(() => {
    setCustomValues("currencyAddress", defaultCurrency);
    setCustomValues("assetPrice", listing.price);
  }, [defaultCurrency, listing.price]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (account) {
      console.log("addr", data.currencyAddress);
      let address;
      if (
        data.currencyAddress.address ==
        "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"
      ) {
        address = NATIVE_TOKEN;
      } else {
        address = data.currencyAddress.address;
      }
      setIsDisabled(true);
      console.log(listing?.listingId);
      console.log(address);
      console.log(data.assetPrice);
      try {
        await updateListing(
          listing?.listingId,
          address,
          data.assetPrice,
          account
        ).then(async (data) => {
          if (data.success) {
            toast.success(data.message);

            await dashboardRefreshListings?.();
            onClose();
            closeSideBar();
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

  const bodyContent = (
    <>
      <div className="flex-1 space-y-4">
        <div>
          <label
            htmlFor="assetPrice"
            className="block text-xs md:text-sm font-medium text-gray-700"
          >
            Token price
          </label>
          <input
            type="number"
            id="assetPrice"
            {...register("assetPrice", {
              required: true,
            })}
            className={`${
              errors.assetPrice ? "border-red-500" : "border-gray-300"
            } mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            placeholder="0"
            onChange={(e) => setCustomValues("assetPrice", e.target.value)}
            value={assetPrice || ""} // Ensure controlled value
          />
        </div>

        <CurrencySelect
          value={currencyAddress} // Prevent uncontrolled component issues
          onChange={(selectedOption) => {
            setCustomValues("currencyAddress", selectedOption);
          }}
        />
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      forward={handleSubmit(onSubmit)}
      forwardLabel="Update"
      backwardLabel={""}
      backward={() => {}}
      title="Update Listing"
      body={bodyContent}
      disabled={isDisabled}
    />
  );
};

export default UpdateListingModal;
