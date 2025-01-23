import { readContract } from 'thirdweb';
import { ListingType } from './listing';
import { marketContract } from './constant';





export const isNewWinningBid = async (auctionId: bigint, bidAmount: bigint) => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "isNewWinningBid",
      params: [auctionId, bidAmount]     
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}


export const getAuction = async (auctionId: bigint) => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "getAuction",
      params: [auctionId]     
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}
export const getAllAuctions = async () => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "getAllAuctions",
         
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}
export const getWinningBid = async (auctionId: bigint) => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "getWinningBid",
    params: [auctionId]        
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}
export const isAuctionExpired = async (auctionId: bigint) => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "isAuctionExpired",
    params: [auctionId]        
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}


