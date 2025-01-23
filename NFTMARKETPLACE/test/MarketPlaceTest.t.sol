// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Marketplace} from "../script/DeployMarketPlace.s.sol";
import {MarketplaceRouter} from "../src/MarketplaceRouter.sol";
import {IDirectListings} from "../src/extensions/directListings/IDirectListings.sol";
import {OfferLogic} from "../src/extensions/offer/OfferLogic.sol";
import {AuctionLogic} from "../src/extensions/auction/AuctionLogic.sol";
import {DirectListingsLogic} from "../src/extensions/directListings/DirectListingsLogic.sol";
import {ERC721Mock} from "../test/mocks/ERC721Mock.sol";
import {ERC1155Mock} from "../test/mocks/ERC1155Mock.sol";
import {IOffer} from "../src/extensions/offer/IOffer.sol";
import {IAuction} from "../src/extensions/auction/IAuction.sol";
import {OfferStorage} from "../src/extensions/offer/OfferStorage.sol";



import {ERC20Mock} from "openzeppelin-contract/mocks/token/ERC20Mock.sol";
import {ERC1155} from "openzeppelin-contract/token/ERC1155/ERC1155.sol";

import {MockV3Aggregator} from "chainlink-contract/contracts/src/v0.8/tests/MockV3Aggregator.sol"; 




contract MarketPlaceTest is Test {

    address payable market;
       address private manager;
       ERC721Mock erc721Mock;
       ERC20Mock erc20Mock;
       ERC1155Mock erc1155Mock;

    address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
   uint256 private constant DEFAULT_MATIC_BALANCE = 100_000 ether;
  //  address constant wmatic = 0x90193C961A926261B756D1E5bb255e67ff9498A1;
   address constant directListingsLogic = 0xA8452Ec99ce0C64f20701dB7dD3abDb607c00496;
   address constant offerLogic = 0xBb2180ebd78ce97360503434eD37fcf4a1Df61c3;
   address constant auctionLogic = 0xDB8cFf278adCCF9E9b5da745B44E754fC4EE3C76;


    function setUp () external {
        
        Marketplace marketPlace = new Marketplace();
        (market, manager) = marketPlace.run();
        erc721Mock = new ERC721Mock();
        erc20Mock = new ERC20Mock();
        erc1155Mock = new ERC1155Mock();

        
        vm.startPrank(manager);
         IDirectListings.ListingType  advanceListingType = IDirectListings.ListingType.ADVANCED;
        MarketplaceRouter(market).setListingPlan(advanceListingType, 30 days, 30);

        IDirectListings.ListingType  proListingType = IDirectListings.ListingType.PRO;
        MarketplaceRouter(market).setListingPlan(proListingType, 60 days, 60);
        
         MockV3Aggregator erc20Pricefeed = new MockV3Aggregator(8, 37e6);
        MarketplaceRouter(market).setApprovedCurrency(address(erc20Mock), address(erc20Pricefeed));
        vm.stopPrank();
         for (uint160 i = 1; i <= 100; i++) {
          erc721Mock.mint(address(i));
          vm.deal(address(i), DEFAULT_MATIC_BALANCE);
          erc20Mock.mint(address(i), 100_000e18);
          erc1155Mock.mint(address(i), 1);
        }
    }
    

    /*//////////////////////////////////////////////////////////////
                               ROUTER TEST
    //////////////////////////////////////////////////////////////*/
    function testRouterWorks () external view {
      uint8 version = MarketplaceRouter(market).contractVersion();
      assertEq(version, 1);

    }

    function testOnlyManagerCanSetListingPlan () external  {
      vm.prank(address(1));
      vm.expectRevert();
      MarketplaceRouter(market).setListingPlan(
        IDirectListings.ListingType.ADVANCED, 10, 100);
    }

    function testManagerCanSetListingPlan () external  {
      vm.prank(manager);
      MarketplaceRouter(market).setListingPlan(
        IDirectListings.ListingType.ADVANCED, 10, 100);
    }

    function testListingPlanIsUpdatedWhenInitialized () external view {
     (uint256 _duration, uint256 _price) = MarketplaceRouter(market).getListingTypeInfo(IDirectListings.ListingType.BASIC);
     assertEq(_duration, 10 days);
     assertEq(_price, 10);
    }

    function testGetIsApprovedCurrency() external view {
     bool isApproved = MarketplaceRouter(market).getIsApprovedCurrency(address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE));
     assertEq(isApproved, true);
    }


    /*//////////////////////////////////////////////////////////////
                           DIRECTLISTINGS TEST
    //////////////////////////////////////////////////////////////*/

    function testCreateListingWorks() public  returns (uint256 id){

      IDirectListings.ListingParameters memory params = IDirectListings.ListingParameters({
       assetContract: address(erc721Mock),
        tokenId: 1,
        currency: NATIVE_TOKEN,
        pricePerToken: 10e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
      });
      uint256 marketBalBefore = market.balance;
      vm.startPrank(address(1));
      erc721Mock.approve(market, 1);
      id = DirectListingsLogic(market).createListing{value: 28 ether}(params);
      vm.stopPrank();
      uint256 marketBalAfter = market.balance;

      uint256 expectedMarketBal = marketBalAfter - marketBalBefore;

      assertEq(expectedMarketBal, 28 ether);
      IDirectListings.Listing[] memory listing = DirectListingsLogic(market).getAllListings();
      console.log(listing.length);
      assertGt(listing.length,0);
    
      
    }


        
   function testCreateListingWorksWithERC1155() public  returns (uint256 id){

      IDirectListings.ListingParameters memory params = IDirectListings.ListingParameters({
       assetContract: address(erc1155Mock),
        tokenId: 1,
        currency: address(erc20Mock),
        pricePerToken: 10e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
      });
      uint256 marketBalBefore = market.balance;
      vm.startPrank(address(1));
      erc1155Mock.setApprovalForAll(market, true);
      erc20Mock.approve(market, 28e18);
      id = DirectListingsLogic(market).createListing(params);
      vm.stopPrank();
      uint256 marketBalAfter = ERC20Mock(erc20Mock).balanceOf(market);

    

      assertGt(marketBalAfter, marketBalBefore);
      
    }


    function testFuzzCreateListingWorks(uint256 caller, uint256 fee, uint256 listing, bool reserved ) external{
        caller = bound(caller, 1, 50);
        // tokenId = bound(tokenId, 1, 100);
        // currency = bound(currency, 1, 10);
        listing = bound(listing, 0, 2);
        fee = bound(fee, 28 ether, 100_000 ether);

        IDirectListings.ListingType[3] memory listingType = [IDirectListings.ListingType.BASIC, IDirectListings.ListingType.ADVANCED, IDirectListings.ListingType.PRO];
        IDirectListings.ListingParameters memory params = IDirectListings.ListingParameters({
       assetContract: address(erc721Mock),
        tokenId: caller,
        currency: NATIVE_TOKEN,
        pricePerToken: 10e18,
        listingType: listingType[listing],
        reserved: reserved
      });
      
         uint256 marketBalBefore = market.balance;
          vm.startPrank(address(uint160(caller)));
      erc721Mock.approve(market, caller);
      DirectListingsLogic(market).createListing{value: 200 ether}(params);
      vm.stopPrank();
       uint256 marketBalAfter = market.balance;

       uint256 expectedMarketBal = marketBalAfter - marketBalBefore;

      assertEq(expectedMarketBal, 200 ether);
    }

    
    function testBuyFromListingWorks() external {
      testCreateListingWorks();
      uint256 address1balBefore = address(1).balance;
      uint256 address2erc721balbefore = erc721Mock.balanceOf(address(2));
      console.log(address1balBefore); 
      console.log(address2erc721balbefore); 
      vm.prank(address(2));
      IDirectListings(market).buyFromListing{value: 10 ether}(1, address(2));
       uint256 address1balAfter = address(1).balance;
       address owner = erc721Mock.ownerOf(1);
       console.log(address1balAfter); 
      console.log(owner); 

      uint256 expectedaddress1bal = address1balAfter - address1balBefore;

      assertEq(expectedaddress1bal, 10 ether);
      assertEq(owner, address(2));
     
    }
    
    function testBuyFromListingWorksWithERC1155() external {
     uint256 listingId = testCreateListingWorksWithERC1155();
      uint256 address1balBefore = ERC20Mock(erc20Mock).balanceOf(address(1));
      uint256 address2erc1155balbefore = erc1155Mock.balanceOf(address(2), 1);
      console.log(address1balBefore); 
      console.log(address2erc1155balbefore); 
      vm.startPrank(address(2));
      erc20Mock.approve(market, 28e18);
      IDirectListings(market).buyFromListing(1, address(2));
      vm.stopPrank();
       uint256 address1balAfter = ERC20Mock(erc20Mock).balanceOf(address(1));
       uint256 ownerBal = erc1155Mock.balanceOf(address(2), 1);
       console.log(address1balAfter); 
      console.log(ownerBal); 

      assertGt(address1balAfter, address1balBefore);   
      assertEq(ownerBal, 1);
       IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(listingId);
       assertEq(uint256(_listing.status), 2);
     
    }

    function testFuzzBuyFromListingWorks(uint256 listingId, uint256 caller, uint256 fee) external {
      

        for (uint256 i = 51; i <= 100; i++){
        
            IDirectListings.ListingParameters memory params = IDirectListings.ListingParameters({
       assetContract: address(erc721Mock),
        tokenId: i,
        currency: NATIVE_TOKEN,
        pricePerToken: 10e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
      });
      vm.startPrank(address(uint160(i)));
      erc721Mock.approve(market, i);
       DirectListingsLogic(market).createListing{value: 28 ether}(params);
      vm.stopPrank();
        } 


    listingId = bound(listingId, 1, 50);
       caller = bound(caller, 1, 50);
       fee = bound(fee, 10e18, 100_000 ether); 
        vm.prank(address(uint160(caller)));
      IDirectListings(market).buyFromListing{value: fee}(listingId, address(uint160(caller)));
       uint256 address1balAfter = address(1).balance;
       address owner = erc721Mock.ownerOf(listingId);
       console.log(address1balAfter); 
      console.log(owner); 


      
    }


    function testUpdateListingWorks() external {
      uint256 listingId = testCreateListingWorks();
      IDirectListings.UpdateListingParameters memory params = IDirectListings.UpdateListingParameters({
       
        currency: NATIVE_TOKEN,
        pricePerToken: 100e18
        
      });
      IDirectListings.Listing memory listing = DirectListingsLogic(market).getListing(listingId);
      uint256 priceBefore = listing.pricePerToken;
      console.log(priceBefore);
      vm.startPrank(address(1));
        DirectListingsLogic(market).updateListing(listingId, params);
      vm.stopPrank();
      IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(listingId);
       uint256 priceAfter = _listing.pricePerToken;
       console.log(priceAfter);
       assertEq(priceAfter, 100e18);
    }

    function testUpdateListingPlan() external {
       uint256 listingId = testCreateListingWorks(); 
       vm.startPrank(address(1));
        DirectListingsLogic(market).updateListingPlan{value: 163 ether}(listingId, IDirectListings.ListingType.PRO);
      vm.stopPrank();
    }

  
   function testCancelListingWorks() external {
     uint256 listingId = testCreateListingWorks(); 

      IDirectListings.ListingParameters memory params = IDirectListings.ListingParameters({
       assetContract: address(erc721Mock),
        tokenId: 2,
        currency: NATIVE_TOKEN,
        pricePerToken: 100e18,
        listingType: IDirectListings.ListingType.ADVANCED,
        reserved: false
      });
      uint256 marketBalBefore = market.balance;
      vm.startPrank(address(2));
      erc721Mock.approve(market, 2);
     uint256 id = DirectListingsLogic(market).createListing{value: 82 ether}(params);
      vm.stopPrank();
      IDirectListings.Listing[] memory _listings = DirectListingsLogic(market).getAllListings();
      console.log(_listings[0].tokenId);
      console.log(_listings[1].tokenId);
      vm.startPrank(address(1));
        DirectListingsLogic(market).cancelListing(listingId);
      vm.stopPrank();
      IDirectListings.Listing[] memory _listingsArr = DirectListingsLogic(market).getAllListings();
      console.log(_listingsArr[0].tokenId);
      console.log(_listingsArr.length);
   }


   function testApproveBuyerForListingWorks() public returns (uint256 listingId){
    listingId = testCreateListingWorks(); 
   vm.startPrank(address(1));
      DirectListingsLogic(market).approveBuyerForListing(listingId, address(2));
   vm.stopPrank();
   IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(listingId);
       bool isReserved = _listing.reserved;
       assertEq(isReserved, true);     
   }   

   function testRemoveApprovedBuyerForListingWorks() external {
      uint256 _listingId =  testApproveBuyerForListingWorks();
      address buyer = DirectListingsLogic(market).getApprovedBuyer(_listingId);
      console.log(buyer);
       vm.prank(address(1));
      DirectListingsLogic(market).removeApprovedBuyerForListing(_listingId);   
      IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(_listingId);
      address _buyer = DirectListingsLogic(market).getApprovedBuyer(_listingId);
      bool isReserved = _listing.reserved;
       assertEq(isReserved, false); 
       assertEq(_buyer, address(0));
   }


   function testCheckUpkeepAndPerformUpkeepWorks() external {
    uint256 listingId = testCreateListingWorks(); 

    
      IDirectListings.ListingParameters memory params = IDirectListings.ListingParameters({
       assetContract: address(erc721Mock),
        tokenId: 2,
        currency: NATIVE_TOKEN,
        pricePerToken: 100e18,
        listingType: IDirectListings.ListingType.ADVANCED,
        reserved: false
      });
      uint256 marketBalBefore = market.balance;
      vm.startPrank(address(2));
      erc721Mock.approve(market, 2);
     uint256 id = DirectListingsLogic(market).createListing{value: 82 ether}(params);
      vm.stopPrank();
      IDirectListings.Listing[] memory _listings = DirectListingsLogic(market).getAllListings();
      console.log(_listings[0].tokenId);
      console.log(_listings[1].tokenId);
      


    IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(listingId);
    uint256 endTime = _listing.endTimestamp;
    vm.warp(endTime);
    vm.roll(block.number);
     DirectListingsLogic(market).performUpkeep(bytes(""));
     IDirectListings.Listing[] memory _listingsArr = DirectListingsLogic(market).getAllListings();
      console.log(_listingsArr[0].tokenId);
      console.log(_listingsArr.length);
      assertEq(_listingsArr.length, 1);
   }  


   function testCreateListingWorksWithERC20() public  returns (uint256 id){

      IDirectListings.ListingParameters memory params = IDirectListings.ListingParameters({
       assetContract: address(erc721Mock),
        tokenId: 1,
        currency: address(erc20Mock),
        pricePerToken: 10e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
      });
      uint256 marketBalBefore = market.balance;
      vm.startPrank(address(1));
      erc721Mock.approve(market, 1);
      erc20Mock.approve(market, 28e18);
      id = DirectListingsLogic(market).createListing(params);
      vm.stopPrank();
      uint256 marketBalAfter = ERC20Mock(erc20Mock).balanceOf(market);
      assertGt(marketBalAfter, marketBalBefore);
      
    }

    function testBuyFromListingWorksWithERC20() public {
      testCreateListingWorksWithERC20();
      uint256 address1balBefore = ERC20Mock(erc20Mock).balanceOf(address(1));
      uint256 address2erc721balbefore = erc721Mock.balanceOf(address(2));
      console.log(address1balBefore); 
      console.log(address2erc721balbefore); 
      vm.startPrank(address(2));
      erc20Mock.approve(market, 10e18);
      IDirectListings(market).buyFromListing(1, address(2));
      vm.stopPrank();
       uint256 address1balAfter = ERC20Mock(erc20Mock).balanceOf(address(1));
       address owner = erc721Mock.ownerOf(1);
       console.log(address1balAfter); 
      console.log(owner); 

      assertGt(address1balAfter, address1balBefore);   
      assertEq(owner, address(2));
     
    }


    /*//////////////////////////////////////////////////////////////
                               OFFER TEST
    //////////////////////////////////////////////////////////////*/

  function testMakeOfferWorks() public returns (uint256 offerId, uint256 _listingId ) {
    _listingId = testCreateListingWorksWithERC20();
   
    IOffer.OfferParams memory offer = IOffer.OfferParams({
      totalPrice: 10e18,
      duration: 2 days
    });
    vm.startPrank(address(2));
     erc20Mock.approve(market, 10e18);
     offerId = OfferLogic(market).makeOffer(offer, _listingId);
    vm.stopPrank();    
  }


  function testCancelOfferWorks() public {
    (uint256 offerId,  uint256 _listingId) = testMakeOfferWorks(); 
    vm.startPrank(address(2));
    OfferLogic(market).cancelOffer(offerId, _listingId);
    vm.stopPrank();
  }

  function testAcceptOfferWorks() external {
    (uint256 offerId,  uint256 _listingId) = testMakeOfferWorks(); 
     
    uint256 address1balBefore = ERC20Mock(erc20Mock).balanceOf(address(1));
      uint256 address2erc721balbefore = erc721Mock.balanceOf(address(2));
      console.log(address1balBefore); 
      console.log(address2erc721balbefore); 

    vm.startPrank(address(1));
    OfferLogic(market).acceptOffer(offerId, _listingId);
    vm.stopPrank();

    uint256 address1balAfter = ERC20Mock(erc20Mock).balanceOf(address(1));
    
     uint256 address2erc721balAfter = erc721Mock.balanceOf(address(2));
      console.log(address2erc721balAfter); 


       address owner = erc721Mock.ownerOf(1);
       console.log(address1balAfter); 
      console.log(owner); 

      assertGt(address1balAfter, address1balBefore);   
      assertEq(owner, address(2));
  }


  function testRejectOfferWorks() external {
    (uint256 offerId,  uint256 _listingId) = testMakeOfferWorks(); 
     
    uint256 address1balBefore = ERC20Mock(erc20Mock).balanceOf(address(1));
      uint256 address2erc721balbefore = erc721Mock.balanceOf(address(2));
      console.log(address1balBefore); 
      console.log(address2erc721balbefore); 

    vm.startPrank(address(1));
    OfferLogic(market).rejectOffer(offerId, _listingId);
    vm.stopPrank();

   IOffer.Offer memory _offer = OfferLogic(market).getOffer(offerId, _listingId);
       assertEq(uint256(_offer.status), 3);
  }
    


    /*//////////////////////////////////////////////////////////////
                              AUCTION TEST
    //////////////////////////////////////////////////////////////*/

   function testCreateAuctionWorks() public returns (uint256 auctionId) {
    IAuction.AuctionParameters memory auction = IAuction.AuctionParameters({
      assetContract: address(erc721Mock),
      tokenId: 1,
      currency: NATIVE_TOKEN,
      minimumBidAmount: 5 ether,
      buyoutBidAmount: 10 ether,
      bidBufferBps: 10,
      startTimestamp: uint64(block.timestamp),
      endTimestamp: uint64(block.timestamp) + 30 minutes
    });
      vm.startPrank(address(1));
      erc721Mock.approve(market, 1);
     auctionId = AuctionLogic(market).createAuction(auction);
      vm.stopPrank();
   }

   function testCancelAuctionWorks() external {
    uint256 auctionId = testCreateAuctionWorks();

     IAuction.AuctionParameters memory auction = IAuction.AuctionParameters({
      assetContract: address(erc721Mock),
      tokenId: 2,
      currency: NATIVE_TOKEN,
      minimumBidAmount: 5 ether,
      buyoutBidAmount: 10 ether,
      bidBufferBps: 10,
      startTimestamp: uint64(block.timestamp),
      endTimestamp: uint64(block.timestamp) + 30 minutes
    });
      vm.startPrank(address(2));
      erc721Mock.approve(market, 2);
    uint256 auction_Id = AuctionLogic(market).createAuction(auction);
      vm.stopPrank();

    vm.startPrank(address(1));
     AuctionLogic(market).cancelAuction(auctionId);
     IAuction.Auction[] memory _auctionArr = AuctionLogic(market).getAllAuctions();
      console.log(_auctionArr[0].tokenId);
      console.log(_auctionArr.length);
   }

   function testUpdateAuctionWorks () external {
      uint256 auctionId = testCreateAuctionWorks();

      IAuction.UpdateAuctionParameters memory auction = IAuction.UpdateAuctionParameters({
      currency: address(erc20Mock),
      minimumBidAmount: 6 ether,
      buyoutBidAmount: 12 ether,
      bidBufferBps: 11,
      startTimestamp: uint64(block.timestamp),
      endTimestamp: uint64(block.timestamp) + 50 minutes
    });

      vm.startPrank(address(1));
       AuctionLogic(market).updateAuction(auctionId, auction);


       IAuction.Auction memory _auction = AuctionLogic(market).getAuction(auctionId);
       console.log(_auction.buyoutBidAmount);
       console.log(_auction.auctionCreator);


   }

   function testBidInAuctionWorks() public returns (uint256 auctionId){
     auctionId = testCreateAuctionWorks();

     vm.startPrank(address(2));
     AuctionLogic(market).bidInAuction{value: 5 ether}(auctionId, 5 ether);
     vm.stopPrank();

     uint256 addTwoBaLBefore = address(2).balance;

     vm.startPrank(address(3));
     AuctionLogic(market).bidInAuction{value: 10 ether}(auctionId, 10 ether);
     vm.stopPrank();
     uint256 addTwoBaLAfter = address(2).balance;
    
     


     assertEq(addTwoBaLAfter - addTwoBaLBefore, 5 ether);
   }


   function testCollectAuctionPayoutWorks() external {
    uint256 auctionId = testBidInAuctionWorks();
    uint256 address1BalBefore = address(1).balance;
     vm.startPrank(address(1));
     AuctionLogic(market).collectAuctionPayout(auctionId);
     vm.stopPrank();
      uint256 address1BalAfter = address(1).balance;

      assertGt(address1BalAfter, address1BalBefore);

   }

   function testCollectAuctionTokensWork() external {
    uint256 auctionId = testBidInAuctionWorks();

     vm.startPrank(address(3));
     AuctionLogic(market).collectAuctionTokens(auctionId);
     vm.stopPrank();

     address owner = erc721Mock.ownerOf(1);
     

      assertEq(owner, address(3));

   }


  //  function testCheckUpkeepAndPerformUpkeepWorksInAuction() external {
  //  uint256  auctionId = testCreateAuctionWorks();


  //  IAuction.AuctionParameters memory auction = IAuction.AuctionParameters({
  //     assetContract: address(erc721Mock),
  //     tokenId: 2,
  //     currency: NATIVE_TOKEN,
  //     minimumBidAmount: 6 ether,
  //     buyoutBidAmount: 12 ether,
  //     bidBufferBps: 10,
  //     startTimestamp: uint64(block.timestamp),
  //     endTimestamp: uint64(block.timestamp) + 31 minutes
  //   });
  //     vm.startPrank(address(2));
  //     erc721Mock.approve(market, 2);
  //    auctionId = AuctionLogic(market).createAuction(auction);
  //     vm.stopPrank();

  
  //   IAuction.Auction memory _auction = AuctionLogic(market).getAuction(auctionId);
  //   uint256 endTime = _auction.endTimestamp;
  //   vm.warp(endTime);
  //   vm.roll(block.number);
  //    AuctionLogic(market).performUpkeep(bytes(""));
  //    IDirectListings.Listing[] memory _listingsArr = DirectListingsLogic(market).getAllListings();
  //     console.log(_listingsArr[0].tokenId);
  //     console.log(_listingsArr.length);
  //     assertEq(_listingsArr.length, 1);
  //  }  


    /*//////////////////////////////////////////////////////////////
                              UPGRADE TEST
    //////////////////////////////////////////////////////////////*/


    // function testCanRemoveExtension() external {
    //   testMakeOfferWorks();
    //    IOffer.Offer memory offerCountB = MarketplaceRouter(market).getOffer();
    //   vm.startPrank(manager);
    //   MarketplaceRouter(market).removeExtension("OfferLogic");
    //   vm.stopPrank();
    //   IOffer.Offer memory offerCount = MarketplaceRouter(market).getOffer();
    //   console.log(offerCountB.totalPrice);
    //   console.log(offerCount.totalPrice);
    // }

   
   

}