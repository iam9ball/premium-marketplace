import { prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { getListing } from "./listingInfo";
import { NATIVE_TOKEN } from "../utils/address";
import { Account } from "thirdweb/wallets";
import { marketContract } from "./constant";

export const makeOffer = async (duration: bigint, totalPrice: bigint , listingId: bigint, account: Account) => {
let fee: bigint | undefined ;
   

   const data = await getListing(listingId);
  if (data?.currency == NATIVE_TOKEN){
   
      fee = totalPrice
         console.log(fee); 
   }
   else {
    fee = undefined;
   }

  const transaction = prepareContractCall({
  contract: marketContract,
  method: "makeOffer",
  params: [ {totalPrice: fee!,  duration}, listingId],
  value: fee


});
try {

        const { transactionHash } = await sendTransaction({
        account,
        transaction,
        }); 
        console.log(transactionHash)

        return {
        success: true,
        message: "Offer sent"
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

        const { transactionHash } = await sendTransaction({
        account,
        transaction,
        }); 
        console.log(transactionHash)

        return {
        success: true,
        message: "Offer sent"
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

        const { transactionHash } = await sendTransaction({
        account,
        transaction,
        }); 
        console.log(transactionHash)

        return {
        success: true,
        message: "Offer accepted"
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

        const { transactionHash } = await sendTransaction({
        account,
        transaction,
        }); 
        console.log(transactionHash)

        return {
        success: true,
        message: "Offer accepted"
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
