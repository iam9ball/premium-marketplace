import { prepareContractCall, readContract, sendTransaction, sendAndConfirmTransaction, toWei } from "thirdweb";
import { getListing } from "./listingInfo";
import { NATIVE_TOKEN } from "../utils/address";
import { Account } from "thirdweb/wallets";
import { marketContract } from "../constant";

export const makeOffer = async (duration: bigint, totalPrice: string , listingId: bigint, account: Account) => {
  toWei(totalPrice)

let fee: string;
   

   const data = await getListing(listingId);
  if (data?.currency == NATIVE_TOKEN){
   
      fee = totalPrice
         console.log(fee); 
   }
   else {
    fee = "0";
   }
   
   const priceInWei = toWei(fee);
  const transaction = prepareContractCall({
  contract: marketContract,
  method: "makeOffer",
  params: [ {totalPrice: priceInWei!,  duration}, listingId],
  value: priceInWei


});
try {

        const  transactionReceipt  = await sendAndConfirmTransaction({
        account,
        transaction,
        }); 
        // console.log(transactionHash)

        if (transactionReceipt.status == "success") {
            return {
        success: true,
        message: "Offer sent successfully"
        }
        }
        return {
          success: false,
          message: "Error sending offer"
        }

       
} catch (error: any) {
   let message;
  if (error?.message.includes('__Offer_InvalidListingId')) {
   message = "Error: Invalid listing"  
  }
   
   if (error?.message.includes('__Offer_InsufficientFunds')){
    message = "Insufficient Offer amount"
  }
  else {
    message = "An unexpected error occured: Try again"
  }



  return {
    success: false,
    message: message 
  }

}
}
export const cancelOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "cancelOffer",
  params: [ offerId,  listingId],


});
try {

        const transactionReceipt = await sendAndConfirmTransaction({
        account,
        transaction,
        }); 
       
        if (transactionReceipt.status == "success") {
          return {
        success: true,
        message: "Offer cancelled"
        }
        } return {
          success: false,
          message: "Error cancelling offer"
        }
      
} catch (error: any) {
   let message;
  if (error?.message.includes('__Offer_InvalidListingId')) {
   message = "Error: Invalid listing"  
  }
   
   if (error?.message.includes('__Offer_UnauthorizedToCall')){
    message = "You are not authorized to cancel this offer"
  }
  else {
    message = "An unexpected error occured: Try again"
  }



  return {
    success: false,
    message: message 
  }

}
}

export const acceptOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "acceptOffer",
  params: [ offerId,  listingId],


});
  try {

        const  transactionReceipt  = await sendAndConfirmTransaction({
        account,
        transaction,
        }); 

         if (transactionReceipt.status == "success") {
          return {
        success: true,
        message: "Offer accepted"
        }
         }
         return {
          success: false,
        message: "Error accepting Offer "
         }
        
} catch (error: any) {
   let message;
  if (error?.message.includes('__Offer_InvalidListingId')) {
   message = "Error: Invalid listing"  
  }
   
   if (error?.message.includes('__Offer_UnauthorizedToCall')){
    message = "You are not authorized to accept this offer"
  }
   if (error?.message.includes('__Offer_MarketPlaceUnapproved')){
    message = "Error: Offer is not valid "
  }
   if (error?.message.includes('__Offer_InsufficientFunds')){
    message = "Error: Insufficient funds"
  }
  else {
    message = "An unexpected error occured: Try again"
  }



  return {
    success: false,
    message: message 
  }

}
}
export const rejectOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "rejectOffer",
  params: [ offerId,  listingId],


});
  try {

        
        const  transactionReceipt  = await sendAndConfirmTransaction({
        account,
        transaction,
        }); 

         if (transactionReceipt.status == "success") {
          return {
        success: true,
        message: "Offer rejected"
        }
         }
         return {
          success: false,
        message: "Error rejecting Offer "
         }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Offer_InvalidListingId')) {
   message = "Error: Invalid listing"  
  }
   
   if (error?.message.includes('__Offer_UnauthorizedToCall')){
    message = "You are not authorized to accept this offer"
  }
  
   if (error?.message.includes('__Offer_InsufficientFunds')){
    message = "Error: Insufficient funds"
  }
  else {
    message = "An unexpected error occured: Try again"
  }



  return {
    success: false,
    message: message 
  }

}
}
