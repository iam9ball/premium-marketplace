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







 const BuyListingModal = () => {
   const buyListingModal = useBuyListingModal();
   const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      recipientAddress: "",
    }
  });
  const [isDisabled, setIsDisabled] = useState(false); 
   const account = useActiveAccount();
   
   const onSubmit: SubmitHandler<FieldValues> = (data) => {
     if (account) {
      setIsDisabled(true);
    buyListing(data.recipientAddress, buyListingModal.listingId!, account).then((data) => {
      if(data.success){
        toast.success(data.message!);
        buyListingModal.onClose();
        reset(); 
        buyListingModal.mutateListings();
      }
      else {
        toast.error(data.message!);
      }
      setIsDisabled(false);
     
    })
        
     } else {
       showToast();  
     }
  }  


   

    let bodyContent;
{( bodyContent = (
     
    <>      
      <Heading title="Who is the recipient?" subtitle="Choose who will recieve this art" titleClassName="text-xl font-bold ml-4"  subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4 mb-2"/>
        <div className="flex flex-col gap-2">
          <label htmlFor="assetAddress" className="block text-sm font-black text-black">Recipient Address</label>
          <input type="text" id="assetAddress" {...register("recipientAddress", {
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
