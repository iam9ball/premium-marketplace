// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {IDirectListings} from "../src/extensions/directListings/IDirectListings.sol";
import {OfferLogic} from "../src/extensions/offer/OfferLogic.sol";
import {AuctionLogic} from "../src/extensions/auction/AuctionLogic.sol";
import {IExtension} from "thirdweb-dynamic/src/interface/IExtension.sol";
import {DirectListingsLogic} from "../src/extensions/directListings/DirectListingsLogic.sol";
import {ChainConfig} from "./config/ChainConfig.s.sol";


contract GenerateExtension is Script {
   DirectListingsLogic directListingsLogic;
  OfferLogic offerLogic;
  AuctionLogic auctionLogic;
  address wmatic;
  uint256 deployerKey;


 function run() external returns(IExtension.Extension[] memory) {
    ChainConfig config = new ChainConfig();
    (wmatic,,  deployerKey,) = config.activeNetworkConfig();
    vm.startBroadcast(deployerKey);
       directListingsLogic = new DirectListingsLogic(wmatic);
       offerLogic = new OfferLogic(wmatic);
       auctionLogic = new AuctionLogic(wmatic);
        vm.stopBroadcast();
    return generateExt();
    
}


  function generateExt() internal  view returns (IExtension.Extension[] memory) {
      
      IExtension.Extension[] memory _extensionArr = new IExtension.Extension[](3);
         _extensionArr[0] = generateDirectListingLogicExtension();
         _extensionArr[1] = generateOfferLogicExtension();
          _extensionArr[2] = generateAuctionLogicExtension();
          return _extensionArr;    
        
    }    



function generateDirectListingLogicExtension() internal view returns(IExtension.Extension memory){
   string[15] memory _directListingFuncSig  = [
    "approveBuyerForListing(uint256,address)",
    "removeApprovedBuyerForListing(uint256)",
    "getListingType(uint8)",
    "getPlatformFee(address,uint256)",
    "getAllListings()",
    "getAllValidListings()",
    "getListing(uint256)",
    "updateListingPlan(uint256,uint8)",
    "updateListing(uint256,(address,uint256))",
    "performUpkeep(bytes)",
    "checkUpkeep(bytes)",
    "createListing((address,uint256,address,uint256,uint8,bool))",
    "cancelListing(uint256)",
    "buyFromListing(uint256,address)",
    "getApprovedBuyer(uint256)"
     ];

     IExtension.ExtensionMetadata memory directListingLogicMetadata = IExtension.ExtensionMetadata({
            name: "DirectListingsLogic",
            metadataURI: "ipfs://DirectListingsLogic",
            implementation: address(directListingsLogic)   
        });
        
        IExtension.Extension memory directListingLogicExt = IExtension.Extension({
            metadata: directListingLogicMetadata,
            functions: generateExtFuncArr(_directListingFuncSig)

        });

        return directListingLogicExt;
}

function generateAuctionLogicExtension() internal view returns(IExtension.Extension memory){
         string[11]  memory _auctionFuncSig = [
    "createAuction((address,uint256,address,uint256,uint256,uint64,uint64,uint64))",
    "cancelAuction(uint256)",
    "collectAuctionPayout(uint256)",
    "collectAuctionTokens(uint256)",
    "updateAuction(uint256,(address,uint256,uint256,uint64,uint64,uint64))",
    "bidInAuction(uint256,uint256)",
    "isNewWinningBid(uint256,uint256)",
    "getAuction(uint256)",
    "getAllAuctions()",
    "getWinningBid(uint256)",
    "isAuctionExpired(uint256)"
];

 
     IExtension.ExtensionMetadata memory auctionLogicMetadata = IExtension.ExtensionMetadata({
            name: "AuctionLogic",
            metadataURI: "ipfs://AuctionLogic",
            implementation: address(auctionLogic)   
        });
        
        IExtension.Extension memory auctionLogicExt = IExtension.Extension({
            metadata: auctionLogicMetadata,
            functions: generateAuctionExtFuncArr(_auctionFuncSig)

        });
        return auctionLogicExt;

} 

    function generateOfferLogicExtension() internal view returns(IExtension.Extension memory){
         string[6] memory _offerFuncSig = [
            "cancelOffer(uint256,uint256)", 
            "makeOffer((uint256,uint128),uint256)", 
            "acceptOffer(uint256,uint256)",
            "getOffer(uint256,uint256)",
            "rejectOffer(uint256,uint256)",
            "getAllOffers(uint256)"
            ];

           
        
         IExtension.ExtensionMetadata memory offerLogicMetadata = IExtension.ExtensionMetadata({
            name: "OfferLogic",
            metadataURI: "ipfs://OfferLogic",
            implementation: address(offerLogic)   
        });


        IExtension.Extension memory offerLogicExt = IExtension.Extension({
            metadata: offerLogicMetadata,
            functions: generateOfferExtFuncArr(_offerFuncSig)
        });

        return offerLogicExt;
    }


    

    function generateExtFuncArr(string[15] memory funcSig) internal pure returns (IExtension.ExtensionFunction[] memory) {
        IExtension.ExtensionFunction[] memory funcArr = new IExtension.ExtensionFunction[](funcSig.length);   
          for (uint256 i = 0; i < funcSig.length; ++i) {
         bytes4 _functionSelector = bytes4(keccak256(bytes(funcSig[i])));
         string memory _functionSignature = funcSig[i];
         IExtension.ExtensionFunction memory Ext = IExtension.ExtensionFunction({
            functionSelector: _functionSelector,
            functionSignature: _functionSignature
          });
          funcArr[i] = Ext;
          }
          return funcArr;
    }

     function generateAuctionExtFuncArr(string[11] memory funcSig) internal pure returns (IExtension.ExtensionFunction[] memory) {
        IExtension.ExtensionFunction[] memory funcArr = new IExtension.ExtensionFunction[](funcSig.length);
    
          
          for (uint256 i = 0; i < funcSig.length; ++i) {
         bytes4 _functionSelector = bytes4(keccak256(bytes(funcSig[i])));
         string memory _functionSignature = funcSig[i];
         IExtension.ExtensionFunction memory Ext = IExtension.ExtensionFunction({
            functionSelector: _functionSelector,
            functionSignature: _functionSignature
          });
          funcArr[i] = Ext;
          }
          return funcArr;
    }

     function generateOfferExtFuncArr(string[6] memory funcSig) internal pure returns (IExtension.ExtensionFunction[] memory) {
        IExtension.ExtensionFunction[] memory funcArr = new IExtension.ExtensionFunction[](funcSig.length);
    
          
          for (uint256 i = 0; i < funcSig.length; ++i) {
         bytes4 _functionSelector = bytes4(keccak256(bytes(funcSig[i])));
         string memory _functionSignature = funcSig[i];
         IExtension.ExtensionFunction memory Ext = IExtension.ExtensionFunction({
            functionSelector: _functionSelector,
            functionSignature: _functionSignature
          });
          funcArr[i] = Ext;
          }
          return funcArr;
    }


    function generateFuncSelector(string[] memory funcSig) internal pure returns (bytes4[] memory) {
        bytes4[] memory funcSelector;
        for (uint256 i = 0; i < funcSig.length; ++i) {
            funcSelector[i] = bytes4(keccak256(bytes(funcSig[i])));
        }
        return funcSelector;
    }

    
}


