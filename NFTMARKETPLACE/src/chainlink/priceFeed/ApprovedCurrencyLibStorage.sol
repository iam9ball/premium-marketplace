// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


interface IApprovedCurrency {

   
     

}


library ApprovedCurrencyLibStorage {



    /// @custom:storage-location erc7201:approved.currency.storage
    bytes32 private constant APPROVED_CURRENCY_STORAGE_POSITION = keccak256(
        abi.encode(uint256(keccak256("approved.currency.storage")) - 1)) 
        & 
        ~bytes32(uint256(0xff));


     /// @custom:storage-location erc7201:approved.currency.storage
    struct Data {
        
        mapping (address currency =>  address priceFeed) currencyToPriceFeed;
        mapping (address currency => bool isInserted) currencyToIsInserTed;
        address[10] currency;
        
    }




   function data() internal pure returns (Data storage _data) {
        bytes32 position = APPROVED_CURRENCY_STORAGE_POSITION;
        assembly {
            _data.slot := position
        }
    }

    
}