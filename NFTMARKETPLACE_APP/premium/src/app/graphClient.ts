

import { request } from 'graphql-request';

const GRAPH_ENDPOINT = "https://subgraph.satsuma-prod.com/peters-team--628380/premium-amoy/version/v0.0.1-new-version/api"

const myListingsQuery = `
query ListingsQuery(
  $creator: String!, 
  $orderBy: String, 
  $first: Int, 
  $skip: Int
) {
  newListingCreateds(
    where: { listingCreator: $creator },
    orderBy: $orderBy,
    first: $first,
    skip: $skip
  ) {
    listingId
    id
    listingCreator
     status: listing_status
    tokenId: listing_tokenId
    currency: listing_currency
    tokenType: listing_tokenType
    listingType: listing_listingType
    endTimestamp: listing_endTimestamp
    pricePerToken: listing_pricePerToken
    assetContract: listing_assetContract
    startTimestamp: listing_startTimestamp
    reserved: listing_reserved
  }
}`;

const myListingLengthQuery = `
query ListingsLengthQuery($creator: String!) {
newListingCreateds( where: { listingCreator: $creator }){
listingId
}
}`

export const getListingLength = async (creatorAddress: string) => {
  try {
    const variables = { creator: creatorAddress };
    const data = await request(GRAPH_ENDPOINT, myListingLengthQuery, variables);
    return data.newListingCreateds?.length || 0;
  } catch (error) {
    console.error('Error fetching listing length:', error);
   
  }
};

export const getLimitedListings = async (
  creatorAddress: string, 
  start: number,
  limit: number 
) => {
  try {
    const variables = {
      creator: creatorAddress,
      orderBy: 'listing_startTimestamp',
      first: limit,
      skip: start
    };

    const data = await request(GRAPH_ENDPOINT, myListingsQuery, variables);
    return data.newListingCreateds || [];
  } catch (error) {
    console.error('Error fetching limited listings:', error);
    
  }
};