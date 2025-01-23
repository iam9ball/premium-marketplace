// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {MarketplaceRouter} from "../src/MarketplaceRouter.sol";
import {IDirectListings} from "../src/extensions/directListings/IDirectListings.sol";
import {ChainConfig} from "./config/ChainConfig.s.sol";

import { TWProxy } from "@thirdweb-dev/contracts/infra/TWProxy.sol"; 
import {IExtension} from "thirdweb-dynamic/src/interface/IExtension.sol";
import {GenerateExtension} from "./GenerateExtension.s.sol";

contract Marketplace is Script {
   address private proxy;
   address private manager;
   address private pricefeed;
   uint256 private deployerKey;
   
   
  

    address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;


    function run() external returns (address payable, address ) { 
         
          GenerateExtension generateExtension = new GenerateExtension();
         IExtension.Extension[] memory _extensions  = generateExtension.run();
         MarketplaceRouter.MarketPlaceParams memory _params = MarketplaceRouter.MarketPlaceParams({
            extensions: _extensions,
            royaltyEngineAddress: address(0)
         });
          ChainConfig config = new ChainConfig();
      (, pricefeed,  deployerKey, manager) = config.activeNetworkConfig();

        vm.startBroadcast(deployerKey);
       address router = address(new MarketplaceRouter(_params));
        
         proxy = address( 
            new TWProxy(
                router,
                abi.encodeCall(
                    MarketplaceRouter.initialize,
                    (manager, new address[](0),IDirectListings.ListingType.BASIC, 30 days, 20, NATIVE_TOKEN, pricefeed)
                )
            )
        );
        MarketplaceRouter(payable(proxy)).setListingPlan(IDirectListings.ListingType.ADVANCED, 60 days, 30);
       MarketplaceRouter(payable(proxy)).setListingPlan(IDirectListings.ListingType.PRO, 90 days, 60);
       vm.stopBroadcast();
       
        return (payable(proxy), manager);
    }

}