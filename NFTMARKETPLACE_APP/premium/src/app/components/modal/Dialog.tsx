'use client'
import React, { useState } from 'react';
import Button from '../Button';
import useDialog from '@/app/hooks/useDialog';
import { useActiveAccount } from "thirdweb/react";
import { buyListing } from '@/app/contracts/listing';
import useBuyListingModal from '@/app/hooks/useBuyListingModal';
import toast from 'react-hot-toast';
import { showToast } from '../WalletToast';



interface DialogProps { 
  body?: string;
}



   
   

  
export const Dialog = ({ body}: DialogProps) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const onClose = () => setIsOpen(false);
    const dialog = useDialog();
    const account = useActiveAccount();
    const buyListingModal = useBuyListingModal();

 const selectYes = () => {
     dialog.setYes()
     if (account) {
   
     dialog.onClose()

    buyListing(account?.address!, buyListingModal.listingId!, account).then((data) => {
      if(data.success){
        toast.success(data.message!);
        
      }
      else {
        toast.error(data.message!);
      }
    })
     } else {
       showToast();  
     }
  }

  const selectNo = () => {
    // console.log(listingId)
    dialog.setNo()
    dialog.onClose()
    buyListingModal.onOpen();
  }

   { if (dialog.isOpen) {
    return (
    <div className="relative flex justify-center">

      
        <div
          className="fixed inset-0 overflow-y-auto transition duration-300 ease-out z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                

                <div className="mt-2 text-center">
                  
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {body}
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:flex sm:items-center sm:justify-end">

                
              <Button  onClick={selectYes} 
            classNames="w-[15%] inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  sm:text-sm" actionLabel='Yes'/>
           
            <Button  onClick={selectNo} 
            classNames="w-[15%] inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ml-1 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  sm:text-sm" actionLabel='No'/>
           
                
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
};
   
         
        
    
   
}   
 
};

export default Dialog;