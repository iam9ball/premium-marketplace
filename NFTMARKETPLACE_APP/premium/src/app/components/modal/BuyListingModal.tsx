'use client'

import Heading from "../Heading";
import {FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import useBuyListingModal from "@/app/hooks/useBuyListingModal";
import { useState } from "react";
import { buyListing } from "@/app/contracts/listing";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import { useSWRConfig } from "swr";
import { usePathname } from "next/navigation";
import useInfiniteScrollMutateStore from "@/app/hooks/useInfiniteScrollMutateStore";
import useListingId from "@/app/hooks/useListingId";








 const BuyListingModal = () => {
   const buyListingModal = useBuyListingModal();
   const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      recipientAddress: "",
    }
  });
  const [isDisabled, setIsDisabled] = useState(false); 
   const account = useActiveAccount();
   const { mutate } = useSWRConfig();
    const pathName = usePathname();
    const { marketplaceRefreshListings } = useInfiniteScrollMutateStore();
    const {listingId} = useListingId();

   
   const onSubmit: SubmitHandler<FieldValues> = async (data) => {
     if (account) {
      setIsDisabled(true);
      try{
        console.log(data.recipientAddress);
        console.log(listingId);
        console.log(account);
       await buyListing(data.recipientAddress, listingId!, account).then(
         async (data: any) => {
           if (data.success) {
             toast.success(data.message!);
             buyListingModal.onClose();
             reset();

             console.log("yes clicked");

             switch (true) {
               case pathName == `listing/${listingId}`:
                 await mutate(`listing/${listingId}`);
                 break;
               default:
                 await marketplaceRefreshListings?.();
                 break;
             }
             console.log("no clicked");
           } else {
             toast.error(data.message);
           }
         }
       );
      } 
      catch (error: any) {
         toast.error(error.message);
        console.error(error)

      }
      finally{
        setIsDisabled(false);
      }
   
        
     } else {
       buyListingModal.onClose();
       showToast();  
     }
  }  


   

    let bodyContent;
{( bodyContent = (
     
    <>      
      <Heading title="Who is the recipient?" subtitle="Choose who will recieve this art" titleClassName="text-xl font-bold "  subtitleClassName="font-light text-sm text-neutral-500 mt-1  mb-2"/>
        <div className="flex flex-col gap-2">
          <label htmlFor="recipientAddress" className="block text-sm font-black text-black">Recipient Address</label>
          <input type="text" id="recipientAddress" {...register("recipientAddress", {
             required: true,
          })} className="border border-gray-300 rounded-lg p-2 w-full pl-6 placeholder:text-sm" placeholder="0x123...789" />   
       </div>

    </>
   

     )); } 


  return (
    <Modal
    isOpen={buyListingModal.isOpen}
    onClose={buyListingModal.onClose}
    forward={handleSubmit(onSubmit)}
    forwardLabel={"Submit"}
    backwardLabel={""}
    backward={()=>{}}
    title="Buy from Listing"
    body={bodyContent}
    disabled={isDisabled}
    />
  ) 
}

export default BuyListingModal;
