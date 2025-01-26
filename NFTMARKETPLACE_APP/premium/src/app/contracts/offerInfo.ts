import { readContract } from 'thirdweb';
import { marketContract } from '../constant';




export const getOffer = async (offerId:bigint, listingId:bigint) => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "getOffer",
      params: [offerId, listingId]     
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


export const getAllOffers = async (listingId:bigint) => {
  try {
    const data = await readContract({
      contract: marketContract,
      method: "getAllOffers",
      params: [listingId]     
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