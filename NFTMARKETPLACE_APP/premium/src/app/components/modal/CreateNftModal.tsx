'use client'
import useCreateNftModal from "@/app/hooks/useCreateNftModal";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import Modal from "./Modal";
import { useCallback, useMemo, useState, useRef } from "react";
import Heading from "../Heading";
import ToggleButton from "../ToggleButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import Image from "next/image";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import createNFT from "@/app/contracts/createNFT";
import { useActiveAccount } from "thirdweb/react";
import {showToast} from "../WalletToast";
import toast from "react-hot-toast";
import { timeStamp } from "console";
import { useSWRConfig } from "swr";
import { useNotifStore } from "@/app/hooks/useNotifStore";
import { blobUrlToBase64 } from "@/app/utils/blobUrlToBase64";


enum  STEPS {
    TOKENTYPE,
    IMAGE,
    INFO
}

export enum TOKENTYPE {
  SINGLE,
  MULTIPLE,
}

const CreateNftModal = () => {
    const nftModal = useCreateNftModal();
    const listingModal = useCreateListingModal();
    const account = useActiveAccount();
    const [tokenType, setTokenType] = useState<TOKENTYPE>();
    const [step, setStep] = useState(STEPS.TOKENTYPE);
    const [previewUrl, setPreviewUrl] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [onMarket, setOnMarket] = useState(true);
     const { register, handleSubmit, watch, setValue, reset, formState: {errors} } = useForm({
    defaultValues: {
      tokenType: null,
      image: File,
      name: '',
      symbol: '',
      description: "",
      royalties: 0,
      amount: 1
    },
    mode: 'onSubmit',
    reValidateMode: "onSubmit"
  });
  const [isLoading, setIsLoading] = useState(false);
  const {mutate} = useSWRConfig();
  const {setNftAddress} = useNotifStore();

    

     const onSubmit: SubmitHandler<FieldValues> = async(data) => {
      if (step !== STEPS.INFO) {
        return onNext();
      }
      
          if (account) {
              setIsLoading(true);
              try {
                await createNFT(account, data).then(async(data:any) =>  { 
          
              if(data.success){
                      nftModal.onClose();
                      toast.success(data.message);
                      const base64Image = await blobUrlToBase64(previewUrl);

                      setNftAddress({
                        address: data.contractAddress!,
                        timestamp: Math.floor(Date.now() / 1000),
                        image: base64Image!,
                        name: data.name
                      });
                      reset();
                      await mutate("notif");
                      setTokenType(undefined);
                      setPreviewUrl("");
                      setOnMarket(true);
                      setStep(STEPS.TOKENTYPE);
                     if (onMarket) {
                      listingModal.onOpen();
                      listingModal.setAddress(data.contractAddress!)
                     }
                
              } else {
                    toast.error(data.message);
              } 
          }
          
          )}
          catch (error) {
            toast.error("Unexpected error occured, Try again");
            console.error(error)
          } finally {
            setIsLoading(false);
          }
    } else { 
         nftModal.onClose();   
         showToast();
         
         // connect wallet
        } 
      
     };



     const onBack = () => {
        setStep((value) => value - 1 )
    }

     const onNext = () => {
      if (step === STEPS.IMAGE){
        //toast image required
        if (!previewUrl) {
          toast.error("Please select an image");
          return
        }
       
      }
      setStep((value) => value + 1);
     }


     const forwardLabel = useMemo(() => {

      if (step === STEPS.INFO) {
            return "Submit";
      }
      else if (step === STEPS.TOKENTYPE) {
        if (tokenType === TOKENTYPE.MULTIPLE || tokenType === TOKENTYPE.SINGLE) {
          return "Next";
      }
      return undefined;
     }     
     else {
      return "Next"
     }
     }, [step, tokenType])

     const backwardLabel = useMemo(() => {

      if (step === STEPS.TOKENTYPE) {
        return undefined;
      }
        return "Back"      
      
     }, [step])

     const amount = watch("amount");

      const setCustomValues = useCallback((key: any, value:any ) => {
        setValue(key, value, {
            shouldValidate: true,
            shouldDirty: true
          })
    }, [setValue])

    const onDrop = useCallback((acceptedFiles: File[]) => {
      
    if (acceptedFiles?.[0]) {
        const selectedFile = acceptedFiles[0]
        setCustomValues("image", selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(previewUrl);
        console.log(previewUrl);
    }     
}, [setCustomValues]);

 const { getRootProps, getInputProps} = useDropzone({
    accept: {
       'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    multiple: false,
    onDrop,
    noClick: true
  });
  
   
  const handleToggle = (value: boolean) => {
     setOnMarket(value);
  }
 
   const handleCounter = useCallback((func: string) => {
    if (func == "current") {
      if (inputRef.current){
        setCustomValues("amount", inputRef.current.value);
      }
     
    }
    else if (func == "increase") {
       setCustomValues("amount", amount + 1 || 1);
    }
    
    else if (func == "decrease") {
      if (amount == 1) {
        return
      }
        setCustomValues("amount", amount - 1);
       
    }
   }, [amount, setCustomValues]) 

   
   
    const handleTokenType = (type:TOKENTYPE) => {
     setTokenType(type);
     setCustomValues("tokenType", type);
    }

   

      let bodyContent;
      
      //TOKENTYPE
      {(step == STEPS.TOKENTYPE) && (bodyContent = (
        
       <div className="flex flex-col gap-6 ">
         <Heading title="Choose Type" subtitle="Select the type of token you wish to create" titleClassName="text-xl font-bold ml-4" subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4"/>
         <div className="flex w-full justify-evenly ">
           <div className={`border border-gray-300 w-[40%] rounded-lg py-4 px-2 cursor-pointer ${tokenType == TOKENTYPE.SINGLE && ("border-rose-500")}`} onClick={() => { handleTokenType(TOKENTYPE.SINGLE)}}>
             <Heading title="Single" subtitle="Create a single unique piece of art" center titleClassName="md:text-lg font-bold" subtitleClassName="font-light text-[12px] md:text-sm text-neutral-500 mt-1"/>
           </div>
          <div className={`border border-gray-300 w-[40%] rounded-lg py-4 px-2 cursor-pointer ${tokenType == TOKENTYPE.MULTIPLE && ("border-rose-500")}`}  onClick={() => { handleTokenType(TOKENTYPE.MULTIPLE)}}>
             <Heading title="Multiple" subtitle="Create multiple unique piece of art" center titleClassName="md:text-lg font-bold" subtitleClassName="font-light text-[12px] md:text-sm text-neutral-500 mt-1"/>
           </div>
         </div>
       </div>
     )); }
      
     //IMAGE
    {(step == STEPS.IMAGE) && (bodyContent = (
      <div className="flex flex-col  gap-6">
      <Heading title="Upload your image" titleClassName="font-bold ml-2"/>
    <label htmlFor="image" className="flex flex-col relative items-center w-[50%] py-7 md:py-16 px-5 mx-auto max-w-md mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl" {...getRootProps()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 text-gray-500 dark:text-gray-400" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        
      {previewUrl ? <Image 
              src={previewUrl} 
              alt={"image"} 
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg  absolute top-0 left-0 "
              sizes="(max-width: 640px) 20vw,
                     40vw"
              priority
            />: <p className="mt-2 text-[10px] md:text-xs tracking-wide text-gray-500 dark:text-gray-400">Upload or drag & drop your image file SVG, PNG, JPG or JPEG. </p>}  

        <input id="image" className="hidden" {...getInputProps()}/>
    </label>
    </div>
     )); } 

     {(step == STEPS.INFO) && (bodyContent = (
      <div className="flex flex-col gap-4 md:gap-7">
       <div className="flex flex-col gap-4">
      
           <div className="flex gap-4">
                  <div className="flex-1">
          <label htmlFor="name" className="block text-xs md:text-sm font-medium text-gray-700">
                      Name
                    </label>
           <input type="text" id="name"  {...register("name", {
          required: true,
          maxLength: 25
        })} className={`${errors.name ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`} placeholder="My NFT" />
 

       </div>
          

        <div className="flex-1">
          <label htmlFor="symbol" className="block text-xs md:text-sm font-medium text-gray-700">
                      Symbol</label>
          <input type="text" id="symbol"  {...register("symbol", {
          required: true,
          maxLength: 5
        })} className={`${errors.symbol ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`} placeholder="MUN" />
 
      
        
          </div>
          </div>

       
       
        <div className="flex flex-col gap-2">
 <label htmlFor="description" className="block text-xs md:text-sm font-medium text-gray-700">Description{" "} <span className=" text-xs md:text-sm font-medium text-gray-700">(Optional)</span></label>

    <textarea id="description" placeholder="Tell people about your NFT" className="block font-xs mt-1 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-4 h-26 py-2.5 text-black placeholder:text-[12px] md:placeholder:text-[13px]" {...register("description", {
          maxLength: 500
        })}></textarea>
    
    

</div>
        <div className="flex flex-col gap-2 relative">
         <label htmlFor="royalties" className="block text-xs md:text-sm font-medium text-gray-700">Royalties</label>
          <input type="number"  min ="0" max = "50" id="royalties" className="border-2 border-gray-300 rounded-lg mt-1 p-2 w-full pl-6 placeholder:text-[12px] md:placeholder:text-[13px]" {...register("royalties", {
            min: 0,
          max: 50
        })} placeholder="10" />
          <div className="absolute left-2 top-1/2">%</div>
           
       </div>
        <div className="md:text-xs text-[8px] text-gray-500"> Suggested: 0%, 10%, 20%, 30%. Maximum is 50%</div>
         {tokenType === TOKENTYPE.MULTIPLE && (
          <>
           <p className="text-sm">How many would you like to mint?</p>
        <div className="flex">
        <span className= "cursor-pointer">
           <AiOutlineMinus  size={16}  onClick={()=> {handleCounter("decrease")}}/> 
         </span>  
	          <input className="border-0 border-b text-center text-sm border-b-black focus:border-b-black focus:border-b-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
            "type="number"
            id="amount"
            {...register("amount", {
              min: 1,
            onChange: ()=> {handleCounter("current")},
            valueAsNumber: true


          }) }
          
            />
           <span className= "cursor-pointer">
          <AiOutlinePlus size={16} onClick={()=> {handleCounter("increase")}}/>
          </span>
          </div>
          </>
        )}
        
        </div>

       
      <div className="flex w-full justify-between">
              <p className="text-sm">Put up NFT on market</p>
              <ToggleButton checked={onMarket} onChange={handleToggle}/>
       </div>        
  
      </div>
     )
    
    
    ); } 
 

  return (
    <Modal
    isOpen={nftModal.isOpen}
    onClose={nftModal.onClose}
    forward={handleSubmit(onSubmit)}
    forwardLabel={forwardLabel}
    backwardLabel={backwardLabel}
    backward={onBack}
    title="Create your NFT"
    body={bodyContent}
    disabled={isLoading}
    />
  )
}

export default CreateNftModal;
