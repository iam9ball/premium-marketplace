// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Math} from "openzeppelin-contract/utils/math/Math.sol";
import {console} from "forge-std/Test.sol";


library ArrayUtils{

    
    function binarySearch (uint256[] calldata sortedArray,  uint256 _id) external pure returns (int256) {
      
      if (_id < sortedArray[0] || _id > sortedArray[sortedArray.length - 1] || sortedArray.length == 0) {
           return -1;
      }

      uint256 low = 0;
      uint256 high = sortedArray.length - 1;
      

      while (low <= high) {
          uint256 mid = low + (high - low) / 2;

          if (sortedArray[mid] == _id || sortedArray[low] == _id || sortedArray[high] == _id) {
            return int256(mid);
          }

          else if (_id < sortedArray[mid]) {
            high = mid - 1;
          }
          else {
            low = mid + 1;
          }
      }
     return -1;
       
 
    }

}



       
