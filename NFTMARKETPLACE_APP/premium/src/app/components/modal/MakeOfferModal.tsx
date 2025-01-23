"use client";

import Modal from "./Modal";
import { useCallback, useState, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Heading from "../Heading";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import useMakeOfferModal from "@/app/hooks/useMakeOfferModal";
import SwitchablePicker, { PickerType } from "../SwitchablePicker";
import dayjs from 'dayjs';
import { makeOffer } from "@/app/contracts/offer";



interface DateType {
  $d: Date;
}


export default function OfferModal() {
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);
  const offerModal = useMakeOfferModal();
  const [type, setType] = useState<PickerType>('date');
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      offerAmount: null,
      offerDuration: {
        date: 0,
        time: 0
      }
    },
  });


  

  // Watch the current duration value based on type
  const pickerValue = watch(`offerDuration.${type}`);

  

const formattedTimeStamp = (time: DateType, date: DateType) => {
  const year = dayjs(date?.$d).year();
  const month = dayjs(date?.$d).month();
  const day = dayjs(date?.$d).date();
  const hour = dayjs(time?.$d).hour();
   const minute = dayjs(time?.$d).minute();
   const seconds = dayjs(time?.$d).second();
  const formattedTime = `${year}-${month + 1}-${day} ${hour}:${minute}:${seconds}`;  
  const timeStamp = dayjs(formattedTime).unix();
  return timeStamp;
  
};
  const onSubmit = (data: FieldValues) => {
   const timeStamp = formattedTimeStamp(data.offerDuration.time, data.offerDuration.date);
   if(timeStamp < Math.floor(Date.now() / 1000)) {
     toast.error('Offer duration should be greater than current time');
     return;
   }
  const duration = timeStamp - Math.floor(Date.now() / 1000);
    if(account) {
      setIsDisabled(true);
      makeOffer(BigInt(duration), data.offerAmount, offerModal.listingId!, account).then((data) => {
        
           if(data.success){
          toast.success(data.message!);
          offerModal.onClose();
          reset();
           } else {
            toast.error(data.message!)
           }
           setIsDisabled(false);
        
      })
    } else {
      showToast();
    }
    
  };

  const setCustomValues = useCallback((key: any, value: any) => {
    setValue(key, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue]);

  const onDurationChange = useCallback((value: any) => { 
 
    setCustomValues(`offerDuration.${type}`, value);
  }, [setCustomValues, type]);

  const bodyContent = (
    <div className="flex flex-col gap-7">
      <Heading
        title="Make a reasonable amount and duration for this offer"
        titleClassName="text-sm md:text-base"
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="tokenPrice" 
            className="block sm:text-xs text-[10px] font-black text-black"
          >
            Amount
          </label>
          <input 
            type="number" 
            id="tokenPrice"  
            {...register("offerAmount", { required: true })} 
            className={`${errors.offerAmount ? "border-red-500" : "border-gray-300"} border-2 rounded-lg p-2 w-full placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
            placeholder="0" 
          />
        </div>

        <SwitchablePicker 
          onChange={onDurationChange} 
          setType={setType} 
          type={type} 
          value={pickerValue}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        title="Buy from listing"
        isOpen={offerModal.isOpen}
        onClose={offerModal.onClose}  
        forward={handleSubmit(onSubmit)}   
        forwardLabel="Submit"
        body={bodyContent}
        disabled={isDisabled}
      />
    </div>
  );
}