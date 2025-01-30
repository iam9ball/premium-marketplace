'use client'
import React, { useState } from 'react';
import Button from '../Button';
import useDialog from '@/app/hooks/useDialog';
import { useActiveAccount } from "thirdweb/react";
import { buyListing } from '@/app/contracts/listing';
import useBuyListingModal from '@/app/hooks/useBuyListingModal';
import toast from 'react-hot-toast';
import { showToast } from '../WalletToast';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from 'next/navigation';
import { useSWRConfig } from 'swr';
import useInfiniteScrollMutateStore from '@/app/hooks/useInfiniteScrollMutateStore';
import useListingId from '@/app/hooks/useListingId';




interface DialogProps { 
  body?: string;
}



   
   

  
export const Dialog = ({ body}: DialogProps) => {
//   const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); 
  const pathName = usePathname();

//   const onClose = () => setIsOpen(false);
    const dialog = useDialog();
    const account = useActiveAccount();
    const { listingId } = useListingId();
     const { mutate } = useSWRConfig();
     const { marketplaceRefreshListings } = useInfiniteScrollMutateStore();
     const { onClose, onOpen } = useBuyListingModal();

 const selectYes = async() => {
     dialog.setYes()
     if (account) {
       setIsDisabled(true);
        console.log(account.address);
        console.log(listingId);
        console.log(account);
       try {
         await buyListing(
           account.address,
           listingId!,
           account
         ).then(async (data: any) => {
           if (data.success) {
             toast.success(data.message!);
             onClose();
             
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
  }

  const selectNo = () => {
    // console.log(listingId)
    dialog.setNo()
    dialog.onClose()
    onOpen();
  }

   
   return (
     <AnimatePresence>
       {dialog.isOpen && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={dialog.onClose}
           style={{
             position: "fixed",
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             backgroundColor: "rgba(0, 0, 0, 0.5)",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             zIndex: 1000,
           }}
         >
           <motion.div
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.95, opacity: 0 }}
             onClick={(e) => e.stopPropagation()}
             style={{
               backgroundColor: "#1F2937",
               borderRadius: "8px",
               padding: "24px",
               width: "90%",
               maxWidth: "400px",
               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
             }}
           >
             <h2
               style={{
                 color: "#F3F4F6",
                 fontSize: "24px",
                 fontWeight: "bold",
                 marginBottom: "16px",
                 textAlign: "center",
               }}
             >
               Confirm Action
             </h2>
             <p
               style={{
                 color: "#D1D5DB",
                 fontSize: "16px",
                 marginBottom: "24px",
                 textAlign: "center",
               }}
             >
               {body}
             </p>
             <div
               style={{
                 display: "flex",
                 justifyContent: "center",
                 gap: "16px",
               }}
             >
               <Button
                 onClick={selectYes}
                 style={{
                   backgroundColor: "#EF4444",
                   color: "white",
                   border: "none",
                   padding: "8px 16px",
                   borderRadius: "4px",
                   fontSize: "16px",
                   cursor: "pointer",
                   transition: "background-color 0.3s",
                 }}
                 actionLabel="Yes"
               />

               <Button
                 onClick={selectNo}
                 style={{
                   backgroundColor: "#4B5563",
                   color: "white",
                   border: "none",
                   padding: "8px 16px",
                   borderRadius: "4px",
                   fontSize: "16px",
                   cursor: "pointer",
                   transition: "background-color 0.3s",
                 }}
                 actionLabel="No"
               />
             </div>
           </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
   );
  }



export default Dialog;







  

// // Preview component
// const DialogPreview: React.FC = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         backgroundColor: "#111827",
//         color: "white",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <h1 style={{ marginBottom: "20px" }}>Dialog Component Preview</h1>
//       <button
//         onClick={() => setIsDialogOpen(true)}
//         style={{
//           backgroundColor: "#3B82F6",
//           color: "white",
//           border: "none",
//           padding: "12px 24px",
//           borderRadius: "4px",
//           fontSize: "18px",
//           cursor: "pointer",
//           transition: "background-color 0.3s",
//         }}
//       >
//         Open Dialog
//       </button>
//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         title="Confirm Action"
//         body="Are you sure you want to proceed with this action?"
//         onYes={() => {
//           console.log("Yes clicked");
//           setIsDialogOpen(false);
//         }}
//         onNo={() => {
//           console.log("No clicked");
//           setIsDialogOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export { Dialog, DialogPreview };

