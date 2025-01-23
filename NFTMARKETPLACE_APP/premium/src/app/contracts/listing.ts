import {
  sendTransaction,
  prepareContractCall,
  readContract,
} from "thirdweb";
import { anvil, polygonAmoy } from "thirdweb/chains";
import {contractAddress, marketContract} from "./constant"
import { client } from "../client";
import { Account } from "thirdweb/wallets";
import { listingFee, listingInfo, getListingType, getPlatformFee } from "./listingInfo";
import { NATIVE_TOKEN } from "../utils/address";
import {toWei} from "thirdweb/utils"

import { approve, isERC721 } from "thirdweb/extensions/erc721";
import { isERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { Contract } from "../utils/Contract";


export enum ListingType {
        BASIC,
        ADVANCED,
        PRO
    }


   
 export const createListing = async ({assetAddress, assetId, currencyAddress, assetPrice, listingPlan, reserved}:{
  assetAddress: string,
  assetId: bigint,
  currencyAddress: string,
  assetPrice: bigint,
  listingPlan: ListingType,
  reserved: boolean
 }, account:Account) => {
  console.log("yes")
   const data =  await listingInfo(listingPlan);
   let fee: bigint | undefined ;
   if (currencyAddress == NATIVE_TOKEN){
   
      fee = await listingFee(currencyAddress, data?.[1]!)
     
         console.log(fee);
       
   }
   else {
    fee = undefined;
   }
    
  // Approve the contract 
  const assetContract = Contract(assetAddress);


   const erc721 = await isERC721({
     contract: assetContract,
   });
   
   const erc1155 = await isERC1155({
    contract: assetContract,
  });
   
    
  let approveTransaction;
   if (erc721) {
    approveTransaction = approve({
    contract: assetContract,
    to: contractAddress,
    tokenId: assetId
   });
   } else if (erc1155) {
     approveTransaction = setApprovalForAll({
   contract: assetContract,
   operator: contractAddress,
   approved: true
});
  
   }
       

// Send the transaction
try {
   await sendTransaction({ account, transaction: approveTransaction! });
}
catch (error) {
  console.log(error);
    return {
      message: "Error approving market: Market must be approved to proceed with transaction"
    }
}
  
  const priceInWei = toWei(assetPrice.toString());

    
  const transaction = prepareContractCall({
  contract: marketContract,
  method: "createListing",
  params: [{
    assetContract: assetAddress,
    tokenId: assetId,
    currency: currencyAddress,
    pricePerToken: priceInWei,
    listingType: listingPlan,
    reserved,
  }],
  
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
  message: "Listing created successfully"
  }
} catch (error: any) {
  console.log(error);
  let message;
  if (error?.message.includes('__DirectListing_TransferFailed')) {
   message = "Error transferring fee: Make sure you are sending a sufficient amount"  
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




export const buyListing = async (recipientAddress: string , listingId: bigint, account: Account) => {
let fee: bigint | undefined ;
   

    const data = await readContract({
     contract: marketContract,
     method:"getListing",
      params: [listingId]
    })

  if (data.currency == NATIVE_TOKEN){
   
      fee = data.pricePerToken
         console.log(fee); 
   }
   else {
    fee = undefined;
   }

  const transaction = prepareContractCall({
  contract: marketContract,
  method: "buyFromListing",
  params: [listingId, recipientAddress],
  
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
  message: "Listing purchased successfully"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__DirectListing_BuyerNotApproved')) {
   message = "You are not approved to buy this reserved listing"  
  }
   
   if (error?.message.includes('__DirectListing_InvalidRequirementToCompleteASale')){
    message = "Error purchasing listing: You cannot purchase this listing"
  }
  if (error?.message.includes('__DirectListing_InsufficientFunds')){
    message = "Error purchasing listing: Make sure you are sending enough funds"
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


export const updateListing = async (listingId: bigint,  currency: string,  pricePerToken: bigint,  account: Account) => {

  const transaction = prepareContractCall({
  contract: marketContract,
  method: "updateListing",
  params: [listingId, {currency, pricePerToken}],
  
});


try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Listing updated successfully"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__DirectListing_NotAuthorizedToUpdate')) {
   message = "You are not authorized to update this listing"  
  }
   
   if (error?.message.includes('__DirectListing_InvalidId')){
    message = "Error: Invalid listing"
  }
  if (error?.message.includes('__DirectListing_InvalidListingCurrency')){
    message = "Error: Invalid currency"
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




export const updateListingPlan = async (listingId: bigint,  listingPlan:ListingType,  account: Account) => {

  
   

    const listing = await readContract({
     contract: marketContract,
     method:"getListing",
      params: [listingId]
    })

    
    let fee: bigint | undefined ;

  if (listing.currency == NATIVE_TOKEN){


    const data = await readContract({
     contract: marketContract,
     method:"getListingType",
      params: [listingPlan]
    })
   
     fee = await readContract({
     contract: marketContract,
     method:"getPlatformFee",
      params: [listing.currency, data[1]]
    })
     
   }
   else {
    fee = undefined;
   }


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "updateListingPlan",
  params: [listingId, listingPlan],
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
  message: "Listing Plan updated"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__DirectListing_NotAuthorizedToUpdate')) {
   message = "You are not authorized to update this listing"  
  }
   
   if (error?.message.includes('__DirectListing_TransferFailed')){
    message = "Error: Transfer failed"
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



export const cancelListing = async (listingId: bigint, account: Account) => {

  const transaction = prepareContractCall({
  contract: marketContract,
  method: "cancelListing",
  params: [listingId],
  
});


try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Listing cancelled"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__DirectListing_NotAuthorizedToCancel')) {
   message = "You are not authorized to cancel this listing"  
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



export const approveBuyerForListing = async (listingId: bigint, buyer: string, account: Account) => {

  const transaction = prepareContractCall({
  contract: marketContract,
  method: "approveBuyerForListing",
  params: [listingId, buyer],
  
});


try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Buyer approved for listing"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__DirectListing_NotAuthorizedToApproveBuyerForListing')) {
   message = "You are not authorized to approve a buyer"  
  }
   
  if (error?.message.includes('__DirectListing_InvalidAddress')) {
   message = "Error: Invalid address"  
  }
  if (error?.message.includes('__DirectListing_CanOnlyApproveABuyer')) {
   message = "Error: You can only approve a buyer "  
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



export const removeApprovedBuyerForListing = async (listingId: bigint, account: Account) => {

  const transaction = prepareContractCall({
  contract: marketContract,
  method: "removeApprovedBuyerForListing",
  params: [listingId],
  
});


try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Buyer unapproved for listing"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__DirectListing_NotAuthorizedToRemoveBuyerForListing')) {
   message = "You are not authorized to unapprove a buyer"  
  }
   
  
  if (error?.message.includes('__DirectListing_CanOnlyRemoveApprovedBuyer')) {
   message = "Error: You can only remove an approved buyer "  
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



