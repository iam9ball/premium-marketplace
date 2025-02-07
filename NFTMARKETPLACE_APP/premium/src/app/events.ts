// import { prepareEvent, watchContractEvents } from "thirdweb";
// import { marketContract } from "./constant";
// import { getMyListings } from "./graphClient";

// const myListings = await getMyListings("0xfc3c3F0d793EaC242051C98fc0DC9be60f86d964");

// const myEvent = prepareEvent({
//   signature: "event NewOffer( uint256 indexed totalPrice, uint256 indexed expirationTime, uint256 indexed listingId, address sender, uint256 id)", 
//   filters: { 
//     listingId: myListings.map((listing:any) => listing.listingId),
//   }
// });

// export const offerEvents = await watchContractEvents({
//   contract: marketContract,
//   events: [myEvent],
//   onEvents: (events) => {
//     events.forEach((event) => {
//       const { args } = event;
//       const { totalPrice, expirationTime, listingId, sender, id } = args;
      
//       // return {
//       //   totalPrice,
//       //   expirationTime,
//       //   listingId,
//       //   sender,
//       //   id,
//       // };
      
//     });
//     // do something with the events
//   },
// });
