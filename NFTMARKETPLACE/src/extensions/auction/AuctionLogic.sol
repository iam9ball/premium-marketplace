// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


import {IERC721} from "openzeppelin-contract/token/ERC721/IERC721.sol";
import {IERC1155} from "openzeppelin-contract/token/ERC1155/IERC1155.sol";
import {IERC165} from "openzeppelin-contract/interfaces/IERC165.sol";
import {Strings} from "openzeppelin-contract/utils/Strings.sol";
import {IERC20, SafeERC20} from "openzeppelin-contract/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "openzeppelin-contract/token/ERC20/ERC20.sol";


import {ERC2771ContextConsumer} from "@thirdweb-dev/contracts/extension/upgradeable/ERC2771ContextConsumer.sol";
import {ReentrancyGuard} from "@thirdweb-dev/contracts/extension/upgradeable/ReentrancyGuard.sol";
import {Permissions} from "@thirdweb-dev/contracts/extension/upgradeable/PermissionsEnumerable.sol";
import {CurrencyTransferLib} from "@thirdweb-dev/contracts/lib/CurrencyTransferLib.sol";



import {ApprovedCurrencyLibStorage} from "../../chainlink/priceFeed/ApprovedCurrencyLibStorage.sol";
import {ApprovedCurrencyLib} from "../../chainlink/priceFeed/ApprovedCurrencyLib.sol";
import {AuctionStorage, IAuction} from "./AuctionStorage.sol";



contract AuctionLogic is IAuction, ERC2771ContextConsumer,  ReentrancyGuard{

     using SafeERC20 for IERC20;

     uint128 private constant AUCTION_START_BUFFER = 30 minutes;
     uint64 private constant MAX_BID_BUFFER_BPS = 100; 
     uint64 private constant END_TIME_BUFFER = 1 days;
     uint64 private constant ONE_HOUR_THIRTY_MINUTES = 5400 seconds;

      uint64 private constant ETH_BUFFER = 1e18; 
      uint8 private constant PERCENTAGE = 100;

   
    bytes32 private constant LISTER_ROLE = keccak256("LISTER_ROLE");
    
    address private immutable nativeTokenWrapper;
    address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;


    
       modifier onlyCreator() {
        address _sender = _msgSender();
        bool isPermissionedToCall = Permissions(address(this))
            .hasRoleWithSwitch(LISTER_ROLE, _sender);
        if (!isPermissionedToCall) {
            revert __Auction_InvalidAccessToCall(_sender);
        }
        _;
    }

    constructor (address _nativeTokenWrapper) {
        nativeTokenWrapper = _nativeTokenWrapper;
    }

    function createAuction(AuctionParameters memory _params) external onlyCreator returns (uint256 auctionId){
           address creator = _msgSender();
           TokenType _tokenType =  _validateAuction(_params, creator);
           if (block.timestamp + AUCTION_START_BUFFER < _params.startTimestamp || _params.startTimestamp >= _params.endTimestamp) {
              revert __Auction_InvalidTime();
           }

           if (_params.minimumBidAmount > _params.buyoutBidAmount) {
             revert __Auction_InvalidBuyoutBidAmount();
           }
           if (_params.bidBufferBps > MAX_BID_BUFFER_BPS){
             revert __Auction_InvalidBidBuffer();
           }
           uint128 duration;
      unchecked {
       duration = _params.endTimestamp - _params.startTimestamp;
      } 
      if (duration > ONE_HOUR_THIRTY_MINUTES) {
        revert __Auction_InvalidDuration();
      }
          auctionId = _getAuctionId();
          Auction memory auction = Auction ({
        auctionId: auctionId, 
        tokenId: _params.tokenId,
        minimumBidAmount: _params.minimumBidAmount,
        buyoutBidAmount: _params.buyoutBidAmount,
        bidBufferBps: _params.bidBufferBps,
        startTimestamp: _params.startTimestamp,
        endTimestamp: _params.endTimestamp,
        auctionCreator: creator,
        assetContract: _params.assetContract,
        currency: _params.currency,
        tokenType: _tokenType,
        status: Status.CREATED
    });
     emit NewAuction(
       creator,
       auctionId,
       _params.assetContract
    );
      uint128 endTime; 
      
      unchecked {
       endTime = END_TIME_BUFFER + _params.endTimestamp;
      } 
     AuctionStorage.Data storage data =  _getAuctionStorageData();
    data.auctions.push(auction);
     uint256 auctionIndex =  (data.auctions.length) - 1;
    data.idToIndex[auctionId] = int256(auctionIndex);
    data.endTimeToAuctionId[endTime].push(auctionId);
    }


    function cancelAuction(uint256 auctionId) external {
        address creator = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
        int256 auctionIndex = data.idToIndex[auctionId]; 
        Auction memory auction = data.auctions[uint256(auctionIndex)];
        Auction[] memory auctionArr = data.auctions;

        if (creator != auction.auctionCreator || auction.status != Status.CREATED) {
            revert __Auction_UnAuthorizedToCall();
        }

        emit CancelledAuction(creator, auctionId);

          data.auctions[uint256(auctionIndex)].status = Status.CANCELLED;
         uint256 length = auctionArr.length;
        uint256 _lastAuctionId = auctionArr[length- 1].auctionId;

        data.auctions[uint256(auctionIndex)] = (auctionArr[length- 1]);
        data.auctions.pop();
        data.idToIndex[_lastAuctionId] = auctionIndex;
        data.idToIndex[auctionId] = -1;

    }

    
     
     function updateAuction(uint256 auctionId, UpdateAuctionParameters calldata _params) external {
        address creator = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
        int256 auctionIndex = data.idToIndex[auctionId]; 
        Auction memory auction = data.auctions[uint256(auctionIndex)];
        if (creator != auction.auctionCreator) {
            revert  __Auction_UnAuthorizedToCall();
        }
        if (auction.status != Status.CREATED || block.timestamp > auction.endTimestamp) {
            revert __Auction_InvalidAuctionState();
        }

        if (block.timestamp + AUCTION_START_BUFFER < _params.startTimestamp || _params.startTimestamp >= _params.endTimestamp) {
              revert __Auction_InvalidTime();
           }

        if (_params.minimumBidAmount > _params.buyoutBidAmount) {
             revert __Auction_InvalidBuyoutBidAmount();
           }
        if (_params.bidBufferBps > MAX_BID_BUFFER_BPS){
             revert __Auction_InvalidBidBuffer();
           }
           uint128 duration;
      unchecked {
       duration = _params.endTimestamp - _params.startTimestamp;
      } 
      if (duration > ONE_HOUR_THIRTY_MINUTES) {
        revert __Auction_InvalidDuration();
      } 

      emit AuctionUpdated(auctionId);

       Auction memory _auction = Auction ({
        auctionId: auctionId, 
        tokenId: auction.tokenId,
        minimumBidAmount: _params.minimumBidAmount,
        buyoutBidAmount: _params.buyoutBidAmount,
        bidBufferBps: _params.bidBufferBps,
        startTimestamp: _params.startTimestamp,
        endTimestamp: _params.endTimestamp,
        auctionCreator: creator,
        assetContract: auction.assetContract,
        currency: _params.currency,
        tokenType: auction.tokenType,
        status: auction.status
    });
    
     data.auctions[uint256(auctionIndex)] = _auction;
 
     }

    function bidInAuction(uint256 auctionId, uint256 bidAmount) external  payable nonReentrant{
        address sender = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
        HighestBid memory highestBid = data.idToHighestBid[auctionId];
        int256 auctionIndex = data.idToIndex[auctionId]; 
        Auction memory auction = data.auctions[uint256(auctionIndex)];
        
         CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, sender,  address(this), bidAmount, nativeTokenWrapper);
       _validateBid(bidAmount, auctionId, auction);
        
        

       if (bidAmount >=  auction.buyoutBidAmount) {
          CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, address(this), highestBid.highestBidder, highestBid.amount, nativeTokenWrapper);
           data.idToHighestBid[auctionId] = HighestBid ({
            highestBidder: sender,
            amount: bidAmount
        });
         emit AuctionClosed(auctionId, sender, bidAmount );
       
        data.auctions[uint256(auctionIndex)].status = Status.CLOSED;
     

        
       }
       else {
       if ( highestBid.amount > 0) {
           CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, address(this), highestBid.highestBidder, highestBid.amount, nativeTokenWrapper);
        }

         emit NewBid(
        auctionId,
        sender,
        bidAmount
    );
        data.idToHighestBid[auctionId] = HighestBid ({
            highestBidder: sender,
            amount: bidAmount
        });
         data.auctions[uint256(auctionIndex)].status = Status.STARTED;
       }

    }

    function collectAuctionPayout(uint256 auctionId) external payable nonReentrant{
        address sender = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
        HighestBid memory highestBid = data.idToHighestBid[auctionId];
        int256 auctionIndex = data.idToIndex[auctionId]; 
        Auction memory auction = data.auctions[uint256(auctionIndex)];
         bool validStatus = auction.status == Status.CLOSED || auction.status == Status.STARTED;

        if ((block.timestamp < auction.endTimestamp) && !validStatus ){
            revert __Auction_InvalidAuctionState();
        }
        if (sender != auction.auctionCreator) {
            revert __Auction_UnAuthorizedToCall();
        }
        if (highestBid.amount == 0) {
            revert __Auction_NoBidYet();
        }
        emit AuctionPaidOut(auctionId, sender, highestBid.amount);
         CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, address(this), sender, highestBid.amount, nativeTokenWrapper);
    
    }
    
    function collectAuctionTokens(uint256 auctionId) external nonReentrant {
        address sender = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
        HighestBid memory highestBid = data.idToHighestBid[auctionId];
        int256 auctionIndex = data.idToIndex[auctionId]; 
        Auction memory auction = data.auctions[uint256(auctionIndex)];
         bool validStatus = auction.status == Status.CLOSED || auction.status == Status.STARTED;

        if ((block.timestamp < auction.endTimestamp) && !validStatus ){
            revert __Auction_InvalidAuctionState();
        }
        if (sender != highestBid.highestBidder) {
            revert __Auction_UnAuthorizedToCall();
        }
        emit AuctionTokenPaidOut(auctionId, sender);
        _transferAuctionToken(auction.tokenType, auction.assetContract, auction.tokenId,  sender, address(this));
    
    }
     
     function isNewWinningBid(uint256 auctionId, uint256 bidAmount) public view returns (bool isWinningBid) {
          AuctionStorage.Data storage data =  _getAuctionStorageData();
          uint256 highestBid = data.idToHighestBid[auctionId].amount;
           int256 auctionIndex = data.idToIndex[auctionId]; 
           Auction memory auction = data.auctions[uint256(auctionIndex)];
          uint64 bidBuffer = auction.bidBufferBps;
          uint256 winningBidBuffer;
          if (highestBid == 0) {
             isWinningBid = bidAmount >= auction.minimumBidAmount;
          } else{
            if (auction.currency == NATIVE_TOKEN){
                
              winningBidBuffer = (((bidBuffer*ETH_BUFFER)/PERCENTAGE) * highestBid) / ETH_BUFFER ;
                } else {
                 uint8 ERC20_BUFFER = ERC20(auction.currency).decimals();
                 winningBidBuffer = (((bidBuffer*(1*(10**ERC20_BUFFER)))/PERCENTAGE) * highestBid) / (1*(10**ERC20_BUFFER));
                }
                 isWinningBid = bidAmount >= (highestBid + winningBidBuffer);
                }
    }

    //  / @notice Chainlink Function that performs operation when upkeep needed
//    function performUpkeep(
//     bytes calldata /**performData */
//   ) external {
//     (bool upkeepNeeded, bytes memory performData) = checkUpkeep("");
//      AuctionStorage.Data storage data =  _getAuctionStorageData();
//       Auction[] memory auctionArr = data.auctions;
      
//     if (upkeepNeeded) {
        
//           if (auctionArr.length == 1) {
//             delete data.endTimeToAuctionId[block.timestamp];
//             data.auctions.pop();
//         }

//         uint256[] memory _auctionsId = abi.decode(performData, (uint256[]));

        
//         if (_auctionsId.length == 1) {
//             delete data.endTimeToAuctionId[block.timestamp]; 
//             int256 index =  data.idToIndex[_auctionsId[0]];

//               uint256 len = auctionArr.length;
//            uint256 _lastAuctionId = auctionArr[len- 1].auctionId;

//             data.auctions[uint256(index)] = (data.auctions[len- 1]);

//            data.idToIndex[_lastAuctionId] = index;
//            data.idToIndex[_auctionsId[0]] = -1;

//            data.auctions.pop();
//         }
        
//         else {
//             delete data.endTimeToAuctionId[block.timestamp];
//              for (uint256 i = 0; i < _auctionsId.length; ++i) {

//              int256 index =  data.idToIndex[_auctionsId[i]];

//              uint256 len = auctionArr.length;
//            uint256 _lastAuctionId = auctionArr[len- 1].auctionId;

//             data.auctions[uint256(index)] = (data.auctions[len- 1]);

//            data.idToIndex[_lastAuctionId] = index;
//            data.idToIndex[_auctionsId[i]] = -1;

//            data.auctions.pop();
         
//            }

//         }
          
//     }
//   }
 

 /*//////////////////////////////////////////////////////////////
                            PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
//     /// @notice Chainlink Function that checks and return perform data when upkeep needed
//    function checkUpkeep(
//     bytes memory  /**performData */
//   ) public view returns(bool upkeepNeeded, bytes memory performData){
//         uint256[] memory data =  _getAuctionStorageData().endTimeToAuctionId[block.timestamp];
        
//        if (data.length > 0) {
//            upkeepNeeded = true;
//            performData = abi.encode(data);
//        }
//        else {
//         upkeepNeeded = false;
//            performData = bytes("");
//        }
//   }


    /// @notice Returns the auction of the provided auction ID.
    function getAuction(uint256 _auctionId) external view returns (Auction memory auction) {
        AuctionStorage.Data storage data =  _getAuctionStorageData();
        
           int256 auctionIndex = data.idToIndex[_auctionId]; 
         auction = data.auctions[uint256(auctionIndex)];
    }

    /// @notice Returns all non-cancelled auctions.
    function getAllAuctions() external view returns (Auction[] memory auctions) {
         AuctionStorage.Data storage data =  _getAuctionStorageData();
         auctions = data.auctions;

    }



    /// @notice Returns the winning bid of an active auction.
    function getWinningBid(
        uint256 _auctionId
    ) external view returns (address bidder, address currency, uint256 bidAmount){
         AuctionStorage.Data storage data =  _getAuctionStorageData();
         HighestBid memory highestBid = data.idToHighestBid[_auctionId];
         int256 auctionIndex = data.idToIndex[_auctionId]; 
        Auction memory auction = data.auctions[uint256(auctionIndex)];
           bidAmount = highestBid.amount;
           bidder = highestBid.highestBidder;
           currency = auction.currency;
    }

    /// @notice Returns whether an auction is active.
    function isAuctionExpired(uint256 _auctionId) external view returns (bool) {
        AuctionStorage.Data storage data =  _getAuctionStorageData();
         int256 auctionIndex = data.idToIndex[_auctionId]; 
        Auction memory auction = data.auctions[uint256(auctionIndex)];
        bool isExpired = block.timestamp >= auction.endTimestamp;
        return isExpired;
    }



    function _transferBid(address _currency, uint256 _bidAmount, address sender) internal {
         
        if (_currency == NATIVE_TOKEN) {
            (bool success,) = address(this).call{value: _bidAmount}("");
            if (!success) {
                revert __Auction_TransferFailed();
            }
        } else {
            IERC20(_currency).safeTransferFrom(sender, address(this), _bidAmount);
        }


    }

     function _transferAuctionToken(TokenType _tokenType, address _assetContract, uint256 _tokenId, address _buyFor, address _lister) internal {
        uint8 _amount = 1;
          if (_tokenType == TokenType.ERC1155) {
              IERC1155(_assetContract).safeTransferFrom(_lister, _buyFor, _tokenId, _amount, bytes(""));
          }
          else {
             IERC721(_assetContract).safeTransferFrom(_lister, _buyFor, _tokenId, bytes(""));
          }

     }

    function _validateBid(uint256 bidAmount, uint256 auctionId,  Auction memory auction) internal view {


    bool validBidTime = block.timestamp >= auction.startTimestamp && block.timestamp < auction.endTimestamp;
       bool validStatus = auction.status == Status.CREATED || auction.status == Status.STARTED;

       if (!validBidTime || !validStatus) {
         revert __Auction_InvalidBidTime();
       }
        
        bool isWinningBid =  isNewWinningBid( auctionId,  bidAmount);

        if (!isWinningBid) {
         revert __Auction_InvalidBidAmount();
        }

       

    }



    
  

    function _getAuctionId() internal  returns (uint256 _id) {
        _getAuctionStorageData().auctionId += 1;
        _id = _getAuctionStorageData().auctionId;
    }


    function _validateAuction(
       AuctionParameters memory _params,
        address _creator
    ) internal  returns (TokenType _tokenType){
        _tokenType = _validateAssetContract(_params.assetContract);
        _validateAuctionRequirements(
            _params.assetContract,
            _tokenType,
            _params.tokenId,
             _creator
        );
        _validateAuctionCurrency(_params.currency);

       
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
            revert __Auction_InvalidAssetContract(_assetContract);
        }
    }

function _validateAuctionRequirements(
        address _assetContract,
        TokenType _tokenType,
        uint256 _tokenId,
        address  _creator
    ) internal   {
        if (_tokenType == TokenType.ERC721) {
           IERC721(_assetContract).safeTransferFrom( _creator, address(this), _tokenId);
           
        } else if (_tokenType == TokenType.ERC1155) {
            IERC1155(_assetContract).safeTransferFrom( _creator, address(this), _tokenId, 1, bytes(""));

    }

    }

    function _validateAuctionCurrency(address _currency) internal view {
        bool isApprovedCurrency = getIsApprovedCurrency(_currency);
        if (!isApprovedCurrency) {
            revert __Auction_InvalidAuctionCurrency(_currency);
        }
    }

     function getIsApprovedCurrency(
        address _currency
    ) internal view returns (bool isApprovedCurrency) {
        isApprovedCurrency = _getApprovedCurrencyStorageData()
            .currencyToIsInserTed[_currency];
    }

    function _getApprovedCurrencyStorageData()
        internal
        pure
        returns (ApprovedCurrencyLibStorage.Data storage _data)
    {
        _data = ApprovedCurrencyLibStorage.data();
    }
    
    function _getAuctionStorageData()
        internal
        pure
        returns (AuctionStorage.Data storage _data)
    {
        _data = AuctionStorage.data();
    }

}