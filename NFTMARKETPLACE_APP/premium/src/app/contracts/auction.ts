import {
  sendTransaction,
  prepareContractCall,
  readContract,
} from "thirdweb";
import { anvil } from "thirdweb/chains";
import {contractAddress, marketContract} from "./constant"
import { client } from "../client";
import { Account } from "thirdweb/wallets";
import { listingFee, listingInfo, getListingType, getPlatformFee } from "./listingInfo";
import { NATIVE_TOKEN } from "../utils/address";

import { approve, isERC721 } from "thirdweb/extensions/erc721";
import { isERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";


export enum ListingType {
        BASIC,
        ADVANCED,
        PRO
    }




   
 export const createAuction = async (
  assetContract: string,
  tokenId: bigint,
  currency: string,
  minimumBidAmount: bigint,
  buyoutBidAmount: bigint,
  bidBufferBps: bigint,
  startTimestamp: bigint,
  endTimestamp: bigint, 
  account:Account) => {

  




    
  const transaction = prepareContractCall({
  contract: marketContract,
  method: "createAuction",
  params: [{
    assetContract,
    tokenId,
    currency,
    minimumBidAmount,
    buyoutBidAmount,
    bidBufferBps,
    startTimestamp,
    endTimestamp, 
  }],
  


});

try {
    const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction created successfully"
  }
} catch (error: any) {
  let message;
  if (error?.message.includes('__Auction_InvalidTime')) {
   message = "Error: Invalid Time"  
  }
  if (error?.message.includes('__Auction_InvalidBuyoutBidAmount')) {
   message = "Your buyout bid cannot be less than minimum bid"  
  }
  if (error?.message.includes('__Auction_InvalidBidBuffer')) {
   message = "Error: Max bid buffer is 100 bps"  
  }
  if (error?.message.includes('__Auction_InvalidDuration')) {
   message = "Error: Max duration for auction is 90 minutes"  
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








export const cancelAuction = async (auctionId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "cancelAuction",
  params: [auctionId],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction cancelled"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_UnAuthorizedToCall')) {
   message = "Error: You cannot cancel this auction"  
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





export const updateAuction = async (auctionId: bigint,  
  currency: string, 
  minimumBidAmount: bigint, 
  buyoutBidAmount: bigint,
  bidBufferBps: bigint,
  startTimestamp: bigint,
  endTimestamp: bigint, 
  account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "updateAuction",
  params: [auctionId, {
  currency, 
  minimumBidAmount, 
  buyoutBidAmount,
  bidBufferBps,
  startTimestamp,
  endTimestamp
}],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction updated"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_UnAuthorizedToCall')) {
   message = "Error: You cannot update this auction"  
  }
  if (error?.message.includes('__Auction_InvalidAuctionState') || error?.message.includes('__Auction_InvalidTime')) {
   message = "Error: Auction is no longer valid"  
  }
  if (error?.message.includes('__Auction_InvalidBuyoutBidAmount')) {
   message = "Your buyout bid cannot be less than minimum bid"  
  }
   if (error?.message.includes('__Auction_InvalidBidBuffer')) {
   message = "Error: Max bid buffer is 100 bps"  
  }
  if (error?.message.includes('__Auction_InvalidDuration')) {
   message = "Error: Max duration for auction is 90 minutes"  
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



export const bidInAuction = async (auctionId: bigint , bidAmount: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "bidInAuction",
  params: [auctionId, bidAmount],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Bid placed"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_InvalidBidTime')) {
   message = "Error: Auction is no longer valid"  
  }
   
   if (error?.message.includes('__Auction_InvalidBidAmount')){
    message = "Error placing bid: Try adjusting your bid"
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


export const collectAuctionPayout = async (auctionId: bigint,  account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "collectAuctionPayout",
  params: [auctionId],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction payout transferred"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_InvalidAuctionState')) {
   message = "Error: Auction is no longer valid"  
  }
   
   if (error?.message.includes('__Auction_UnAuthorizedToCall')){
    message = "You are not authorized to collect payout for this listing"
  }
   if (error?.message.includes('__Auction_NoBidYet')){
    message = "Error: No bid placed"
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

export const collectAuctionTokens = async (auctionId: bigint,  account: Account) => {


  const transaction = prepareContractCall({
  contract: marketContract,
  method: "collectAuctionTokens",
  params: [auctionId],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction payout transferred"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_InvalidAuctionState')) {
   message = "Error: Auction is no longer valid"  
  }
   
   if (error?.message.includes('__Auction_UnAuthorizedToCall')){
    message = "You are not authorized to collect payout for this listing"
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







































// export const updateListing = async (listingId: bigint,  currency: string,  pricePerToken: bigint,  account: Account) => {

//   const transaction = prepareContractCall({
//   contract,
//   method: "updateListing",
//   params: [listingId, {currency, pricePerToken}],
  
// });


// try {

// const { transactionHash } = await sendTransaction({
//   account,
//   transaction,
// }); 
// console.log(transactionHash)

// return {
//   success: true,
//   message: "Listing updated successfully"
//   }
// } catch (error: any) {
//    let message;
//   if (error?.message.includes('__DirectListing_NotAuthorizedToUpdate')) {
//    message = "You are not authorized to update this listing"  
//   }
   
//    if (error?.message.includes('__DirectListing_InvalidId')){
//     message = "Error: Invalid listing"
//   }
//   if (error?.message.includes('__DirectListing_InvalidListingCurrency')){
//     message = "Error: Invalid currency"
//   }
//   else {
//     message = "An unexpected error occured: Try again"
//   }

//   return {
//     success: false,
//     message: message 
//   }

// }

// }




// export const updateListingPlan = async (listingId: bigint,  listingPlan:ListingType,  account: Account) => {

  
   

//     const listing = await readContract({
//      contract,
//      method:"getListing",
//       params: [listingId]
//     })

    
//     let fee: bigint | undefined ;

//   if (listing.currency == NATIVE_TOKEN){


//     const data = await readContract({
//      contract,
//      method:"getListingType",
//       params: [listingPlan]
//     })
   
//      fee = await readContract({
//      contract,
//      method:"getPlatformFee",
//       params: [listing.currency, data[1]]
//     })
     
//    }
//    else {
//     fee = undefined;
//    }


//   const transaction = prepareContractCall({
//   contract,
//   method: "updateListingPlan",
//   params: [listingId, listingPlan],
//   value: fee
  
// });


// try {

// const { transactionHash } = await sendTransaction({
//   account,
//   transaction,
// }); 
// console.log(transactionHash)

// return {
//   success: true,
//   message: "Listing Plan updated"
//   }
// } catch (error: any) {
//    let message;
//   if (error?.message.includes('__DirectListing_NotAuthorizedToUpdate')) {
//    message = "You are not authorized to update this listing"  
//   }
   
//    if (error?.message.includes('__DirectListing_TransferFailed')){
//     message = "Error: Transfer failed"
//   }

//   else {
//     message = "An unexpected error occured: Try again"
//   }
  

//   return {
//     success: false,
//     message: message 
//   }

// }

// }



// export const cancelListing = async (listingId: bigint, account: Account) => {

//   const transaction = prepareContractCall({
//   contract,
//   method: "cancelListing",
//   params: [listingId],
  
// });


// try {

// const { transactionHash } = await sendTransaction({
//   account,
//   transaction,
// }); 
// console.log(transactionHash)

// return {
//   success: true,
//   message: "Listing cancelled"
//   }
// } catch (error: any) {
//    let message;
//   if (error?.message.includes('__DirectListing_NotAuthorizedToCancel')) {
//    message = "You are not authorized to cancel this listing"  
//   }
   

//   else {
//     message = "An unexpected error occured: Try again"
//   }
  

//   return {
//     success: false,
//     message: message 
//   }

// }

// }



// export const approveBuyerForListing = async (listingId: bigint, buyer: string, account: Account) => {

//   const transaction = prepareContractCall({
//   contract,
//   method: "approveBuyerForListing",
//   params: [listingId, buyer],
  
// });


// try {

// const { transactionHash } = await sendTransaction({
//   account,
//   transaction,
// }); 
// console.log(transactionHash)

// return {
//   success: true,
//   message: "Buyer approved for listing"
//   }
// } catch (error: any) {
//    let message;
//   if (error?.message.includes('__DirectListing_NotAuthorizedToApproveBuyerForListing')) {
//    message = "You are not authorized to approve a buyer"  
//   }
   
//   if (error?.message.includes('__DirectListing_InvalidAddress')) {
//    message = "Error: Invalid address"  
//   }
//   if (error?.message.includes('__DirectListing_CanOnlyApproveABuyer')) {
//    message = "Error: You can only approve a buyer "  
//   }
   

//   else {
//     message = "An unexpected error occured: Try again"
//   }
  

//   return {
//     success: false,
//     message: message 
//   }

// }

// }



// export const removeApprovedBuyerForListing = async (listingId: bigint, account: Account) => {

//   const transaction = prepareContractCall({
//   contract,
//   method: "removeApprovedBuyerForListing",
//   params: [listingId],
  
// });


// try {

// const { transactionHash } = await sendTransaction({
//   account,
//   transaction,
// }); 
// console.log(transactionHash)

// return {
//   success: true,
//   message: "Buyer unapproved for listing"
//   }
// } catch (error: any) {
//    let message;
//   if (error?.message.includes('__DirectListing_NotAuthorizedToRemoveBuyerForListing')) {
//    message = "You are not authorized to unapprove a buyer"  
//   }
   
  
//   if (error?.message.includes('__DirectListing_CanOnlyRemoveApprovedBuyer')) {
//    message = "Error: You can only remove an approved buyer "  
//   }
   

//   else {
//     message = "An unexpected error occured: Try again"
//   }
  

//   return {
//     success: false,
//     message: message 
//   }

// }

// }



