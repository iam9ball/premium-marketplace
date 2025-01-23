// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @author <iam9ball> 

import {IERC20, SafeERC20} from "openzeppelin-contract/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "openzeppelin-contract/token/ERC721/IERC721.sol";
import {IERC1155} from "openzeppelin-contract/token/ERC1155/IERC1155.sol";
import {IERC165} from "openzeppelin-contract/interfaces/IERC165.sol";
import {Strings} from "openzeppelin-contract/utils/Strings.sol";
import {ERC20} from "openzeppelin-contract/token/ERC20/ERC20.sol";

import {console} from "forge-std/console.sol";



import {ERC2771ContextConsumer} from "@thirdweb-dev/contracts/extension/upgradeable/ERC2771ContextConsumer.sol";
import {ReentrancyGuard} from "@thirdweb-dev/contracts/extension/upgradeable/ReentrancyGuard.sol";
import {Permissions} from "@thirdweb-dev/contracts/extension/upgradeable/PermissionsEnumerable.sol";
import {CurrencyTransferLib} from "@thirdweb-dev/contracts/lib/CurrencyTransferLib.sol";
import {RoyaltyPaymentsLogic} from "@thirdweb-dev/contracts/extension/upgradeable/RoyaltyPayments.sol";

import {IDirectListings, DirectListingsStorage} from "./DirectListingsStorage.sol";
import {ApprovedCurrencyLibStorage} from "../../chainlink/priceFeed/ApprovedCurrencyLibStorage.sol";
import {ApprovedCurrencyLib} from "../../chainlink/priceFeed/ApprovedCurrencyLib.sol";



/**
 *  The `DirectListings` extension smart contract lets you buy and sell NFTs (ERC-721 or ERC-1155) for a fixed price.
 */

contract DirectListingsLogic is
    ERC2771ContextConsumer,
    IDirectListings,
    ReentrancyGuard
{
    

 using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                          CONSTANTS/IMMUTABLES
    //////////////////////////////////////////////////////////////*/
   
   /// @dev Additional time buffer to start a listing
    uint128 private constant START_TIME_BUFFER = 1 minutes;

  /// @dev Additional buffer for native token calculation to retain precision  
    uint64 private constant MATIC_BUFFER = 1e18; 

  /// @dev Only addresses with this role can create listings (i.e) 
  /// To prevent users from interacting with contract when not initialized by proxy
    bytes32 private constant LISTER_ROLE = keccak256("LISTER_ROLE");

  /// @dev Address of the Chain native token e.g eth, matic  
     address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    
   /// @dev Address of the Native token wrapper, which wraps native to erc20 e.g WETH
    address private immutable nativeTokenWrapper;
   
  /*//////////////////////////////////////////////////////////////
                          MODIFIERS
  //////////////////////////////////////////////////////////////*/    

   /// @dev Checks whether the caller has LISTER_ROLE.
       modifier onlyLister() {
        address _sender = _msgSender();
        bool isPermissionedToCall = Permissions(address(this))
            .hasRoleWithSwitch(LISTER_ROLE, _sender);
        if (!isPermissionedToCall) {
            revert __DirectListing_InvalidAccessToCall(_sender);
        }
        _;
    }

    
    /*//////////////////////////////////////////////////////////////
                            CONSTRUCTOR LOGIC
    //////////////////////////////////////////////////////////////*/
   
    constructor (address _nativeTokenWrapper) {
        nativeTokenWrapper = _nativeTokenWrapper;
    }
    
    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice List NFTs (ERC721 or ERC1155) for sale at a fixed price with a prerequisite of paying a platform fee with the provided approved currency
    function createListing(
        ListingParameters memory _params
    ) external payable onlyLister returns (uint256 id) {
        address lister = _msgSender();
       TokenType _tokenType =  _validateListing(_params, lister);
        (uint128 _duration, uint256 _price) = _getListingTypeInfo(
            _params.listingType
        );
       uint256 _fee = _getPlatformFee(
         _params.currency,
         _price
    );
       if (_params.currency == NATIVE_TOKEN){
         if(_fee > msg.value) {
            revert __DirectListing_TransferFailed();
        }
       }
      else{ 
        IERC20(_params.currency).safeTransferFrom(lister, address(this), _fee);
      }
        id = _getListingId();
        uint128 startTime;
         unchecked {
          startTime =  uint128(block.timestamp) + START_TIME_BUFFER;
        }
        uint128 endTime;
         unchecked {
          endTime = startTime  + _duration;
        }
       Listing memory listing  = Listing ({
        listingId: id,
        tokenId: _params.tokenId,
        pricePerToken: _params.pricePerToken,
        startTimestamp: startTime,
        endTimestamp: endTime,
        listingCreator: lister,
        assetContract: _params.assetContract,
        currency: _params.currency, 
        tokenType: _tokenType,
        status: Status.CREATED,
        reserved: _params.reserved,
        listingType: _params.listingType

    });
     emit NewListingCreated (lister, id, _params.assetContract, listing);
     DirectListingsStorage.Data storage data =  _getListingStorageData();
    data.listings.push(listing);
     uint256 listingIndex =  (data.listings.length) - 1;
    data.idToIndex[id] = int256(listingIndex);
    data.endTimeToListingId[endTime].push(id);
    return id;
    
    }

   
     /// @notice Buy NFTs from a listing.
    function buyFromListing(
        uint256 _listingId,
        address _buyFor
    ) external payable  nonReentrant{
        DirectListingsStorage.Data storage data =  _getListingStorageData();
         int256 index =  data.idToIndex[_listingId];
         Listing memory _listing =  _getListing(_listingId, data);
        address _buyer = _msgSender();
        _validateBuyFromListing(_listingId, _buyFor, _buyer, data, _listing);
        _validateERC20AllowanceAndBalanceOrNativeTokenAmount(_listing.currency,  _listing.pricePerToken,  _buyer);
        emit NewSale(_listing.listingCreator, _listingId, _listing.assetContract, _listing.tokenId, _buyer, _listing.pricePerToken);
         data.listings[uint256(index)].status = Status.SOLD;
        _payout(_listing.currency, _listing.pricePerToken, _buyer,  _listing.listingCreator,  _listing.assetContract,  _listing.tokenId);
        _transferListing(_listing.tokenType, _listing.assetContract,  _listing.tokenId,  _buyFor, _listing.listingCreator);
    
    }


    /// @notice Update parameters of a listing of NFTs.
    function updateListing(
        uint256 _listingId,
        UpdateListingParameters memory _params
    ) external  {
        address lister = _msgSender();
         DirectListingsStorage.Data storage data =  _getListingStorageData();
         int256 index =  data.idToIndex[_listingId];
         Listing memory _listing =  _getListing(_listingId, data);
      
       if (_listing.listingCreator != lister) {
         revert __DirectListing_NotAuthorizedToUpdate();
       }  
       _validateListingCurrency(_params.currency);
        Listing memory upDatedListing  = Listing ({
        listingId: _listingId,
        tokenId: _listing.tokenId,
        pricePerToken: _params.pricePerToken,
        startTimestamp:_listing.startTimestamp,
        endTimestamp: _listing.endTimestamp,
        listingCreator: lister,
        assetContract: _listing.assetContract,
        currency: _params.currency, 
        tokenType: _listing.tokenType,
        status: Status.CREATED,
        reserved: _listing.reserved,
        listingType: _listing.listingType
    });

       emit ListingUpdated(
         _params.currency,
        _params.pricePerToken
    );
        
      data.listings[uint256(index)] =  upDatedListing;
     
    }

        /// @notice Updates listing plan of a listing.
    function updateListingPlan(uint256 _listingId, ListingType _listingType) external payable{
         address lister = _msgSender();
          DirectListingsStorage.Data storage data =  _getListingStorageData();
         int256 index =  data.idToIndex[_listingId];
        Listing memory _listing =  _getListing(_listingId, data);
       if (_listing.listingCreator != lister) {
         revert __DirectListing_NotAuthorizedToUpdate();
       }

        (uint128 _duration, uint256 _price) = _getListingTypeInfo(
            _listingType
        );
       uint256 _fee = _getPlatformFee(
         _listing.currency,
         _price
    );
      
      if (_listing.currency == NATIVE_TOKEN){
         if(_fee > msg.value) {
            revert __DirectListing_TransferFailed();
        }
       }
      else{ 
        IERC20(_listing.currency).safeTransferFrom(lister, address(this), _fee);
      }
        uint128 endTime;
         unchecked {
          endTime = _listing.endTimestamp  + _duration;
        }
          emit ListingPlanUpdated(endTime);
          delete _getListingStorageData().endTimeToListingId[_listing.endTimestamp];
       data.listings[uint256(index)].endTimestamp = endTime;
       _getListingStorageData().endTimeToListingId[endTime].push(_listingId);       
    }

    
      /// @notice Cancel a listing.
    function cancelListing(uint256 _listingId) external  {
       address lister = _msgSender();
       DirectListingsStorage.Data storage data =  _getListingStorageData();
       Listing[] memory listingsArr = data.listings;
         int256 index =  data.idToIndex[_listingId];
         Listing memory _listing =  _getListing(_listingId, data);
       if (_listing.listingCreator != lister || _listing.status != Status.CREATED) {
         revert __DirectListing_NotAuthorizedToCancel();
       }
       emit CancelledListing(lister, _listingId);    
        data.listings[uint256(index)].status = Status.CANCELLED;
         string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
         _removeApprovedBuyer( buyerRole, _listingId);
         uint256 length = listingsArr.length;
         if (length == 1) {
            data.listings.pop();
         }
         else {
            // swap selected listing with last listing and remove selected listing 
              uint256 _lastListingId = listingsArr[length- 1].listingId;
          data.listings[uint256(index)] = (listingsArr[length- 1]);
          data.listings.pop();

         // update id-to-index mapping, pointing the last listing to the cancelled listing index
        data.idToIndex[_lastListingId] = index;
        data.idToIndex[_listingId] = -1;
         }
    }
    

       /// @notice Approve a buyer to buy from a listing.     
    function approveBuyerForListing(
        uint256 _listingId,
        address _buyer
    ) external  {
       address lister = _msgSender();
       DirectListingsStorage.Data storage data =  _getListingStorageData();
         int256 index =  data.idToIndex[_listingId];
         Listing memory _listing =  _getListing(_listingId, data);
       if (_listing.listingCreator != lister ) {
         revert __DirectListing_NotAuthorizedToApproveBuyerForListing();
       }

       string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       emit BuyerApprovedForListing( _listingId, _buyer);
        bool isAdded = _addApprovedBuyer( buyerRole, _buyer, _listingId);
        if (!isAdded) {
            revert __DirectListing_CanOnlyApproveABuyer();
        }
       
       data.listings[uint256(index)].reserved = true;
    }

    /// @notice Remove an approved buyer from a listing.
    function removeApprovedBuyerForListing(
        uint256 _listingId
    ) external {
       address lister = _msgSender();
       DirectListingsStorage.Data storage data =  _getListingStorageData();
         int256 index =  data.idToIndex[_listingId];
         Listing memory _listing =  _getListing(_listingId, data);

       if (_listing.listingCreator != lister ) {
         revert __DirectListing_NotAuthorizedToRemoveBuyerForListing();

       }

       string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
        emit BuyerRemovedForListing( _listingId);
        bool isRemoved =  _removeApprovedBuyer( buyerRole, _listingId);
        if (!isRemoved) {
            revert __DirectListing_CanOnlyRemoveApprovedBuyer();
        }
       data.listings[uint256(index)].reserved = false;
    }


   /// @notice Chainlink Function that performs operation when upkeep needed
   function performUpkeep(
    bytes calldata /**performData */
  ) external {
    (bool upkeepNeeded, bytes memory performData) = checkUpkeep("");
     DirectListingsStorage.Data storage data =  _getListingStorageData();
      Listing[] memory listingsArr = data.listings;
      
    if (upkeepNeeded) {
        
          if (listingsArr.length == 1) {
            delete data.endTimeToListingId[block.timestamp];
            data.listings.pop();
        }

        uint256[] memory _listingsId = abi.decode(performData, (uint256[]));

        
        if (_listingsId.length == 1) {
            delete data.endTimeToListingId[block.timestamp];
            int256 index =  data.idToIndex[_listingsId[0]];

              uint256 len = listingsArr.length;
           uint256 _lastListingId = listingsArr[len- 1].listingId;

            data.listings[uint256(index)] = (data.listings[len- 1]);

           data.idToIndex[_lastListingId] = index;
           data.idToIndex[_listingsId[0]] = -1;

           data.listings.pop();
        }
        
        else {
            delete data.endTimeToListingId[block.timestamp];
             for (uint256 i = 0; i < _listingsId.length; ++i) {

             int256 index =  data.idToIndex[_listingsId[i]];

             uint256 len = listingsArr.length;
           uint256 _lastListingId = listingsArr[len- 1].listingId;

            data.listings[uint256(index)] = (data.listings[len- 1]);

           data.idToIndex[_lastListingId] = index;
           data.idToIndex[_listingsId[i]] = -1;

           data.listings.pop();
         
           }

        }
          
    }
  }
 
    
    /// @notice Returns all listings between the start and end Id (both inclusive) provided.
    function getAllListings(
    ) external view returns (Listing[] memory) {
       Listing[] memory listings  =  _getListingStorageData().listings;
      
        return listings;
    }

    
     /// @notice Returns all valid listings (i.e) Listings still in the created state.
    function getAllValidListings() external view returns (Listing[] memory) {
       Listing[] memory listings  =  _getListingStorageData().listings;
       Listing[] memory validListings; 
      

       for(uint256 i = 0; i < listings.length; ++i){
         if(listings[i].status == Status.CREATED) {
            validListings[i] = listings[i];
         }
       }

       return validListings;
    }

      /// @notice Returns a listing at the provided listing ID. 
    function getListing(
        uint256 _listingId
    ) external view returns (Listing memory) {
         DirectListingsStorage.Data storage data =  _getListingStorageData();
     Listing memory _listing = _getListing (_listingId,  data);
         return _listing;
    }
   
     /// @notice Returns an approved buyer for a listing
    function getApprovedBuyer(uint256 _listingId) external view returns (address buyer) {
        DirectListingsStorage.Data storage data =  _getListingStorageData();
        int256 index =  data.idToIndex[_listingId];
        bool isReserved =  data.listings[uint256(index)].reserved;
        if(!isReserved) {
             buyer = address(0); 
            
        } else {
        string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       buyer = data.approvedBuyer[buyerRole];
        }
    }

      /// @notice Returns the platform fee for a validated currency.
     function getPlatformFee( address _currency,uint256 _price) external view returns (uint256 fee) {
        _validateListingCurrency( _currency);
        return _getPlatformFee(_currency, _price);
    
    }
     
      /// @notice Returns the information like duration and price for a listing type.
    function getListingType( ListingType _listingType) external view returns (uint128, uint256) {
        return _getListingTypeInfo(_listingType);
    }



    /*//////////////////////////////////////////////////////////////
                            PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/


  /// @notice Chainlink Function that checks and return perform data when upkeep needed
   function checkUpkeep(
    bytes memory  /**performData */
  ) public view returns(bool upkeepNeeded, bytes memory performData){
        uint256[] memory data =  _getListingStorageData().endTimeToListingId[block.timestamp];
       
       if (data.length > 0) {
           upkeepNeeded = true;
           performData = abi.encode(data);
       }
       else {
        upkeepNeeded = false;
           performData = bytes("");
       }
  }



    function _getListingId() internal  returns (uint256 _id) {
        _getListingStorageData().listingId += 1;
        _id = _getListingStorageData().listingId;
    }

  
    function _payout(address _currency, uint256 _tokenPrice, address _buyer, address _lister, address _assetContract, uint256 _tokenId) internal {
         address _nativeTokenWrapper = nativeTokenWrapper;

        (address payable[] memory recipients, uint256[] memory amounts) = RoyaltyPaymentsLogic(address(this)).getRoyalty(_assetContract, _tokenId, _tokenPrice);
        uint256  recipientLength = recipients.length;

        uint256 _amountRemaining = _tokenPrice;

        if(recipientLength > 0){
            for (uint256 i = 0;  i < recipientLength; ++i) {
               if (_amountRemaining < amounts[i]) {
                revert __DirectListing_InsufficientFunds( _amountRemaining);
               } 
        CurrencyTransferLib.transferCurrencyWithWrapper(_currency, _buyer, recipients[i], amounts[i], _nativeTokenWrapper);
         unchecked {
            _amountRemaining -= amounts[i];
         }
            }
        }

        CurrencyTransferLib.transferCurrencyWithWrapper(_currency, _buyer, _lister, _amountRemaining, _nativeTokenWrapper);       

    }

     function _transferListing(TokenType _tokenType, address _assetContract, uint256 _tokenId, address _buyFor, address _lister) internal {
        uint8 _amount = 1;
          if (_tokenType == TokenType.ERC1155) {
              IERC1155(_assetContract).safeTransferFrom(_lister, _buyFor, _tokenId, _amount, bytes(""));
          }
          else {
             IERC721(_assetContract).safeTransferFrom(_lister, _buyFor, _tokenId, bytes(""));
          }

     }

     function _validateERC20AllowanceAndBalanceOrNativeTokenAmount(address _currency, uint256 _tokenPrice, address _buyer) internal {
      if(_currency == NATIVE_TOKEN) {
        if(msg.value < _tokenPrice) {
            revert __DirectListing_InsufficientFunds(_tokenPrice);
        }
      }
        else {
            if (IERC20(_currency).balanceOf(_buyer) < _tokenPrice 
                             ||
                IERC20(_currency).allowance(_buyer, address(this)) < _tokenPrice
                ) {
                   revert __DirectListing_InsufficientFunds(_tokenPrice);
                }
        }
      }
    
     function _addApprovedBuyer(bytes32 role, address account, uint256 _listingId) internal returns(bool){
        if (account == address(0)) {
            revert __DirectListing_InvalidAddress();
        }
         DirectListingsStorage.Data storage data =  _getListingStorageData();
         int256 index =  data.idToIndex[_listingId];
        bool isApproved =  data.listings[uint256(index)].reserved;

        if(!isApproved) {
            data.approvedBuyer[role] = account;
            return true;
        } 
       
        return false;
        
    }

    function _removeApprovedBuyer(bytes32 role, uint256 _listingId) internal returns(bool){
         DirectListingsStorage.Data storage data =  _getListingStorageData();
         int256 index =  data.idToIndex[_listingId];
        bool isApproved =  data.listings[uint256(index)].reserved;
        if(isApproved) {
             delete _getListingStorageData().approvedBuyer[role];
            return true;
        } 
      
        return false;
    }

    

     function _getListing (uint256 _listingId, DirectListingsStorage.Data storage  data) internal view returns(Listing memory) {
        if (_listingId <= 0 || _listingId > data.listingId) {
            revert __DirectListing_InvalidId();
        }
         int256 index =  data.idToIndex[_listingId];
         Listing memory _listing = data.listings[uint256(index)];
         return _listing;
     }


     function getIsApprovedCurrency(
        address _currency
    ) internal view returns (bool isApprovedCurrency) {
        isApprovedCurrency = _getApprovedCurrencyStorageData()
            .currencyToIsInserTed[_currency];
    }

  

    function _validateAssetContract(
        address _assetContract
    ) internal view returns (TokenType _tokenType) {
        if (
            IERC165(_assetContract).supportsInterface(type(IERC1155).interfaceId)
        ) {
            _tokenType = TokenType.ERC1155;
        } else if (
            IERC165(_assetContract).supportsInterface(type(IERC721).interfaceId)
        ) {
            _tokenType = TokenType.ERC721;
        } else {
            revert __DirectListing_InvalidAssetContract(_assetContract);
        }
    }

    ///--- Validate the lister since he is not sending over the token

    ///--- @notice marketplace must be approved

    function _validateListerRequirements(
        address _assetContract,
        TokenType _tokenType,
        uint256 _tokenId,
        address _lister
    ) internal view returns (bool) {
        bool isValid;
        if (_tokenType == TokenType.ERC721) {
            address _owner = IERC721(_assetContract).ownerOf(_tokenId);
            address approvedAddress = IERC721(_assetContract).getApproved(
                _tokenId
            );

            bool _ownToken = (_owner == _lister);
            bool _approvedMarket = (address(this) == approvedAddress);

            isValid = (_ownToken && _approvedMarket);
        } else if (_tokenType == TokenType.ERC1155) {
            uint256 _ownerBalance = IERC1155(_assetContract).balanceOf(
                _lister,
                _tokenId
            );

            bool _qtyOwned = (_ownerBalance >= 1);
            bool _approvedMarket = (
                IERC1155(_assetContract).isApprovedForAll(_lister, address(this))
            );

            isValid = (_qtyOwned && _approvedMarket);
        }
        return isValid;
    }

    function _validateBuyFromListing(uint256 _listingId, address _buyFor, address _buyer,  DirectListingsStorage.Data storage data, Listing memory _listing) internal view {
      string memory listingIdStr = Strings.toString(_listingId); 
      bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       bool isMarketStillApproved = _validateListerRequirements( _listing.assetContract,
            _listing.tokenType,
            _listing.tokenId,
            _listing.listingCreator);
       bool isReserved = _listing.reserved;
       address approvedBuyer = data.approvedBuyer[buyerRole];
       bool invalidStatus = _listing.status != Status.CREATED;
       bool invalidAddress = _buyFor == address(0) || _buyer == _listing.listingCreator;
       

         if(isReserved && (approvedBuyer != _buyer)){
        revert __DirectListing_BuyerNotApproved();
      }
       if (invalidStatus || !isMarketStillApproved || invalidAddress ){
         revert __DirectListing_InvalidRequirementToCompleteASale(_buyFor, isMarketStillApproved, _listing.status);
       }
      
   }

    function _validateListingCurrency(address _currency) internal view {
        bool isApprovedCurrency = getIsApprovedCurrency(_currency);
        if (!isApprovedCurrency) {
            revert __DirectListing_InvalidListingCurrency(_currency);
        }
    }

    function _getListingTypeInfo(
        ListingType _listingType
    ) internal view returns (uint128, uint256) {
        uint128 _duration;
        uint256 _price;
        if (_listingType == ListingType.BASIC) {
            BASIC memory basic = _getListingStorageData().Basic;

            _duration = basic.duration;
            _price = basic.price;
        } else if (_listingType == ListingType.ADVANCED) {
            ADVANCED memory advanced = _getListingStorageData().Advanced;

            _duration = advanced.duration;
            _price = advanced.price;
        } else {
            PRO memory pro = _getListingStorageData().Pro;

            _duration = pro.duration;
            _price = pro.price;
        }

        return (_duration, _price);
    }

    

   
    function _getPlatformFee(
        address _currency,
        uint256 _price
    ) internal view returns (uint256 fee) {
        (, int256 answer, , , ) = ApprovedCurrencyLib.getCurrencyPriceInfo(
            _currency
        );
        uint256 currencyToUsd = uint256(answer);
        uint8 decimals = ApprovedCurrencyLib.getCurrencyDecimals(_currency);

        if (_currency == NATIVE_TOKEN){
            fee = (_price*(1*(10**decimals))*MATIC_BUFFER)/currencyToUsd;
        }
        else {
            uint8 ERC20_BUFFER = ERC20(_currency).decimals();
            fee = (_price*(1*(10**decimals))*(1*(10**ERC20_BUFFER)))/currencyToUsd;
        }  

    }


      function _validateListing(
        ListingParameters memory _params,
        address _lister
    ) internal view returns (TokenType _tokenType){
        _tokenType = _validateAssetContract(_params.assetContract);
        bool _isListerValidated = _validateListerRequirements(
            _params.assetContract,
            _tokenType,
            _params.tokenId,
            _lister
        );
        _validateListingCurrency(_params.currency);

        if (!_isListerValidated) {
            revert __DirectListing_InvalidListerRequirements(
                _params.assetContract,
                _tokenType,
                _params.tokenId
            );
        }
    }

    function _getListingStorageData()
        internal
        pure
        returns (DirectListingsStorage.Data storage _data)
    {
        _data = DirectListingsStorage.data();
    }

    function _getApprovedCurrencyStorageData()
        internal
        pure
        returns (ApprovedCurrencyLibStorage.Data storage _data)
    {
        _data = ApprovedCurrencyLibStorage.data();
    }   

    
}
