import {
  sendAndConfirmTransaction, sendTransaction,
  prepareContractCall,
  readContract,
} from "thirdweb";
import {contractAddress, marketContract} from "../constant"
import { Account } from "thirdweb/wallets";
import { listingFee, listingTypeInfo } from "./listingInfo";
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
  try {
   const data =  await listingTypeInfo(listingPlan);
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

   const transactionReceipt = await sendAndConfirmTransaction({  transaction: approveTransaction!, account });
   if (transactionReceipt.status === "success") {
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

        const transactionReceipt = await sendAndConfirmTransaction({
          account,
          transaction,
        }); 
        // console.log(transactionHash)

        if (transactionReceipt.status === "success") {
          return {
          success: true,
          message: "Listing created successfully"
          }
        }
          else {
            return {
              success: false,
              message: "Error creating listing"
            }
          }
   }

  else {
    return {
      success: false,
      message: "Error approving market"
    }
  }
}
catch (error: any) {
  let message;

  //handle all errors from smartcontract
  switch (true) {
    case error?.message.includes('__DirectListing_TransferFailed'):
      message = "Error transferring fee: Make sure you are sending a sufficient amount";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

  throw new Error(message, error);
}

}




export const buyListing = async (recipientAddress: string , listingId: bigint, account: Account) => {
  try {
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


const transactionreceipt = await sendAndConfirmTransaction({
  account,
  transaction,
}); 

 if (transactionreceipt.status === "success"){
  return {
  success: true,
  message: "Listing purchased successfully"
  }

 }

  return {
  success: false,
  message: "Error purchasing listing"
  }

 


} catch (error: any) {
  let message;

  switch (true) {
    case error?.message.includes('__DirectListing_BuyerNotApproved'):
      message = "You are not approved to buy this reserved listing";
      break;
    case error?.message.includes('__DirectListing_InvalidRequirementToCompleteASale'):
      message = "Error purchasing listing: You cannot purchase this listing";
      break;
    case error?.message.includes('__DirectListing_InsufficientFunds'):
      message = "Error purchasing listing: Make sure you are sending enough funds";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

  throw new Error(message, error);
}
}


export const updateListing = async (listingId: bigint,  currency: string,  pricePerToken: bigint,  account: Account) => {
try {
  const transaction = prepareContractCall({
  contract: marketContract,
  method: "updateListing",
  params: [listingId, {currency, pricePerToken}],
  
});



const  transactionreceipt  = await sendAndConfirmTransaction({
  account,
  transaction,
}); 

if (transactionreceipt.status === "success"){
  return {
  success: true,
  message: "Listing updated successfully"
    }
  }
  return {
  success: false,
  message: "Error updating listing"
  }

 } catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToUpdate'):
      message = "You are not authorized to update this listing";
      break;
    case error?.message.includes('__DirectListing_InvalidId'):
      message = "Error: Invalid listing";
      break;
    case error?.message.includes('__DirectListing_InvalidListingCurrency'):
      message = "Error: Invalid currency";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

  throw new Error(message, error);

}

}




export const updateListingPlan = async (listingId: bigint,  listingPlan:ListingType,  account: Account) => {
try {
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




const transactionreceipt  = await sendAndConfirmTransaction({
  account,
  transaction,
}); 

if (transactionreceipt.status === "success"){
  return {
  success: true,
  message: "Listing Plan updated"
  }
}
return {
  success: false,
  message: "Error updating listing plan"
  }

} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToUpdate'):
      message = "You are not authorized to update this listing";
      break;
    case error?.message.includes('__DirectListing_TransferFailed'):
      message = "Error: Transfer failed";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

   throw new Error(message, error);

}

}



export const cancelListing = async (listingId: bigint, account: Account) => {
try {
  const transaction = prepareContractCall({
  contract: marketContract,
  method: "cancelListing",
  params: [listingId],
  
});




const transactionreceipt = await sendAndConfirmTransaction({
  account,
  transaction,
}); 

if (transactionreceipt.status === "success"){
  return {
  success: true,
  message: "Listing cancelled"
  }
}
return {
  success: false,
  message: "Error cancelling listing"
  }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToCancel'):
      message = "You are not authorized to cancel this listing";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

  throw new Error(message, error);

}

}



export const approveBuyerForListing = async (listingId: bigint, buyer: string, account: Account) => {
try {
  const transaction = prepareContractCall({
  contract: marketContract,
  method: "approveBuyerForListing",
  params: [listingId, buyer],
  
});




const  transactionreceipt  = await sendAndConfirmTransaction({
  account,
  transaction,
}); 

if (transactionreceipt.status === "success"){
  return {
  success: true,
  message: "Buyer approved for listing"
  }
}
return {
  success: false,
  message: "Error approving buyer"
  }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToApproveBuyerForListing'):
      message = "You are not authorized to approve a buyer";
      break;
    case error?.message.includes('__DirectListing_InvalidAddress'):
      message = "Error: Invalid address";
      break;
    case error?.message.includes('__DirectListing_CanOnlyApproveABuyer'):
      message = "Error: You can only approve a buyer";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

  throw new Error(message, error);
}

}



export const removeApprovedBuyerForListing = async (listingId: bigint, account: Account) => {
try {
  const transaction = prepareContractCall({
  contract: marketContract,
  method: "removeApprovedBuyerForListing",
  params: [listingId],
  
});




const transactionreceipt  = await sendAndConfirmTransaction({
  account,
  transaction,
}); 

if (transactionreceipt.status === "success"){
  return {
  success: true,
  message: "Buyer removed for listing"
  }
}

return {
  success: false,
  message: "Error removing buyer"
  }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToRemoveBuyerForListing'):
      message = "You are not authorized to unapprove a buyer";
      break;
    case error?.message.includes('__DirectListing_CanOnlyRemoveApprovedBuyer'):
      message = "Error: You can only remove an approved buyer";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

 throw new Error(message, error);

}

}



