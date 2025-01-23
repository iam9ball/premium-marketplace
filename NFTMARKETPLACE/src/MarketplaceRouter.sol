// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BaseRouter} from "thirdweb-dynamic/src/presets/BaseRouter.sol";

import {Initializable} from "@thirdweb-dev/contracts/extension/upgradeable/Initializable.sol";
import {PermissionsEnumerable, PermissionsStorage, Permissions} from "@thirdweb-dev/contracts/extension/upgradeable/PermissionsEnumerable.sol";
import {ERC2771ContextUpgradeable} from "@thirdweb-dev/contracts/extension/upgradeable/ERC2771ContextUpgradeable.sol";
import {Multicall} from "@thirdweb-dev/contracts/extension/Multicall.sol";
import {RoyaltyPaymentsLogic} from "@thirdweb-dev/contracts/extension/upgradeable/RoyaltyPayments.sol";
import {ReentrancyGuardInit} from "@thirdweb-dev/contracts/extension/upgradeable/init/ReentrancyGuardInit.sol";
import {ApprovedCurrencyLibStorage} from "./chainlink/priceFeed/ApprovedCurrencyLibStorage.sol";
// import {OfferStorage} from "./extensions/offer/OfferStorage.sol";
// import {IOffer} from "./extensions/offer/IOffer.sol";



import {ERC721Holder} from "openzeppelin-contract/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "openzeppelin-contract/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC165} from "openzeppelin-contract/interfaces/IERC165.sol";


import {IDirectListings, DirectListingsStorage} from "./extensions/directListings/DirectListingsStorage.sol";

import {ApprovedCurrencyLib} from "./chainlink/priceFeed/ApprovedCurrencyLib.sol";

contract MarketplaceRouter is
    IERC165,
    Initializable,
    BaseRouter,
    PermissionsEnumerable,
    Multicall,
    ERC721Holder,
    ERC1155Holder,
    RoyaltyPaymentsLogic,
    ERC2771ContextUpgradeable,
    ReentrancyGuardInit
{
    bytes32 private constant EXTENSION_MANAGER_ROLE =
        keccak256(bytes("EXTENSION_MANAGER_ROLE"));
    bytes32 private constant MODULE_TYPE = bytes32("MarketPlaceProxy");
    uint8 private constant VERSION = 1;

    event __Router_ListingPlanSet(uint128 _duration, uint256 _price);
    error __Router_InvalidListingType(IDirectListings.ListingType _listingType);
    error __Router_UnauthorizedToCall();

    modifier onlyExtensionManager() {
        bool hasRole = _hasRole(EXTENSION_MANAGER_ROLE, msg.sender);

        if (!hasRole) {
            revert __Router_UnauthorizedToCall();
        }
        _;
    }

    struct MarketPlaceParams {
        Extension[] extensions;
        address royaltyEngineAddress;
    }

    constructor(MarketPlaceParams memory _marketPlaceParams) 
    BaseRouter(_marketPlaceParams.extensions) 
    RoyaltyPaymentsLogic(_marketPlaceParams.royaltyEngineAddress){
        ///----MAKE SURE THIS CONTRACT CAN NO LONGER BE INITIALIZED
        _disableInitializers();
    }

    function initialize(
        address _extension_manager_address,
        address[] memory _trustedForwarders,
        IDirectListings.ListingType _listingType,
        uint128 _duration,
        uint256 _price,
        address _currency,
        address _priceFeed
    ) external initializer {
        __BaseRouter_init();
        __ERC2771Context_init(_trustedForwarders);
        __ReentrancyGuard_init();
        ///---SET UP ROLES
        _setupRole(DEFAULT_ADMIN_ROLE, _extension_manager_address);
        _setupRole(EXTENSION_MANAGER_ROLE, _extension_manager_address);
        _setupRole(keccak256("LISTER_ROLE"), address(0));

        _setRoleAdmin(EXTENSION_MANAGER_ROLE, EXTENSION_MANAGER_ROLE);

        setListingPlan(_listingType, _duration, _price);
        setApprovedCurrency(_currency, _priceFeed);
    }

    ////Implement this function *******
    receive() external payable {
        
    }

    function contractVersion() external pure returns (uint8) {
        return VERSION;
    }

    function contractType() external pure returns (bytes32) {
        return MODULE_TYPE;
    }

    function setListingPlan(
        IDirectListings.ListingType _listingType,
        uint128 _duration,
        uint256 _price
    ) public onlyExtensionManager {
        if (_listingType == IDirectListings.ListingType.BASIC) {
            IDirectListings.BASIC memory basic = IDirectListings.BASIC({
                duration: _duration,
                price: _price
            });
            _getListingStorageData().Basic = basic;
        } else if (_listingType == IDirectListings.ListingType.ADVANCED) {
            IDirectListings.ADVANCED memory advanced = IDirectListings
                .ADVANCED({duration: _duration, price: _price});
            _getListingStorageData().Advanced = advanced;
        } else if (_listingType == IDirectListings.ListingType.PRO) {
            IDirectListings.PRO memory pro = IDirectListings.PRO({
                duration: _duration,
                price: _price
            });
            _getListingStorageData().Pro = pro;
        } else {
            revert __Router_InvalidListingType(_listingType);
        }

        emit __Router_ListingPlanSet(_duration, _price);
    }

    function getListingTypeInfo(
        IDirectListings.ListingType _listingType
    ) external view returns (uint128, uint256) {
        uint128 _duration;
        uint256 _price;
        if (_listingType == IDirectListings.ListingType.BASIC) {
            IDirectListings.BASIC memory basic = _getListingStorageData().Basic;

            _duration = basic.duration;
            _price = basic.price;
        } else if (_listingType == IDirectListings.ListingType.ADVANCED) {
            IDirectListings.ADVANCED memory advanced = _getListingStorageData().Advanced;

            _duration = advanced.duration;
            _price = advanced.price;
        } else {
            IDirectListings.PRO memory pro = _getListingStorageData().Pro;

            _duration = pro.duration;
            _price = pro.price;
        }

        return (_duration, _price);
    }

    function setApprovedCurrency(
        address _currency,
        address _priceFeed
    ) public onlyExtensionManager {
        ApprovedCurrencyLib._setApprovedCurrency(_currency, _priceFeed);
    }
    function removeApprovedCurrency(
        address _currency
    ) public onlyExtensionManager {
        ApprovedCurrencyLib._removeApprovedCurrency(_currency);
    }
    
     function getIsApprovedCurrency(
        address _currency
    ) public view returns (bool isApprovedCurrency) {
        isApprovedCurrency = _getApprovedCurrencyStorageData()
            .currencyToIsInserTed[_currency];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(IERC165, ERC1155Holder) returns (bool) {
        return (interfaceId == type(ERC1155Holder).interfaceId ||
            interfaceId == type(ERC721Holder).interfaceId ||
            super.supportsInterface(interfaceId));
    }

    function _hasRole(
        bytes32 _role,
        address _account
    ) internal view returns (bool) {
        PermissionsStorage.Data storage data = PermissionsStorage.data();
        return data._hasRole[_role][_account];
    }

    function _canSetRoyaltyEngine() internal view override returns (bool) {
        return _hasRole(EXTENSION_MANAGER_ROLE, msg.sender);
    }

    function _isAuthorizedCallToUpgrade()
        internal
        view
        virtual
        override
        returns (bool)
    {
        return _hasRole(EXTENSION_MANAGER_ROLE, msg.sender);
    }

    function _msgSender()
        internal
        view
        override(ERC2771ContextUpgradeable, Permissions, Multicall)
        returns (address sender)
    {
        return ERC2771ContextUpgradeable._msgSender();
    }

    function _msgData()
        internal
        view
        override(ERC2771ContextUpgradeable, Permissions)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }

     function _getApprovedCurrencyStorageData()
        internal
        pure
        returns (ApprovedCurrencyLibStorage.Data storage _data)
    {
        _data = ApprovedCurrencyLibStorage.data();
    }

    function _getListingStorageData()
        internal
        pure
        returns (DirectListingsStorage.Data storage _data)
    {
        _data = DirectListingsStorage.data();
    }

    function getAllCurrency() external view returns (address[10] memory) {
        address[10] memory currency;
        currency = ApprovedCurrencyLibStorage.data().currency;
        return currency;
    }
    
//     function getOfferStorageData()
//         internal
//         pure
//         returns (OfferStorage.Data storage _data)
//     {
//         _data = OfferStorage.data();
//     }
  
//   function getOffer() external view returns (IOffer.Offer memory offer) {
//    offer = getOfferStorageData().listingIdToOffer[1][1];
//   }
}
