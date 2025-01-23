// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {AggregatorV3Interface} from "chainlink-contract/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IApprovedCurrency, ApprovedCurrencyLibStorage} from "./ApprovedCurrencyLibStorage.sol";

library ApprovedCurrencyLib {
    event __ApprovedCurrency_CurrencyRemoved(address indexed _currency);
    event __ApprovedCurrency_CurrencySet(
        address indexed _currency,
        address indexed _priceFeed
    );
    error __ApprovedCurrency_CurrencyNotApproved(address _currency);

    function getCurrencyPriceInfo(
        address _currency
    )
        internal
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        address priceFeed = ApprovedCurrencyLibStorage
            .data()
            .currencyToPriceFeed[_currency];
        (
            roundId,
            answer,
            startedAt,
            updatedAt,
            answeredInRound
        ) = AggregatorV3Interface(priceFeed).latestRoundData();
    }

    function getCurrencyDecimals(
        address _currency
    ) internal view returns (uint8 decimals) {
        address priceFeed = ApprovedCurrencyLibStorage
            .data()
            .currencyToPriceFeed[_currency];
        decimals = AggregatorV3Interface(priceFeed).decimals();
    }

    function _setApprovedCurrency(
        address _currency,
        address _priceFeed
    ) internal {
        bool isInserted = ApprovedCurrencyLibStorage
            .data()
            .currencyToIsInserTed[_currency];
        if (!isInserted) {
            uint8 currencyIndex = getInValidCurrencyIndex();
            ApprovedCurrencyLibStorage.data().currency[
                currencyIndex
            ] = _currency;
            ApprovedCurrencyLibStorage.data().currencyToPriceFeed[
                _currency
            ] = _priceFeed;
            ApprovedCurrencyLibStorage.data().currencyToIsInserTed[
                _currency
            ] = true;
        } else {
            uint8 currencyIndex = getValidCurrencyIndex(_currency);
            ApprovedCurrencyLibStorage.data().currency[
                currencyIndex
            ] = _currency;
            ApprovedCurrencyLibStorage.data().currencyToPriceFeed[
                _currency
            ] = _priceFeed;
        }

        emit __ApprovedCurrency_CurrencySet(_currency, _priceFeed);
    }

    function _removeApprovedCurrency(address _currency) internal {
        bool isInserted = ApprovedCurrencyLibStorage
            .data()
            .currencyToIsInserTed[_currency];

        if (isInserted) {
            uint8 currencyIndex = getValidCurrencyIndex(_currency);
            ApprovedCurrencyLibStorage.data().currency[currencyIndex] = address(
                0
            );
            ApprovedCurrencyLibStorage.data().currencyToPriceFeed[
                _currency
            ] = address(0);
            ApprovedCurrencyLibStorage.data().currencyToIsInserTed[
                _currency
            ] = false;
        } else {
            revert __ApprovedCurrency_CurrencyNotApproved(_currency);
        }

        emit __ApprovedCurrency_CurrencyRemoved(_currency);
    }

    function getApprovedCurrencySize() internal view returns (uint256) {
        return ApprovedCurrencyLibStorage.data().currency.length;
    }

    function getValidCurrencyIndex(
        address _currency
    ) internal view returns (uint8 index) {
        uint256 length = getApprovedCurrencySize();

        for (uint8 i = 0; i < length; ++i) {
            address currency = ApprovedCurrencyLibStorage.data().currency[i];
            if (_currency == currency) {
                return index = i;
            }
        }
    }

    function getInValidCurrencyIndex() internal view returns (uint8 index) {
        uint256 length = getApprovedCurrencySize();

        for (uint8 i = 0; i < length; ++i) {
            address currency = ApprovedCurrencyLibStorage.data().currency[i];
            if (currency == address(0)) {
                return index = i;
            }
        }
    }

    function getAllCurrency() internal view returns (address[10] memory) {
        uint256 length = getApprovedCurrencySize();
        address[10] memory currency;

        for (uint8 i = 0; i < length; ++i) {
            currency[i] = ApprovedCurrencyLibStorage.data().currency[i];
        }

        return currency;
    }
}
