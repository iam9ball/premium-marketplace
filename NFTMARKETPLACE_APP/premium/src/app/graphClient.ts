

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

const myAuctionsQuery = `
query AuctionsQuery(
  $creator: String!,
  
) {
  newAuctions(
    where: { auctionCreator: $creator},
    
  ) {
    auctionId
    assetContract
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



const myListingsOffersQuery = `
query OffersQuery(
  $listingId_in: [String!],
  
) {
  newOffers(
    where: { listingId_in: $listingId_in},
    
  ) {
    listingId
    offerId:internal_id
    totalPrice
    expirationTime
    blockTimestamp
    transactionHash
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

export const getMyAuctions = async (
  creatorAddress: string,
) => {
  try {
    const variables = {
      creator: creatorAddress,
      
    };

    const data:any = await request(GRAPH_ENDPOINT, myAuctionsQuery, variables);
    return data.newAuctions || [];
  } catch (error) {
    throw error;
    
  }
}

export const getMyOffers = async (
 sender : string,
 
) => {
  try {
    const variables = {
      sender: sender,
      
    };

    const data:any = await request(GRAPH_ENDPOINT, myOffersQuery, variables);
    return data.newOffers || [];
  } catch (error) {
    throw error;
    
  }
};

export const getMyOffersNotif = async ( listingId_in: string[]) => {

  try {
    const variables = {
      listingId_in: listingId_in,
      
    };
    const data:any = await request(GRAPH_ENDPOINT, myListingsOffersQuery, variables);
     return data.newOffers || [];
  } catch(error){
     throw error;
  }
 
 
}