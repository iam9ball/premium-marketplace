// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


library OracleStorage {

    struct Data {
       
        mapping(uint256 endTime => uint256[] listingId) endTimeToListingId;
        
    }

 
    /// @custom:storage-location erc7201:direct.listings.storage
    bytes32 public constant DIRECT_LISTINGS_STORAGE_POSITION =
        keccak256(
            abi.encode(uint256(keccak256("direct.listings.storage")) - 1)
        ) & ~bytes32(uint256(0xff));

    /// @custom:storage-location erc7201:direct.listings.storage
    

    function data() internal pure returns (Data storage _data) {
        bytes32 position = DIRECT_LISTINGS_STORAGE_POSITION;
        assembly {
            _data.slot := position
        }
    }
}
