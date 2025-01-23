// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "chainlink-contract/contracts/src/v0.8/tests/MockV3Aggregator.sol"; 
import {WMATICMock} from "../../test/mocks/WMATICMock.sol";

contract ChainConfig is Script {
    Network public activeNetworkConfig;
    
    address private constant MATIC_PRICEFEED = 0x001382149eBa3441043c1c66972b4772963f5D43;

    uint8 private constant DECIMALS = 8;
    int256 private constant ANSWER = 37e6;
    uint256 private constant DEFAULT_ANVIL_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 private  DEPLOYER_KEY =  vm.envUint("PRIVATE_KEY");

    constructor() {
        if (block.chainid == 80002) {
            activeNetworkConfig = polygonAmoyConfig();
        }
        activeNetworkConfig = getAnvilConfig();  
    }
  
    

    struct Network { 
        address WMATIC;
        address pricefeed;  
        uint256 deployerkey; 
        address manager;           
    }

    function polygonAmoyConfig() internal  returns (Network memory) {
             vm.startBroadcast(DEPLOYER_KEY);
             WMATICMock WMATIC = new WMATICMock(); 
             vm.stopBroadcast();
        Network memory amoyConfig = Network({
           
            WMATIC: address(WMATIC),
            pricefeed: MATIC_PRICEFEED,
            deployerkey: DEPLOYER_KEY,
            manager: 0xfc3c3F0d793EaC242051C98fc0DC9be60f86d964
            
        });
        return amoyConfig;
    }

    function getAnvilConfig() internal returns (Network memory) {
        if (activeNetworkConfig.pricefeed != address(0)) {
            return activeNetworkConfig;
        }

         vm.startBroadcast(DEFAULT_ANVIL_KEY);
        MockV3Aggregator pricefeed = new MockV3Aggregator(DECIMALS, ANSWER);
        WMATICMock WMATIC = new WMATICMock(); 
        vm.stopBroadcast();

        Network memory anvilConfig = Network({
            WMATIC: address(WMATIC),
            pricefeed: address(pricefeed),
            deployerkey: DEFAULT_ANVIL_KEY,
            manager: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        });
        return anvilConfig;
    }

    
}
