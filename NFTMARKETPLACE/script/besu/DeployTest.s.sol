// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "../../src/besu/Test.sol";
import {Script} from "forge-std/Script.sol";


contract DeployTest is Script{

    uint256 private  DEPLOYER_KEY =  vm.envUint("PRIVATE_KEY");


    function run() public returns (address) {
        vm.startBroadcast(DEPLOYER_KEY);
        Test test = new Test();
        vm.stopBroadcast();
        return address(test);

    }
}   


