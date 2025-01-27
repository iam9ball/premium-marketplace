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

// interface UpdateListingModalProps {
//   listing: ListingItem;
//   onClose: () => void;
//   isOpen: boolean;
// }

// const UpdateListingModal = ({
//   listing,
//   onClose,
//   isOpen,
// }: UpdateListingModalProps) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       currencyAddress: listing?.currency,
//       assetPrice: Number(listing?.price),
//     },
//   });
//   const [selectedValue, setSelectedValue] = useState<CurrencySelectValue>();
//   const [isDisabled, setIsDisabled] = useState(false);
//   const account = useActiveAccount();

//   const setCustomValues = useCallback(
//     (key: any, value: any) => {
//       setValue(key, value, {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//     },
//     [setValue]
//   );

//   const handleCurrencySelect = (selectedOption: CurrencySelectValue | null) => {
//     if (selectedOption) {
//       // Set the currency field value to the entire selected option
//       setSelectedValue(selectedOption);

//       // Set the currency address field value
//       setCustomValues("currencyAddress", selectedOption.address);
//       console.log(selectedOption.address);
//     } else {
//       // Clear the values if no option is selected
//       setSelectedValue(undefined);
//       setCustomValues("currencyAddress", undefined);
//     }
//   };
//   const onSubmit: SubmitHandler<FieldValues> = (data) => {
//     if (account) {
//       setIsDisabled(true);
//       updateListing(
//         listing?.listingId,
//         data.currency,
//         data.assetPrice,
//         account!
//       ).then((data) => {
//         if (data.success) {
//           toast.success(data.message!);
//           onClose();
//           reset();
//           // updateListingModal.mutateListings();
//         } else {
//           toast.error(data.message!);
//         }
//         setIsDisabled(false);
//       });
//     } else {
//       showToast();
//     }
//   };

//   const bodyContent = (
//     <>
//       <div className="flex-1 space-y-4">
//         <div>
//           <label
//             htmlFor="tokenPrice"
//             className="block text-xs md:text-sm font-medium text-gray-700"
//           >
//             Token price
//           </label>
//           <input
//             type="number"
//             id="tokenPrice"
//             {...register("assetPrice", {
//               required: true,
//             })}
//             className={`${
//               errors.assetPrice ? "border-red-500" : "border-gray-300"
//             } mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//             placeholder="0"
//           />
//         </div>

//         <CurrencySelect value={selectedValue} onChange={handleCurrencySelect} />
//       </div>
//     </>
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       forward={handleSubmit(onSubmit)}
//       forwardLabel={"Submit"}
//       backwardLabel={""}
//       backward={() => {}}
//       title="Edit Listing"
//       body={bodyContent}
//       disabled={isDisabled}
//     />
//   );
// };

// export default UpdateListingModal;

interface UpdateListingModalProps {
  listing: ListingItem;
  onClose: () => void;
  isOpen: boolean;
}

const UpdateListingModal = ({
  listing,
  onClose,
  isOpen,
}: UpdateListingModalProps) => {
  const { formattedCurrency: currency } = useCurrency();
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>();

  const currencyAddress = watch("currencyAddress");
  const assetPrice = watch("assetPrice");

  // Format the currency options
  const formattedCurrency = useMemo(() => {
    return currency?.map((item) =>
      item.address === "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"
        ? { ...item, address: NATIVE_TOKEN }
        : item
    );
  }, [currency]);

  // Find the matched currency option
  const matchedCurrency = useMemo(() => {
    return formattedCurrency?.find(
      (option) =>
        option.address.toLowerCase() === listing.currency.toLowerCase()
    );
  }, [formattedCurrency, listing.currency]);

  // Reset form when listing changes
  useEffect(() => {
    if (listing && matchedCurrency) {
      reset({
        currencyAddress: matchedCurrency,
        assetPrice: Number(toEther(BigInt(listing.price))),
      });
    }
  }, [listing, matchedCurrency, reset]);

  const setCustomValues = useCallback(
    (key: string, value: any) => {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (account) {
      setIsDisabled(true);
      try {
       updateListing(
        listing?.listingId,
        data.currency,
        data.assetPrice,
        account!
      ).then((data) => {
        if (data.success) {
          toast.success(data.message);
          onClose();
          reset();
          // updateListingModal.mutateListings();
        } else {
          toast.error(data.message);
        }
        
      });
      }
      catch (error: any) {
        toast.error(error.message);
        console.error(error)
      }
      finally{
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
              htmlFor="tokenPrice"
              className="block text-xs md:text-sm font-medium text-gray-700"
            >
              Token price
            </label>
            <input
              type="number"
              id="tokenPrice"
              {...register("assetPrice", {
                required: true,
              })}
              className={`${
                errors.assetPrice ? "border-red-500" : "border-gray-300"
              } mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              placeholder="0"
              value={assetPrice || ""}
              onChange={(e) => setCustomValues("assetPrice", e.target.value)} 
            />
          </div>

          <CurrencySelect
            value={currencyAddress} // Pass the watched value
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
      forwardLabel={"Submit"}
      backwardLabel={""}
      backward={() => {}}
      title="Edit Listing"
      body={bodyContent}
      disabled={isDisabled}
    />
  );
};

export default UpdateListingModal;
