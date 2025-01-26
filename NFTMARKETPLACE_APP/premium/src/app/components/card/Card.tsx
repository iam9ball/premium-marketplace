
"use client"
import React, { useCallback, useMemo } from 'react';
import Image from "next/image";
import Button from '../Button';
import useDialog from '@/app/hooks/useDialog';
import useListingId from '@/app/hooks/useListingId';
import useMakeOfferModal from '@/app/hooks/useMakeOfferModal';
import { StaticImageData } from "next/dist/shared/lib/get-img-props";




interface CardProps {
  src: string | StaticImageData;
  alt: string;
  name: string;
  id: string;
  price: string;
  currency: string;
  listingId: bigint;
  status: number,
  variant: "primary" | "secondary",
  onClick?: () => void

}

const Card = ({ src, alt, name, id, price, currency, listingId, status, variant, onClick}: CardProps) => {
  const dialog = useDialog();
  const makeOfferModal = useMakeOfferModal();
  const _listingId = useListingId();

  const handleMouseEnter = useCallback(() => {
    _listingId.setListingId(listingId)
  }, [_listingId , listingId])

  const handleMakeOffer = useCallback(() => {
    makeOfferModal.onOpen();
  }, [makeOfferModal]);

  const handleBuyListing = useCallback(() => {
    dialog.onOpen();
  }, [dialog]);

  

   const listingStatus = useMemo(() => {
      switch (status) {
        case 1: return {status:"Active", color: "text-green-700"};
        case 2: return  {status:"Sold", color: "text-rose-500"};
        case 3: return  {status:"Cancelled", color: "text-rose-500"};
        default: return {status:"Inactive", color: "text-orange-600"}
      }
    }, [status]);

    

    

  return (
    <div 
      className="relative h-[380px] w-full cursor-pointer border-1px border-rose-500 bg-rose-500 rounded-lg overflow-hidden 
                 shadow-lg transition-all duration-500 ease-in-out group"
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out blur"></div>
      <div className="absolute inset-[2px] bg-gray-900 rounded-lg z-10 overflow-hidden">
        <div className="relative h-[380px]">
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: 'cover' }}
            className={`transition-transform duration-500 ease-in-out ${variant === "primary" && "group-hover:scale-110" } `}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
        </div>
        
        <div className={`absolute inset-x-0 bottom-0 p-4 space-y-2 transition-all duration-500 ease-in-out transform translate-y-0 ${variant === "primary" && "group-hover:-translate-y-full" } `}>
          <div className='flex w-full justify-between'>
          <p className="text-xl font-bold text-white capitalize truncate ">{name}</p>
          <p className="text-xl font-bold text-rose-500">#{id}</p>
          </div>
           <div className='flex w-full items-center justify-between'>
          <p className="text-xl font-extrabold text-transparent bg-clip-text  bg-gradient-to-r from-rose-500 to-rose-700">
            {price} <span className="uppercase">{currency}</span>
          </p>
           <p className={`${listingStatus.color} font-extrabold text-sm`}>{listingStatus.status}</p>
          </div>
        </div>
        
        {
        variant === "primary" &&
        (
        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0">
          <Button 
            actionLabel="Make Offer" 
            classNames="w-full text-white bg-transparent border border-rose-500 
                       text-sm px-4 py-2 hover:bg-rose-500 rounded-lg 
                       transition-colors duration-300 backdrop-blur-sm"
            onClick={handleMakeOffer}
          />
          <Button 
            actionLabel="Buy Now"
            classNames="w-full text-white border border-rose-500 
                       text-sm px-4 py-2 bg-rose-500 hover:bg-rose-600 
                       rounded-lg transition-colors duration-300 backdrop-blur-sm"
            onClick={handleBuyListing}
          />
        </div>
        )
     }
      </div>
    </div>
  );
};

export default Card;



