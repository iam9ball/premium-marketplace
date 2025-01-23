"use client";
import React, {useCallback, useState} from "react";
import { AiFillBell, AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import Button from "../Button";
import useCreateNftModal from "@/app/hooks/useCreateNftModal";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import useCreateAuctionModal from "@/app/hooks/useCreateAuctionModal";
import Notifications from "../Notifications"
import { useRouter } from "next/navigation";
import { queryParams } from "@/app/utils/queryParams";
import { useActiveAccount } from "thirdweb/react";
import { showToast } from "../WalletToast";


 


export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setNotificationisOpen] = useState(false);
  const createNftModal = useCreateNftModal();
  const createListingModal = useCreateListingModal();
  const createAuctionModal = useCreateAuctionModal();
  const router = useRouter();
  const account  = useActiveAccount();

  

  const toggleOpen = useCallback(() => {
    setNotificationisOpen(false);
    setIsOpen((isOpen) => !isOpen);
  }, []);


  const handleMyListings = useCallback(() => {
    
    router.push(queryParams("/dashboard","listings", account?.address!));
    setIsOpen(false);
  
  }, []);
  const handleMyAuctions = useCallback(() => {
    
    router.push(queryParams("/dashboard","auctions", account?.address!));
    setIsOpen(false);
     
  }, []);
  const handleMyOffers = useCallback(() => {
     
    router.push(queryParams("/dashboard","offers", account?.address!));
    setIsOpen(false);
    
  }, []);

  
  const handleCreateListings = useCallback(() => {
    setIsOpen(false);
    createListingModal.onOpen()
  }, []);
  const handleCreateNFT = useCallback(() => {
    setIsOpen(false);
    createNftModal.onOpen()
  }, []);
  const handleCreateAuctions = useCallback(() => {
    setIsOpen(false);
    createAuctionModal.onOpen();
  }, []);

  const toggleNotifications = useCallback(() => {
    setIsOpen(false);
    setNotificationisOpen((isNotificationOpen) => !isNotificationOpen);
  }, []);

   
  return (
    <>
      <div className="relative flex flex-row md:w-[30%] items-center justify-evenly gap-3">
        <div
          className="hidden lg:block"
        >
          <Button variant="connect" defaultConnectButton={true}/>
        </div>
          <div className="cursor-pointer text-rose-500 relative">
          <AiFillBell  size={25} onClick={toggleNotifications}/>
          <span className=" absolute rounded-full h-1 w-1 top-[-2px] right-[-0.1px] text-rose-500 text-xs ">0</span>
          </div>
          
          <div
          onClick={toggleOpen}
          className="cursor-pointer text-rose-500"
          > 
           <AiOutlineMenu size={25}/>
          </div> 
      </div>
      {isOpen && (
        <div className="absolute rounded-md z-50 shadow-md w-3/7 sm:w-1/4 md:w-[20%] border-gray-400 overflow-hidden right-2 top-20 text-xs sm:text-sm md:text-base">
          <div className="flex flex-col cursor-pointer">
              <>
               
              
               <MenuItem onClick={handleMyListings} label="My Listings" />
                 <hr />

                <MenuItem onClick={handleMyAuctions} label="My Auctions" />
                 <hr />

                <MenuItem onClick={handleMyOffers} label="My Offers" />
                 <hr />
                
                <MenuItem onClick={handleCreateListings} label="Create Listing" />
                 <hr />

                <MenuItem onClick={handleCreateAuctions} label="Create Auction" />
                <hr />

                 <MenuItem onClick={handleCreateNFT} label="Create NFT" />
                 {/* <hr/> */}
                 <div className="lg:hidden  flex items-center justify-center">
                  <Button variant="connect" defaultConnectButton={true} primaryConnect  onClick={() => setIsOpen(false)}/>

                </div>
              </>
          
             
          </div>
        </div>
        )}  
        <Notifications  isOpen = {isNotificationOpen} />
    </>
  );
}
