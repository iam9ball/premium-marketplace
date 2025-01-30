

import { request } from 'graphql-request';

const GRAPH_ENDPOINT = "https://subgraph.satsuma-prod.com/peters-team--628380/premium-amoy/version/v0.0.1-new-version/api"

const myListingsQuery = `
query ListingsQuery(
  $creator: String!, 
  $orderBy: String
) {
  newListingCreateds(
    where: { listingCreator: $creator},
    orderBy: $orderBy,
  ) {
    listingId
   
  }
}`;

const myOffersQuery = `
query OffersQuery(
  $sender: String!,
  
) {
  newOffers(
    where: { sender: $sender},
    
  ) {
    offerId:internal_id
    listingId
  }
}`;



export const getMyListings = async (
  creatorAddress: string, 
 
) => {
  try {
    const variables = {
      creator: creatorAddress,
      orderBy: 'listing_startTimestamp'
    };

    const data:any = await request(GRAPH_ENDPOINT, myListingsQuery, variables);
    return data.newListingCreateds || [];
  } catch (error) {
    throw error;
    
  }
};

export const getMyOffers = async (
 sender : string,
 
) => {
  try {
    const variables = {
      sender: sender,
      
    };

    const data:any = await request(GRAPH_ENDPOINT, myOffersQuery, variables);
    return data.newoffers || [];
  } catch (error) {
    throw error;
    
  }
};