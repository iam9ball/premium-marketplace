import { readContract } from 'thirdweb';
import { ListingType } from './listing';
import { marketContract } from '../constant';




export const listingTypeInfo = async (params: ListingType) => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "getListingTypeInfo",
      params: [params]     
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
   
    throw error
    // Handle the error appropriately
   
  }
}


export const listingFee = async (currency: string, price:bigint) => {
  try {
    const  data  = await readContract({
  contract: marketContract,
  method:"getPlatformFee",
   params: [currency, price]     
})
   return data;
  } 
  catch (error) {
   throw error;
    // Handle the error appropriately
   
 }
}





export const listings = async () => {

  try {
     const data = await readContract({
     contract: marketContract,
     method:"getAllListings",
      params: []
  });
  // console.log("data")
  // console.log(data.length)

  if (!data) {
     return []
    }
  return data;
  
  } catch (error) {
    
     
     throw error;
    
  }
  
    
}


export const getListing = async (listingId: bigint) => {
  try {
      const data = await readContract({
     contract: marketContract,
     method:"getListing",
      params: [listingId]
    })

   return data;  
  }
  catch (error) {
   
    throw error;
    
  }
    
}
export const getAllValidListings = async () => {
  try {
      const data = await readContract({
     contract: marketContract,
     method:"getAllValidListings",
    })

   return data;  
  }
  catch (error) {
    
    throw error;
    
  }
    
}
export const getPlatformFee = async (currency: string, price: bigint) => {
  try {
      const data = await readContract({
     contract: marketContract,
     method:"getPlatformFee",
     params:[currency, price]
    })

   return data;  
  }
  catch (error) {
   
    throw error;
    
  }
    
}
export const getListingType = async (params: number) => {
  try {
      const data = await readContract({
     contract: marketContract,
     method:"getListingTypeInfo",
     params:[params]
    })

   return data;  
  }
  catch (error) {
    
    throw error;
    
    
  }
    
}
export const getApprovedBuyer = async (listingId: bigint) => {
  try {
      const data = await readContract({
     contract: marketContract,
     method:"getApprovedBuyer",
     params:[listingId]
    })

   return data;  
  }
  catch (error) {
   
    throw error;
    
  }
    
}

export const fetchNFT = async (contract: any, listing: any) => {
  try {
    if (listing.tokenType == 0) {
       const nft = (await (import ("thirdweb/extensions/erc721"))).getNFT({
           contract,
            tokenId: listing.tokenId
        })
        return nft;
      } else if (listing.tokenType == 1) {
       const nft = (await (import ("thirdweb/extensions/erc1155"))).getNFT({
           contract,
            tokenId: listing.tokenId
        })
        return nft;
      } 
  } catch (error) {
   
    throw error;
   
  }
    }





