// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {IOffer, OfferStorage} from "./OfferStorage.sol";
import {IDirectListings, DirectListingsStorage} from "../directListings/DirectListingsStorage.sol";


import {ERC721} from "openzeppelin-contract/token/ERC721/ERC721.sol";
import {ERC1155} from "openzeppelin-contract/token/ERC1155/ERC1155.sol";
import {IERC20, SafeERC20} from "openzeppelin-contract/token/ERC20/utils/SafeERC20.sol";


import {ERC2771ContextConsumer} from "@thirdweb-dev/contracts/extension/upgradeable/ERC2771ContextConsumer.sol";
import {ReentrancyGuard} from "@thirdweb-dev/contracts/extension/upgradeable/ReentrancyGuard.sol";
import {CurrencyTransferLib} from "@thirdweb-dev/contracts/lib/CurrencyTransferLib.sol";
import {RoyaltyPaymentsLogic} from "@thirdweb-dev/contracts/extension/upgradeable/RoyaltyPayments.sol";



contract OfferLogic is IOffer, ERC2771ContextConsumer, ReentrancyGuard {
    using SafeERC20 for IERC20;
       

       bytes32 private constant LISTER_ROLE = keccak256("LISTER_ROLE");
        address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
      address private immutable nativeTokenWrapper;


       constructor (address _nativeTokenWrapper) {
        nativeTokenWrapper = _nativeTokenWrapper;
    }


     /**
     *  @notice Make an offer for NFTs (ERC-721 or ERC-1155)
     *
     *  @param _params The parameters of an offer.
     *
     *  @return offerId The unique integer ID assigned to the offer.
     */

    

    function makeOffer(OfferParams memory _params, uint256 _listingId) external payable returns (uint256 offerId) {
        DirectListingsStorage.Data storage listingData = _getListingStorageData();
        OfferStorage.Data storage offerData = _getOfferStorageData();
        address sender = _msgSender();
        int256 index = listingData.idToIndex[_listingId];
        IDirectListings.Listing memory listing = listingData.listings[uint256(index)]; 
        uint256 expirationTime;
      if (_listingId <= 0 ||  _listingId > listingData.listingId || listing.status != IDirectListings.Status.CREATED) {
            revert __Offer_InvalidListingId();
        }
     _validateERC20AllowanceAndBalanceOrNativeTokenAmount(listing.currency,  _params.totalPrice, sender);
        unchecked {
          expirationTime =  uint128(block.timestamp) + _params.duration;
        }
        

        Offer memory offer = Offer({
            totalPrice: _params.totalPrice,
            expirationTimestamp: expirationTime,
            offeror: sender,
            listingId: _listingId,
            status: Status.CREATED
        });
       offerId +=1;
        emit NewOffer(_params.totalPrice, expirationTime, _listingId, sender, offerId);
        offerData.listingIdToOffer[_listingId][offerId] = offer;
        offerData.listingIdToOfferCount[_listingId] += 1;
       
    }



    /**
     *  @notice Cancel an offer.
     *
     *  @param _offerId The ID of the offer to cancel.
     */
    function cancelOffer(uint256 _offerId, uint256 _listingId) external payable{
         
        DirectListingsStorage.Data storage listingData = _getListingStorageData();
        OfferStorage.Data storage offerData = _getOfferStorageData();
        address sender = _msgSender();
        Offer memory offer = offerData.listingIdToOffer[_listingId][_offerId];
        int256 index = listingData.idToIndex[_listingId];
        IDirectListings.Listing memory listing = listingData.listings[uint256(index)];
        if (_listingId <= 0 ||  _listingId > listingData.listingId) {
            revert __Offer_InvalidListingId();
        }

        if (sender != offer.offeror || offer.status != Status.CREATED){
            revert __Offer_UnauthorizedToCall();
        } 
        
        
         emit CancelledOffer(sender, _offerId,  _listingId);
         CurrencyTransferLib.transferCurrencyWithWrapper(listing.currency, address(this), offer.offeror, offer.totalPrice, nativeTokenWrapper);
        offerData.listingIdToOffer[_listingId][_offerId].status = Status.CANCELLED;
        // uint256 endTimeStamp = offer.expirationTimestamp;

    }


     /// @notice Returns an offer for the given offer ID.
    function getOffer(uint256 _offerId, uint256 _listingId) external view returns (Offer memory) {
         OfferStorage.Data storage offerData = _getOfferStorageData();
         Offer memory offer =  offerData.listingIdToOffer[_listingId][ _offerId];
         return offer;
    }

    function getAllOffers(uint256 _listingId) external view returns (Offer[] memory) {
          OfferStorage.Data storage offerData = _getOfferStorageData();
         uint256 count = offerData.listingIdToOfferCount[_listingId];
         Offer[] memory offers;
         for(uint256 i = 0; i < count; ++i) {
             Offer memory offer =  offerData.listingIdToOffer[_listingId][i];
            if(offer.expirationTimestamp < block.timestamp && offer.status == Status.CREATED ) {
                 offers[i] = offer;
            }
           
         }
         return offers;
   
    }

     
     function acceptOffer(uint256 _offerId,  uint256 _listingId) external payable nonReentrant{
         DirectListingsStorage.Data storage listingData = _getListingStorageData();
        OfferStorage.Data storage offerData = _getOfferStorageData();
        address lister = _msgSender();
        Offer memory offer = offerData.listingIdToOffer[_listingId][_offerId];
        int256 index = listingData.idToIndex[_listingId];
         IDirectListings.Listing memory listing = listingData.listings[uint256(index)]; 

        if (_listingId <= 0 ||  _listingId > listingData.listingId) {
            revert __Offer_InvalidListingId();
        }

        if (lister != listing.listingCreator || offer.status != Status.CREATED || listing.status != IDirectListings.Status.CREATED || block.timestamp >= offer.expirationTimestamp){
            revert __Offer_UnauthorizedToCall();
        } 
        bool isMarketStillApproved = _validateListerRequirements(listing.assetContract, listing.tokenType, listing.tokenId, lister);
        if (!isMarketStillApproved) {
            revert __Offer_MarketPlaceUnapproved();
        }
        emit AcceptedOffer(
         offer.offeror,
          offer.totalPrice,
         _listingId,
         _offerId
       
    );
        offerData.listingIdToOffer[_listingId][_offerId].status = Status.SOLD;
        listingData.listings[uint256(index)].status =  IDirectListings.Status.SOLD;
        _validateERC20AllowanceAndBalanceOrNativeTokenAmount(listing.currency, offer.totalPrice, offer.offeror);
        _payout(listing.currency, offer.totalPrice, offer.offeror,  lister, listing.assetContract, listing.tokenId);
        _transferListing(listing.tokenType, listing.assetContract, listing.tokenId, offer.offeror,  lister);
        
     }


      function rejectOffer(uint256 _offerId, uint256 _listingId) external payable {
         
        DirectListingsStorage.Data storage listingData = _getListingStorageData();
        OfferStorage.Data storage offerData = _getOfferStorageData();
         int256 index = listingData.idToIndex[_listingId];
         IDirectListings.Listing memory listing = listingData.listings[uint256(index)]; 
        address lister = _msgSender();
        Offer memory offer = offerData.listingIdToOffer[_listingId][_offerId];
       
        if (_listingId <= 0 ||  _listingId > listingData.listingId) {
            revert __Offer_InvalidListingId();
        }

        if (lister != listing.listingCreator || offer.status != Status.CREATED){
            revert __Offer_UnauthorizedToCall();
        } 
        
         emit RejectedOffer(lister, _offerId,  _listingId);
         CurrencyTransferLib.transferCurrencyWithWrapper(listing.currency, address(this), offer.offeror, offer.totalPrice, nativeTokenWrapper);
        offerData.listingIdToOffer[_listingId][_offerId].status = Status.CANCELLED;

    }



      function _validateERC20AllowanceAndBalanceOrNativeTokenAmount(address _currency, uint256 _tokenPrice, address _buyer) internal {
      if(_currency == NATIVE_TOKEN) {
        if(msg.value < _tokenPrice) {
            revert __Offer_InsufficientFunds(_tokenPrice);
        }
      }
        else {
            if (IERC20(_currency).balanceOf(_buyer) < _tokenPrice) {
                    revert __Offer_InsufficientFunds(_tokenPrice);
            }
                         
                IERC20(_currency).safeTransferFrom(_buyer, address(this), _tokenPrice);   
        }
      
    }


    function _payout(address _currency, uint256 _tokenPrice, address _buyer, address _lister, address _assetContract, uint256 _tokenId) internal {
         address _nativeTokenWrapper = nativeTokenWrapper;

        (address payable[] memory recipients, uint256[] memory amounts) = RoyaltyPaymentsLogic(address(this)).getRoyalty(_assetContract, _tokenId, _tokenPrice);
        uint256  recipientLength = recipients.length;

        uint256 _amountRemaining = _tokenPrice;

        if(recipientLength > 0){
            for (uint256 i = 0;  i < recipientLength; ++i) {
               if (_amountRemaining < amounts[i]) {
                revert __Offer_InsufficientFunds( _amountRemaining);
               } 
        CurrencyTransferLib.transferCurrencyWithWrapper(_currency, _buyer, recipients[i], amounts[i], _nativeTokenWrapper);
         unchecked {
            _amountRemaining -= amounts[i];
         }
            }
        }

        CurrencyTransferLib.transferCurrencyWithWrapper(_currency, _buyer, _lister, _amountRemaining, _nativeTokenWrapper);       

    }

      function _transferListing(IDirectListings.TokenType _tokenType, address _assetContract, uint256 _tokenId, address _buyFor, address _lister) internal {
        uint8 _amount = 1;
          if (_tokenType == IDirectListings.TokenType.ERC1155) {
              ERC1155(_assetContract).safeTransferFrom(_lister, _buyFor, _tokenId, _amount, bytes(""));
          }
          else {
             ERC721(_assetContract).safeTransferFrom(_lister, _buyFor, _tokenId, bytes(""));
          }

     }


       function _validateListerRequirements(
        address _assetContract,
        IDirectListings.TokenType _tokenType,
        uint256 _tokenId,
        address _lister
    ) internal view returns (bool) {
        bool isValid;
        if (_tokenType == IDirectListings.TokenType.ERC721) {
            address _owner = ERC721(_assetContract).ownerOf(_tokenId);
            address approvedAddress = ERC721(_assetContract).getApproved(
                _tokenId
            );

            bool _ownToken = (_owner == _lister);
            bool _approvedMarket = (address(this) == approvedAddress);

            isValid = (_ownToken && _approvedMarket);
        } else if (_tokenType == IDirectListings.TokenType.ERC1155) {
            uint256 _ownerBalance = ERC1155(_assetContract).balanceOf(
                _lister,
                _tokenId
            );

            bool _qtyOwned = (_ownerBalance >= 1);
            bool _approvedMarket = (
                ERC1155(_assetContract).isApprovedForAll(_lister, address(this))
            );

            isValid = (_qtyOwned && _approvedMarket);
        }
        return isValid;
    }


      function _getOfferStorageData()
        internal
        pure
        returns (OfferStorage.Data storage _data)
    {
        _data = OfferStorage.data();
    }



    function _getListingStorageData()
        internal
        pure
        returns (DirectListingsStorage.Data storage _data)
    {
        _data = DirectListingsStorage.data();
    }


}
