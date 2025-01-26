

import { defineChain, getContract } from "thirdweb";
import { anvil, polygonAmoy } from "thirdweb/chains";
import { client } from "./client";

export const contractAddress = "0x1e2a1F8AD39197B3dc97Fa7D58BB181C354B6A57";

export const chain = defineChain({
  id: 80002,
  rpc: "https://80002.rpc.thirdweb.com/2a3b329a72b11d8ffefe89838bcc14b7",
  nativeCurrency: {
    name: "Polygon Amoy",
    symbol: "POL",
    decimals: 18,
  },
});

// Chain ID: 80002
// export const chain = polygonAmoy;

//Marketplace contract
export const marketContract  = getContract({
        address: contractAddress,
        chain,
        client,
        abi: [{
          "inputs": [
            { "internalType": "address", "name": "_logic", "type": "address" },
            { "internalType": "bytes", "name": "_data", "type": "bytes" }
          ],
          "stateMutability": "payable",
          "type": "constructor"
        },
        {
          "inputs": [
            { "internalType": "address", "name": "target", "type": "address" }
          ],
          "type": "error",
          "name": "AddressEmptyCode"
        },
        { "inputs": [], "type": "error", "name": "FailedCall" },
        { "inputs": [], "stateMutability": "payable", "type": "fallback" },
        {
      "type": "function",
      "name": "getListingTypeInfo",
      "inputs": [
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ],
      "outputs": [
        { "name": "", "type": "uint128", "internalType": "uint128" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
     
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_nativeTokenWrapper",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "_msgData",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_msgSender",
      "inputs": [],
      "outputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approveBuyerForListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        { "name": "_buyer", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "buyFromListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        { "name": "_buyFor", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "cancelListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "checkUpkeep",
      "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "outputs": [
        { "name": "upkeepNeeded", "type": "bool", "internalType": "bool" },
        { "name": "performData", "type": "bytes", "internalType": "bytes" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "createListing",
      "inputs": [
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IDirectListings.ListingParameters",
          "components": [
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "outputs": [
        { "name": "id", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "getAllListings",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct IDirectListings.Listing[]",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAllValidListings",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct IDirectListings.Listing[]",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getApprovedBuyer",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "buyer", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IDirectListings.Listing",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListingType",
      "inputs": [
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ],
      "outputs": [
        { "name": "", "type": "uint128", "internalType": "uint128" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getPlatformFee",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" },
        { "name": "_price", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "fee", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "performUpkeep",
      "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "removeApprovedBuyerForListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IDirectListings.UpdateListingParameters",
          "components": [
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateListingPlan",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "event",
      "name": "BuyerApprovedForListing",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "buyer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BuyerRemovedForListing",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CancelledListing",
      "inputs": [
        {
          "name": "listingCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CurrencyApprovedForListing",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pricePerToken",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ListingPlanUpdated",
      "inputs": [
        {
          "name": "endTime",
          "type": "uint128",
          "indexed": false,
          "internalType": "uint128"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ListingUpdated",
      "inputs": [
        {
          "name": "currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pricePerToken",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewListingCreated",
      "inputs": [
        {
          "name": "listingCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "assetContract",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listing",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IDirectListings.Listing",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewSale",
      "inputs": [
        {
          "name": "listingCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "assetContract",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "buyer",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "totalPricePaid",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CurrencyTransferLibMismatchedValue",
      "inputs": [
        { "name": "expected", "type": "uint256", "internalType": "uint256" },
        { "name": "actual", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "SafeERC20FailedOperation",
      "inputs": [
        { "name": "token", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_BuyerNotApproved",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_CanOnlyApproveABuyer",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_CanOnlyRemoveApprovedBuyer",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_CannotApproveBuyerForListing",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_InsufficientFunds",
      "inputs": [
        { "name": "_tokenPrice", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidAccessToCall",
      "inputs": [
        { "name": "_sender", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "__DirectListing_InvalidAddress", "inputs": [] },
    {
      "type": "error",
      "name": "__DirectListing_InvalidAssetContract",
      "inputs": [
        {
          "name": "_assetContract",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidEndTime",
      "inputs": [
        { "name": "_endTime", "type": "uint128", "internalType": "uint128" }
      ]
    },
    { "type": "error", "name": "__DirectListing_InvalidId", "inputs": [] },
    {
      "type": "error",
      "name": "__DirectListing_InvalidListerRequirements",
      "inputs": [
        {
          "name": "_assetContract",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_tokenType",
          "type": "uint8",
          "internalType": "enum IDirectListings.TokenType"
        },
        { "name": "_tokenId", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidListingCurrency",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidListingDuration",
      "inputs": [
        { "name": "_duration", "type": "uint128", "internalType": "uint128" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidRequirementToCompleteASale",
      "inputs": [
        { "name": "_buyFor", "type": "address", "internalType": "address" },
        {
          "name": "_isMarketStillApproved",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "_listingStatus",
          "type": "uint8",
          "internalType": "enum IDirectListings.Status"
        }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAuthorizedToApproveBuyerForListing",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAuthorizedToCancel",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAuthorizedToRemoveBuyerForListing",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAuthorizedToUpdate",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotBetweenSaleWindow",
      "inputs": []
    },
    { "type": "error", "name": "__DirectListing_TransferFailed", "inputs": [] },
    { "type": "error", "name": "__DirectListings_NoListingFound", "inputs": [] },

      {
      "type": "constructor",
      "inputs": [
        {
          "name": "_marketPlaceParams",
          "type": "tuple",
          "internalType": "struct MarketplaceRouter.MarketPlaceParams",
          "components": [
            {
              "name": "extensions",
              "type": "tuple[]",
              "internalType": "struct IExtension.Extension[]",
              "components": [
                {
                  "name": "metadata",
                  "type": "tuple",
                  "internalType": "struct IExtension.ExtensionMetadata",
                  "components": [
                    {
                      "name": "name",
                      "type": "string",
                      "internalType": "string"
                    },
                    {
                      "name": "metadataURI",
                      "type": "string",
                      "internalType": "string"
                    },
                    {
                      "name": "implementation",
                      "type": "address",
                      "internalType": "address"
                    }
                  ]
                },
                {
                  "name": "functions",
                  "type": "tuple[]",
                  "internalType": "struct IExtension.ExtensionFunction[]",
                  "components": [
                    {
                      "name": "functionSelector",
                      "type": "bytes4",
                      "internalType": "bytes4"
                    },
                    {
                      "name": "functionSignature",
                      "type": "string",
                      "internalType": "string"
                    }
                  ]
                }
              ]
            },
            {
              "name": "royaltyEngineAddress",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "stateMutability": "nonpayable"
    },
    { "type": "fallback", "stateMutability": "payable" },
    { "type": "receive", "stateMutability": "payable" },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_disableFunctionInExtension",
      "inputs": [
        {
          "name": "_extensionName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addExtension",
      "inputs": [
        {
          "name": "_extension",
          "type": "tuple",
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "contractType",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "contractVersion",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "defaultExtensions",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "disableFunctionInExtension",
      "inputs": [
        {
          "name": "_extensionName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "enableFunctionInExtension",
      "inputs": [
        {
          "name": "_extensionName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_function",
          "type": "tuple",
          "internalType": "struct IExtension.ExtensionFunction",
          "components": [
            {
              "name": "functionSelector",
              "type": "bytes4",
              "internalType": "bytes4"
            },
            {
              "name": "functionSignature",
              "type": "string",
              "internalType": "string"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllCurrency",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "address[10]", "internalType": "address[10]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAllExtensions",
      "inputs": [],
      "outputs": [
        {
          "name": "allExtensions",
          "type": "tuple[]",
          "internalType": "struct IExtension.Extension[]",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getExtension",
      "inputs": [
        { "name": "extensionName", "type": "string", "internalType": "string" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getImplementationForFunction",
      "inputs": [
        {
          "name": "_functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getIsApprovedCurrency",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "isApprovedCurrency", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListingTypeInfo",
      "inputs": [
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ],
      "outputs": [
        { "name": "", "type": "uint128", "internalType": "uint128" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getMetadataForFunction",
      "inputs": [
        {
          "name": "functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IExtension.ExtensionMetadata",
          "components": [
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "metadataURI",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "implementation",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleMember",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "index", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "member", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleMemberCount",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [
        { "name": "count", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoyalty",
      "inputs": [
        {
          "name": "tokenAddress",
          "type": "address",
          "internalType": "address"
        },
        { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "recipients",
          "type": "address[]",
          "internalType": "address payable[]"
        },
        { "name": "amounts", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getRoyaltyEngineAddress",
      "inputs": [],
      "outputs": [
        {
          "name": "royaltyEngineAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "grantRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "hasRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hasRoleWithSwitch",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "initialize",
      "inputs": [
        {
          "name": "_extension_manager_address",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_trustedForwarders",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        },
        { "name": "_duration", "type": "uint128", "internalType": "uint128" },
        { "name": "_price", "type": "uint256", "internalType": "uint256" },
        { "name": "_currency", "type": "address", "internalType": "address" },
        { "name": "_priceFeed", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "isTrustedForwarder",
      "inputs": [
        { "name": "forwarder", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "multicall",
      "inputs": [
        { "name": "data", "type": "bytes[]", "internalType": "bytes[]" }
      ],
      "outputs": [
        { "name": "results", "type": "bytes[]", "internalType": "bytes[]" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "onERC1155BatchReceived",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" },
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" },
        { "name": "", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "onERC1155Received",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "onERC721Received",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "removeApprovedCurrency",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "removeExtension",
      "inputs": [
        { "name": "_extensionName", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "renounceRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "replaceExtension",
      "inputs": [
        {
          "name": "_extension",
          "type": "tuple",
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "revokeRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setApprovedCurrency",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" },
        { "name": "_priceFeed", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setListingPlan",
      "inputs": [
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        },
        { "name": "_duration", "type": "uint128", "internalType": "uint128" },
        { "name": "_price", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setRoyaltyEngine",
      "inputs": [
        {
          "name": "_royaltyEngineAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        { "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "ExtensionAdded",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "implementation",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "extension",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ExtensionRemoved",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "extension",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ExtensionReplaced",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "implementation",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "extension",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "FunctionDisabled",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "functionSelector",
          "type": "bytes4",
          "indexed": true,
          "internalType": "bytes4"
        },
        {
          "name": "extMetadata",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.ExtensionMetadata",
          "components": [
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "metadataURI",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "implementation",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "FunctionEnabled",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "functionSelector",
          "type": "bytes4",
          "indexed": true,
          "internalType": "bytes4"
        },
        {
          "name": "extFunction",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.ExtensionFunction",
          "components": [
            {
              "name": "functionSelector",
              "type": "bytes4",
              "internalType": "bytes4"
            },
            {
              "name": "functionSignature",
              "type": "string",
              "internalType": "string"
            }
          ]
        },
        {
          "name": "extMetadata",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.ExtensionMetadata",
          "components": [
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "metadataURI",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "implementation",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Initialized",
      "inputs": [
        {
          "name": "version",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "previousAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "newAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleGranted",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleRevoked",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoyaltyEngineUpdated",
      "inputs": [
        {
          "name": "previousAddress",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newAddress",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "__ApprovedCurrency_CurrencyRemoved",
      "inputs": [
        {
          "name": "_currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "__ApprovedCurrency_CurrencySet",
      "inputs": [
        {
          "name": "_currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "_priceFeed",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "__Router_ListingPlanSet",
      "inputs": [
        {
          "name": "_duration",
          "type": "uint128",
          "indexed": false,
          "internalType": "uint128"
        },
        {
          "name": "_price",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "InvalidCodeAtRange",
      "inputs": [
        { "name": "_size", "type": "uint256", "internalType": "uint256" },
        { "name": "_start", "type": "uint256", "internalType": "uint256" },
        { "name": "_end", "type": "uint256", "internalType": "uint256" }
      ]
    },
    { "type": "error", "name": "WriteError", "inputs": [] },
    {
      "type": "error",
      "name": "__ApprovedCurrency_CurrencyNotApproved",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__Router_InvalidListingType",
      "inputs": [
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ]
    },
    { "type": "error", "name": "__Router_UnauthorizedToCall", "inputs": [] },
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_nativeTokenWrapper",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "_msgData",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_msgSender",
      "inputs": [],
      "outputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "acceptOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "cancelOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllOffers",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct IOffer.Offer[]",
          "components": [
            {
              "name": "totalPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expirationTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "offeror", "type": "address", "internalType": "address" },
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IOffer.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IOffer.Offer",
          "components": [
            {
              "name": "totalPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expirationTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "offeror", "type": "address", "internalType": "address" },
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IOffer.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "makeOffer",
      "inputs": [
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IOffer.OfferParams",
          "components": [
            {
              "name": "totalPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "duration", "type": "uint128", "internalType": "uint128" }
          ]
        },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "offerId", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "rejectOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "AcceptedOffer",
      "inputs": [
        {
          "name": "offeror",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "totalPricePaid",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "offerId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CancelledOffer",
      "inputs": [
        {
          "name": "offeror",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "offerId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewOffer",
      "inputs": [
        {
          "name": "totalPrice",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "expirationTime",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "id",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RejectedOffer",
      "inputs": [
        {
          "name": "lister",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "offerId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CurrencyTransferLibMismatchedValue",
      "inputs": [
        { "name": "expected", "type": "uint256", "internalType": "uint256" },
        { "name": "actual", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InsufficientFunds",
      "inputs": [
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ]
    },
    { "type": "error", "name": "__Offer_InvalidListingId", "inputs": [] },
    { "type": "error", "name": "__Offer_MarketPlaceUnapproved", "inputs": [] },
    { "type": "error", "name": "__Offer_UnauthorizedToCall", "inputs": [] },
      {
      "type": "constructor",
      "inputs": [
        {
          "name": "_nativeTokenWrapper",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "_msgData",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_msgSender",
      "inputs": [],
      "outputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "bidInAuction",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" },
        { "name": "bidAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "cancelAuction",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "collectAuctionPayout",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "collectAuctionTokens",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createAuction",
      "inputs": [
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IAuction.AuctionParameters",
          "components": [
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            }
          ]
        }
      ],
      "outputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllAuctions",
      "inputs": [],
      "outputs": [
        {
          "name": "auctions",
          "type": "tuple[]",
          "internalType": "struct IAuction.Auction[]",
          "components": [
            {
              "name": "auctionId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "auctionCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IAuction.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IAuction.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAuction",
      "inputs": [
        { "name": "_auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "auction",
          "type": "tuple",
          "internalType": "struct IAuction.Auction",
          "components": [
            {
              "name": "auctionId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "auctionCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IAuction.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IAuction.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWinningBid",
      "inputs": [
        { "name": "_auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "bidder", "type": "address", "internalType": "address" },
        { "name": "currency", "type": "address", "internalType": "address" },
        { "name": "bidAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isAuctionExpired",
      "inputs": [
        { "name": "_auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isNewWinningBid",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" },
        { "name": "bidAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "isWinningBid", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "updateAuction",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IAuction.UpdateAuctionParameters",
          "components": [
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "AuctionClosed",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "closer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "bidAmount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AuctionPaidOut",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "receipient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AuctionTokenPaidOut",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "receipient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AuctionUpdated",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CancelledAuction",
      "inputs": [
        {
          "name": "auctionCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewAuction",
      "inputs": [
        {
          "name": "auctionCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "assetContract",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewBid",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "bidder",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "bidAmount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CurrencyTransferLibMismatchedValue",
      "inputs": [
        { "name": "expected", "type": "uint256", "internalType": "uint256" },
        { "name": "actual", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__Auction_IncorrectBidAmount",
      "inputs": [
        { "name": "bidAmount", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__Auction_InvalidAccessToCall",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__Auction_InvalidAssetContract",
      "inputs": [
        {
          "name": "assetContract",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "__Auction_InvalidAuctionCurrency",
      "inputs": [
        { "name": "currency", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "__Auction_InvalidAuctionState", "inputs": [] },
    { "type": "error", "name": "__Auction_InvalidBidAmount", "inputs": [] },
    { "type": "error", "name": "__Auction_InvalidBidBuffer", "inputs": [] },
    { "type": "error", "name": "__Auction_InvalidBidTime", "inputs": [] },
    {
      "type": "error",
      "name": "__Auction_InvalidBuyoutBidAmount",
      "inputs": []
    },
    { "type": "error", "name": "__Auction_InvalidDuration", "inputs": [] },
    { "type": "error", "name": "__Auction_InvalidTime", "inputs": [] },
    { "type": "error", "name": "__Auction_NoBidYet", "inputs": [] },
    { "type": "error", "name": "__Auction_TransferFailed", "inputs": [] },
    { "type": "error", "name": "__Auction_UnAuthorizedToCall", "inputs": [] }
    
      

  ],
    });

// https://subgraph.satsuma-prod.com/peters-team--628380/premium-amoy/version/v0.0.1-new-version/api
//https://subgraph.satsuma-prod.com/peters-team--628380/data/version/v0.0.1-new-version/api
// https://subgraph.satsuma-prod.com/peters-team--628380/premium-amoy/version/v0.0.1-new-version/api
//   0x31cD21FdA2EF3522a5B7846b358A6472BB092183

//0x4Ab6893C23d7c6cf9d626AE0a432D821937f80c5

// [⠊] Compiling...
// No files changed, compilation skipped
// EIP-3855 is not supported in one or more of the RPCs used.
// Unsupported Chain IDs: 80002.
// Contracts deployed with a Solidity version equal or higher than 0.8.20 might not work properly.
// For more information, please see https://eips.ethereum.org/EIPS/eip-3855
// Script ran successfully.

// == Return ==
// 0: address payable 0x1e2a1F8AD39197B3dc97Fa7D58BB181C354B6A57
// 1: address 0xfc3c3F0d793EaC242051C98fc0DC9be60f86d964

// ## Setting up 1 EVM. 17207018

// ==========================

// Chain 80002

// Estimated gas price: 29.996875022 gwei

// Estimated total gas used for script: 30951027

// Estimated amount required: 0.928434088721547594 ETH

// ==========================

// ##### amoy
// ✅  [Success]Hash: 0x9b9995a2816ddb3b711862b058e4dd4ef837e8dedffadd22c45a271e3c62648b
// Contract Address: 0xc459CD557F18f05AA38142bc9fD72a7ba9F2D478
// Block: 16660908
// Paid: 0.01546285000927771 ETH (618514 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0xef3c4f2c98fd1e7d5552f201f730e50e5598d5f4208ad8bf05db532890964ab7
// Contract Address: 0xC2AdA5252eBE6b9DEc29353de1Dd202300363c89
// Block: 16660910
// Paid: 0.01546285000927771 ETH (618514 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0xc67d84669228ded5761b88e0bc87e52475a85ae503007a808b76033bbd6c3363
// Block: 16660910
// Paid: 0.001889325001133595 ETH (75573 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0xa3023c9f4558194ed4f844c7f246a1ac68102cac2987bc7cf3750824d22f139d
// Contract Address: 0x92dC98569DBF627a7D41822C72a8B2Ba7E30E03A
// Block: 16660910
// Paid: 0.10475670006285402 ETH (4190268 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0xabdf71bde27caed06b475d53ddadfc29e8c745cfbbd8069c6b54cd4c69d3b632
// Contract Address: 0x8645ce4E6772D2c6b24824FA8c921f24Bc79e7e0
// Block: 16660910
// Paid: 0.08205115004923069 ETH (3282046 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0x2bab77ad4bd6d39762de54f30a9db6700df5af06380b85b7c6f6f2281ace7cff
// Contract Address: 0x8bE097674Dc5F0D27fbE01436F479067DCf70794
// Block: 16660910
// Paid: 0.053209575031925745 ETH (2128383 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0x49f222c17f0c0c25ff1b94dbc331d1c486056c1aa84e1466f3174ed3bf1ffe85
// Block: 16660910
// Paid: 0.00188810000113286 ETH (75524 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0xf9eafd068d1cb5b90cb832c8ec89ca57ee8e871acb78d150fd4e9d9324c2e73e
// Contract Address: 0x1e2a1F8AD39197B3dc97Fa7D58BB181C354B6A57
// Block: 16660910
// Paid: 0.127546475076527885 ETH (5101859 gas * 25.000000015 gwei)


// ##### amoy
// ✅  [Success]Hash: 0x0a32a9d4382cebb6f1b68e90f800c0b1648faeb7b3b1fba90d1f88e5165fb28a
// Contract Address: 0x56184d68808771f1e3380cd94f3200a2b1F56dBC
// Block: 16660910
// Paid: 0.192853425115712055 ETH (7714137 gas * 25.000000015 gwei)

// ✅ Sequence #1 on amoy | Total Paid: 0.59512045035707227 ETH (23804818 gas * avg 25.000000015 gwei)
                                                                                                            

// ==========================

// ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.
// ##
// Start verification for (7) contracts
// Start verifying contract `0xc459CD557F18f05AA38142bc9fD72a7ba9F2D478` deployed on amoy

// Submitting verification for [test/mocks/WMATICMock.sol:WMATICMock] 0xc459CD557F18f05AA38142bc9fD72a7ba9F2D47
// 8.                                                                                                          Submitted contract for verification:
//         Response: `OK`
//         GUID: `zi4eggb9r8iwsayzcldhr7yg1bsqewh1nlnd3zubn1prpaxudr`
//         URL: https://amoy.polygonscan.com/address/0xc459cd557f18f05aa38142bc9fd72a7ba9f2d478
// Contract verification status:
// Response: `NOTOK`
// Details: `Already Verified`
// Contract source code already verified
// Start verifying contract `0x92dC98569DBF627a7D41822C72a8B2Ba7E30E03A` deployed on amoy

// Submitting verification for [src/extensions/directListings/DirectListingsLogic.sol:DirectListingsLogic] 0x92
// dC98569DBF627a7D41822C72a8B2Ba7E30E03A.                                                                     Submitted contract for verification:
//         Response: `OK`
//         GUID: `tfsndtjnd6nbvnrhg6mkxdh2uqh8hseqmn238szvufwnmb6sr7`
//         URL:  
// Contract verification status:
// Response: `NOTOK`
// Details: `Pending in queue`
// Contract verification status:
// Response: `OK`
// Details: `Pass - Verified`
// Contract successfully verified
// Start verifying contract `0x8bE097674Dc5F0D27fbE01436F479067DCf70794` deployed on amoy

// Submitting verification for [src/extensions/offer/OfferLogic.sol:OfferLogic] 0x8bE097674Dc5F0D27fbE01436F479
// 067DCf70794.                                                                                                Submitted contract for verification:
//         Response: `OK`
//         GUID: `ts7supnqtnbc5bsqqykpafysghhuejjrhbydiuucfhykjsakwp`
//         URL: https://amoy.polygonscan.com/address/0x8be097674dc5f0d27fbe01436f479067dcf70794
// Contract verification status:
// Response: `OK`
// Details: `Pass - Verified`
// Contract successfully verified
// Start verifying contract `0x8645ce4E6772D2c6b24824FA8c921f24Bc79e7e0` deployed on amoy

// Submitting verification for [src/extensions/auction/AuctionLogic.sol:AuctionLogic] 0x8645ce4E6772D2c6b24824F
// A8c921f24Bc79e7e0.                                                                                          Submitted contract for verification:
//         Response: `OK`
//         GUID: `my73wetfbc8tbjwkuued7w58isgm8qhwyrxljfeukdir5cgfga`
//         URL: https://amoy.polygonscan.com/address/0x8645ce4e6772d2c6b24824fa8c921f24bc79e7e0
// Contract verification status:
// Response: `NOTOK`
// Details: `Pending in queue`
// Contract verification status:
// Response: `OK`
// Details: `Pass - Verified`
// Contract successfully verified
// Start verifying contract `0xC2AdA5252eBE6b9DEc29353de1Dd202300363c89` deployed on amoy

// Submitting verification for [test/mocks/WMATICMock.sol:WMATICMock] 0xC2AdA5252eBE6b9DEc29353de1Dd202300363c8
// 9.                                                                                                          Submitted contract for verification:
//         Response: `OK`
//         GUID: `xg7jhhuyj5p6ycubwkmi1ffjtucd4vb1xzs2qfzfilkave67xt`
//         URL: https://amoy.polygonscan.com/address/0xc2ada5252ebe6b9dec29353de1dd202300363c89
// Contract verification status:
// Response: `NOTOK`
// Details: `Already Verified`
// Contract source code already verified
// Start verifying contract `0x56184d68808771f1e3380cd94f3200a2b1F56dBC` deployed on amoy

// Submitting verification for [src/MarketplaceRouter.sol:MarketplaceRouter] 0x56184d68808771f1e3380cd94f3200a2
// b1F56dBC.                                                                                                   Submitted contract for verification:
//         Response: `OK`
//         GUID: `iwuyzi2nqp6fvpunazktmfb7rfvween5ganfyyzjztqka3rxf9`
//         URL: https://amoy.polygonscan.com/address/0x56184d68808771f1e3380cd94f3200a2b1f56dbc
// Contract verification status:
// Response: `NOTOK`
// Details: `Pending in queue`
// Contract verification status:
// Response: `OK`
// Details: `Pass - Verified`
// Contract successfully verified
// Start verifying contract `0x1e2a1F8AD39197B3dc97Fa7D58BB181C354B6A57` deployed on amoy

// Submitting verification for [lib/contracts/contracts/infra/TWProxy.sol:TWProxy] 0x1e2a1F8AD39197B3dc97Fa7D58
// BB181C354B6A57.                                                                                             Submitted contract for verification:
//         Response: `OK`
//         GUID: `e7m5yukm8jnx9bs1zk1fqbz2ttrrxnqqf51gicdkwbrgwujdja`
//         URL: https://amoy.polygonscan.com/address/0x1e2a1f8ad39197b3dc97fa7d58bb181c354b6a57
// Contract verification status:
// Response: `NOTOK`
// Details: `Pending in queue`
// Contract verification status:
// Response: `NOTOK`
// Details: `Already Verified`
// Contract source code already verified
// All (7) contracts were verified!

// Transactions saved to: /home/ni9eball/SMARTCONTRACT/NFTMARKETPLACE/broadcast/DeployMarketPlace.s.sol/80002/r
// un-latest.json                                                                                              
// Sensitive values saved to: /home/ni9eball/SMARTCONTRACT/NFTMARKETPLACE/cache/DeployMarketPlace.s.sol/80002/r
// un-latest.json                                                                                              


//  Upload subgraph to IPFS

// Build completed: QmY1UkFsmk43QDx8piHZVc8uCcDHd8nTN9KigtB3vbcVQq

// Deployed to https://thegraph.com/studio/subgraph/premium-amoy

// Subgraph endpoints:
// Queries (HTTP):     https://api.studio.thegraph.com/query/100802/premium-amoy/v0.0.1