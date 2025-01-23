// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract UserPlatformInfo {

   
    struct Offer {
        uint256 id;
    }
    
   
    struct Listing {
        uint256 id;
        
    }
    struct Auction {
        uint256 id;    
    }
   

 mapping(address => User) users;
 // Define the User struct with listings, offers, and auctions arrays.
 // Each array will contain the IDs of the corresponding listings, offers, or auctions.
    struct User {
        Listing[] listings;
        Offer[] offers;
        Auction[] auctions;
    }

   

    function updateUserListing(address _user, uint256 _listingId) external {
        users[_user].listings.push(Listing(_listingId));

    }

    function updateUserOffer(address _user, uint256 _offerId) external {
        users[_user].offers.push(Offer(_offerId));

    }
    function updateUserAuction(address _user, uint256 _auctionId) external {
        users[_user].auctions.push(Auction(_auctionId));

    }
    function getUserListings(address _user) external view returns (Listing[] memory) {
        return users[_user].listings;
    }
    function getUserOffers(address _user) external view returns (Offer[] memory) {
        return users[_user].offers;
    }
    function getUserAuctions(address _user) external view returns (Auction[] memory) {
        return users[_user].auctions;
    }
}


