export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AboveMax",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "BelowMin",
    type: "error",
  },
  {
    inputs: [],
    name: "BlockOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "DoesntExist",
    type: "error",
  },
  {
    inputs: [],
    name: "InitError",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initializationContractAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "InitializationFunctionReverted",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAddresses",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCollateralIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFacetCutAction",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInputLength",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "NotContract",
    type: "error",
  },
  {
    inputs: [],
    name: "NotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "Overflow",
    type: "error",
  },
  {
    inputs: [],
    name: "Paused",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongAccess",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongLength",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongOrderType",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongParams",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongTradeType",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroValue",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IAddressStore.Role",
        name: "role",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "access",
        type: "bool",
      },
    ],
    name: "AccessControlUpdated",
    type: "event",
    signature:
      "0x8d7fdec37f50c07219a6a0859420936836eb9254bf412035e3acede18b8b093d",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "gns",
            type: "address",
          },
          {
            internalType: "address",
            name: "gnsStaking",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct IAddressStore.Addresses",
        name: "addresses",
        type: "tuple",
      },
    ],
    name: "AddressesUpdated",
    type: "event",
    signature:
      "0xe4f1f9461410dada4f4b49a4b363bdf35e6069fb5a0cea4b1147c32affbd954a",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondStorage.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        indexed: false,
        internalType: "struct IDiamondStorage.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "DiamondCut",
    type: "event",
    signature:
      "0x8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb673",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
    signature:
      "0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondStorage.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondStorage.FacetCut[]",
        name: "_faceCut",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "diamondCut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x1f931c1c",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_functionSelector",
        type: "bytes4",
      },
    ],
    name: "facetAddress",
    outputs: [
      {
        internalType: "address",
        name: "facetAddress_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xcdffacc6",
  },
  {
    inputs: [],
    name: "facetAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "facetAddresses_",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x52ef6b2c",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_facet",
        type: "address",
      },
    ],
    name: "facetFunctionSelectors",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "facetFunctionSelectors_",
        type: "bytes4[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xadfca15e",
  },
  {
    inputs: [],
    name: "facets",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IGNSDiamondLoupe.Facet[]",
        name: "facets_",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x7a0ed627",
  },
  {
    inputs: [],
    name: "getAddresses",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "gns",
            type: "address",
          },
          {
            internalType: "address",
            name: "gnsStaking",
            type: "address",
          },
        ],
        internalType: "struct IAddressStore.Addresses",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa39fac12",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "enum IAddressStore.Role",
        name: "_role",
        type: "uint8",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x95a8c58d",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rolesManager",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc4d66de8",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_accounts",
        type: "address[]",
      },
      {
        internalType: "enum IAddressStore.Role[]",
        name: "_roles",
        type: "uint8[]",
      },
      {
        internalType: "bool[]",
        name: "_values",
        type: "bool[]",
      },
    ],
    name: "setRoles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x101e6503",
  },
  {
    inputs: [],
    name: "EndLeverageTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "EndLiqThresholdTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "FeeNotListed",
    type: "error",
  },
  {
    inputs: [],
    name: "GroupNotListed",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxLiqSpreadPTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "PairAlreadyListed",
    type: "error",
  },
  {
    inputs: [],
    name: "PairNotListed",
    type: "error",
  },
  {
    inputs: [],
    name: "StartLeverageTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "StartLiqThresholdTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongFees",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongLeverages",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongLiqParamsLeverages",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongLiqParamsThresholds",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "FeeAdded",
    type: "event",
    signature:
      "0x482049823c85e038e099fe4f2b901487c4800def71c9a3f5bae2de8381ec54f6",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "FeeUpdated",
    type: "event",
    signature:
      "0x8c4d35e54a3f2ef1134138fd8ea3daee6a3c89e10d2665996babdf70261e2c76",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "GroupAdded",
    type: "event",
    signature:
      "0xaf17de8e82beccc440012117a600dc37e26925225d0f1ee192fc107eb3dcbca4",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        indexed: false,
        internalType: "struct IPairsStorage.GroupLiquidationParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "GroupLiquidationParamsUpdated",
    type: "event",
    signature:
      "0x7e8e79d406657a52635b68c3f3ad15d2526e71077df1b40afad9d323eacbabfc",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "GroupUpdated",
    type: "event",
    signature:
      "0xcfde8f228364c70f12cbbac5a88fc91ceca76dd750ac93364991a333b34afb8e",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "from",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "to",
        type: "string",
      },
    ],
    name: "PairAdded",
    type: "event",
    signature:
      "0x3adfd40f2b74073df2a84238acdb7f460565a557b3cc13bddc8833289bf38e09",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxLeverage",
        type: "uint256",
      },
    ],
    name: "PairCustomMaxLeverageUpdated",
    type: "event",
    signature:
      "0x5d6c9d6dd6c84fa315e799a455ccb71230e5b88e171c48c4853425ce044e9bce",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "PairUpdated",
    type: "event",
    signature:
      "0x123a1b961ae93e7acda9790b318237b175b45ac09277cd3614305d8baa3f1953",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "openFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "oracleFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "triggerOrderFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPositionSizeUsd",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Fee[]",
        name: "_fees",
        type: "tuple[]",
      },
    ],
    name: "addFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x0c00b94a",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "job",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "minLeverage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxLeverage",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Group[]",
        name: "_groups",
        type: "tuple[]",
      },
    ],
    name: "addGroups",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x60283cba",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "from",
            type: "string",
          },
          {
            internalType: "string",
            name: "to",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "feed1",
                type: "address",
              },
              {
                internalType: "address",
                name: "feed2",
                type: "address",
              },
              {
                internalType: "enum IPairsStorage.FeedCalculation",
                name: "feedCalculation",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "maxDeviationP",
                type: "uint256",
              },
            ],
            internalType: "struct IPairsStorage.Feed",
            name: "feed",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "groupIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeIndex",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Pair[]",
        name: "_pairs",
        type: "tuple[]",
      },
    ],
    name: "addPairs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xdb7c3f9d",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "fees",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "openFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "oracleFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "triggerOrderFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPositionSizeUsd",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Fee",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4acc79ed",
  },
  {
    inputs: [],
    name: "feesCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x658de48a",
  },
  {
    inputs: [],
    name: "getAllPairsRestrictedMaxLeverage",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x678b3fb0",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_groupIndex",
        type: "uint256",
      },
    ],
    name: "getGroupLiquidationParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        internalType: "struct IPairsStorage.GroupLiquidationParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x3572929c",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "getPairLiquidationParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        internalType: "struct IPairsStorage.GroupLiquidationParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x6633ced6",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "groups",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "job",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "minLeverage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxLeverage",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Group",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x96324bd4",
  },
  {
    inputs: [],
    name: "groupsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x885e2750",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        internalType: "struct IPairsStorage.GroupLiquidationParams[]",
        name: "_groupLiquidationParams",
        type: "tuple[]",
      },
    ],
    name: "initializeGroupLiquidationParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x85d4390e",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "isPairIndexListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x281b7ead",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_from",
        type: "string",
      },
      {
        internalType: "string",
        name: "_to",
        type: "string",
      },
    ],
    name: "isPairListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x1628bfeb",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairCloseFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x836a341a",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairCustomMaxLeverage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x24a96865",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairJob",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x302f81fc",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairMaxLeverage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x281b693c",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairMinFeeUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x8078bfbe",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairMinLeverage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x59a992d0",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairMinPositionSizeUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x5e26ff4e",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairOpenFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x8251135b",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairOracleFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xf7acbabd",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairSpreadP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa1d54e9b",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "pairTriggerOrderFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xe74aff72",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "pairs",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "from",
            type: "string",
          },
          {
            internalType: "string",
            name: "to",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "feed1",
                type: "address",
              },
              {
                internalType: "address",
                name: "feed2",
                type: "address",
              },
              {
                internalType: "enum IPairsStorage.FeedCalculation",
                name: "feedCalculation",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "maxDeviationP",
                type: "uint256",
              },
            ],
            internalType: "struct IPairsStorage.Feed",
            name: "feed",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "groupIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeIndex",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Pair",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xb91ac788",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "pairsBackend",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "from",
            type: "string",
          },
          {
            internalType: "string",
            name: "to",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "feed1",
                type: "address",
              },
              {
                internalType: "address",
                name: "feed2",
                type: "address",
              },
              {
                internalType: "enum IPairsStorage.FeedCalculation",
                name: "feedCalculation",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "maxDeviationP",
                type: "uint256",
              },
            ],
            internalType: "struct IPairsStorage.Feed",
            name: "feed",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "groupIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeIndex",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Pair",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "job",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "minLeverage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxLeverage",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Group",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "openFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "oracleFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "triggerOrderFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPositionSizeUsd",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Fee",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x9567dccf",
  },
  {
    inputs: [],
    name: "pairsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xb81b2b71",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_groupIndex",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        internalType: "struct IPairsStorage.GroupLiquidationParams",
        name: "_params",
        type: "tuple",
      },
    ],
    name: "setGroupLiquidationParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xd0cb753e",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_indices",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
    ],
    name: "setPairCustomMaxLeverages",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xd79261fd",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "openFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "oracleFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "triggerOrderFeeP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPositionSizeUsd",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Fee[]",
        name: "_fees",
        type: "tuple[]",
      },
    ],
    name: "updateFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xe57f6759",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "job",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "minLeverage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxLeverage",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Group[]",
        name: "_groups",
        type: "tuple[]",
      },
    ],
    name: "updateGroups",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x11d79ef5",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_pairIndices",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "string",
            name: "from",
            type: "string",
          },
          {
            internalType: "string",
            name: "to",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "feed1",
                type: "address",
              },
              {
                internalType: "address",
                name: "feed2",
                type: "address",
              },
              {
                internalType: "enum IPairsStorage.FeedCalculation",
                name: "feedCalculation",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "maxDeviationP",
                type: "uint256",
              },
            ],
            internalType: "struct IPairsStorage.Feed",
            name: "feed",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "groupIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeIndex",
            type: "uint256",
          },
        ],
        internalType: "struct IPairsStorage.Pair[]",
        name: "_pairs",
        type: "tuple[]",
      },
    ],
    name: "updatePairs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x10efa5d5",
  },
  {
    inputs: [],
    name: "AllyNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyActive",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyInactive",
    type: "error",
  },
  {
    inputs: [],
    name: "NoPendingRewards",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ally",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "volumeUsd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountGns",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountValueUsd",
        type: "uint256",
      },
    ],
    name: "AllyRewardDistributed",
    type: "event",
    signature:
      "0x0d54fedb563328d37f00fe5ba0bf7689519f8cf02318562adfe7b4bfab8cf4b4",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ally",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountGns",
        type: "uint256",
      },
    ],
    name: "AllyRewardsClaimed",
    type: "event",
    signature:
      "0x3dfe9be199655709d01d635bf441264a809a090c98ed7aae9abdc85f7dcbc09d",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ally",
        type: "address",
      },
    ],
    name: "AllyUnwhitelisted",
    type: "event",
    signature:
      "0x6900afc1a924abca16a7f560e2dac3d71008c1cd1d88de8a85b6e4267116d186",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ally",
        type: "address",
      },
    ],
    name: "AllyWhitelisted",
    type: "event",
    signature:
      "0x80495287b7fdd5e00b7c8c1eb065c5b63474d11ffb062cc82c13da77dda8424d",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "ReferrerRegistered",
    type: "event",
    signature:
      "0x0e67f4bbcd5c51b7365ca2dd861dc8094e393ca60de2ceae9d831761a839e92a",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "volumeUsd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountGns",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountValueUsd",
        type: "uint256",
      },
    ],
    name: "ReferrerRewardDistributed",
    type: "event",
    signature:
      "0x74e9754b45c636e199e3d7bb764fae1a9acce47a984d10dcfd74849ec4babc4f",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountGns",
        type: "uint256",
      },
    ],
    name: "ReferrerRewardsClaimed",
    type: "event",
    signature:
      "0x25deb48f8299e9863bda34f0d343d51341ac7ac30bf63dbeb2e8212bc4a20bf1",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "ReferrerUnwhitelisted",
    type: "event",
    signature:
      "0x6dd169357c2e2b04fd13a8807a11892b88875b7c70eeb73c3b6642c58516f0db",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "ally",
        type: "address",
      },
    ],
    name: "ReferrerWhitelisted",
    type: "event",
    signature:
      "0x15ad1d28b052a6cc2dd1d34d9e06a1847055d520e2163017e6e8aad6431b7f6a",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "UpdatedAllyFeeP",
    type: "event",
    signature:
      "0x2f33e68d48a82acaa58e3dcb12a4c7738cdfe7041d35f0e29ec8c39b780b370c",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "UpdatedOpenFeeP",
    type: "event",
    signature:
      "0x4dec17ad9a229f707b7c2fb9531cd3b9c548f9eca80c03457ca38a0bb1df35fe",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "UpdatedStartReferrerFeeP",
    type: "event",
    signature:
      "0xb85b70acaeb40f1a2351367c48842ee0ea24ec05d411d99d80bf7a020c0dbb0f",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "UpdatedTargetVolumeUsd",
    type: "event",
    signature:
      "0x7e6042545b314fbe2e138616211d5c38934823f783b83a140ea84f0eb2ae115d",
  },
  {
    inputs: [],
    name: "claimAllyRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xee6cf884",
  },
  {
    inputs: [],
    name: "claimReferrerRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x65cbd307",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_volumeUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pairOpenFeeP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_gnsPriceUsd",
        type: "uint256",
      },
    ],
    name: "distributeReferralReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xfa3c8dbf",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ally",
        type: "address",
      },
    ],
    name: "getAllyDetails",
    outputs: [
      {
        components: [
          {
            internalType: "address[]",
            name: "referrersReferred",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "volumeReferredUsd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pendingRewardsGns",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRewardsGns",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRewardsValueUsd",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct IReferrals.AllyDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x92e67406",
  },
  {
    inputs: [],
    name: "getReferralsAllyFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x97436b5f",
  },
  {
    inputs: [],
    name: "getReferralsOpenFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x06350917",
  },
  {
    inputs: [],
    name: "getReferralsStartReferrerFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x843b9e5d",
  },
  {
    inputs: [],
    name: "getReferralsTargetVolumeUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x71159fd1",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_referrer",
        type: "address",
      },
    ],
    name: "getReferrerDetails",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "ally",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "tradersReferred",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "volumeReferredUsd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pendingRewardsGns",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRewardsGns",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRewardsValueUsd",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct IReferrals.ReferrerDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xcbe0f32e",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairOpenFeeP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_volumeReferredUsd",
        type: "uint256",
      },
    ],
    name: "getReferrerFeeP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4e583b31",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ally",
        type: "address",
      },
    ],
    name: "getReferrersReferred",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa73a3e35",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getTraderActiveReferrer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x036787e5",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getTraderLastReferrer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x46dbf572",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_referrer",
        type: "address",
      },
    ],
    name: "getTradersReferred",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x32a7b732",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_allyFeeP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startReferrerFeeP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_openFeeP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_targetVolumeUsd",
        type: "uint256",
      },
    ],
    name: "initializeReferrals",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc8b0d710",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "address",
        name: "_referrer",
        type: "address",
      },
    ],
    name: "registerPotentialReferrer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x9b8ab684",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_allies",
        type: "address[]",
      },
    ],
    name: "unwhitelistAllies",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x3450191e",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_referrers",
        type: "address[]",
      },
    ],
    name: "unwhitelistReferrers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x92b2bbae",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "updateAllyFeeP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x97365b74",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "updateReferralsOpenFeeP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xdfed4fcb",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "updateReferralsTargetVolumeUsd",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x66ddd309",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "updateStartReferrerFeeP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x03e37464",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_allies",
        type: "address[]",
      },
    ],
    name: "whitelistAllies",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc72d02e3",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_referrers",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_allies",
        type: "address[]",
      },
    ],
    name: "whitelistReferrers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x507cd8de",
  },
  {
    inputs: [],
    name: "WrongFeeTier",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "feeTiersIndices",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "feeMultiplier",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "pointsThreshold",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct IFeeTiers.FeeTier[]",
        name: "feeTiers",
        type: "tuple[]",
      },
    ],
    name: "FeeTiersUpdated",
    type: "event",
    signature:
      "0xa6ec87cc1a516d9ebb5c03260f77d2bd8c22dc8d28d71e740b320fbd4d704131",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "groupIndices",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "groupVolumeMultipliers",
        type: "uint256[]",
      },
    ],
    name: "GroupVolumeMultipliersUpdated",
    type: "event",
    signature:
      "0xb173e04a52e3de8d79b981e4ffc87d49e6577ceab559ebf36a70bba02cc2569c",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "day",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint224",
        name: "points",
        type: "uint224",
      },
    ],
    name: "TraderDailyPointsIncreased",
    type: "event",
    signature:
      "0x4f6f49815b9e6682a4f6bc21ba0b5261e803cc5d56c97477a5dc75925fd74e68",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint32",
        name: "day",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "feeMultiplier",
        type: "uint32",
      },
    ],
    name: "TraderFeeMultiplierCached",
    type: "event",
    signature:
      "0x136cc4347dc65b38625089ea9df2874eda024554dc7d0a363036d6fa6d7e4c9e",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "day",
        type: "uint32",
      },
    ],
    name: "TraderInfoFirstUpdate",
    type: "event",
    signature:
      "0x8aa104927dea7fb70b6e5eb2e2891e3022714eea9e80c493fdabffce48b42393",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "lastDayUpdated",
            type: "uint32",
          },
          {
            internalType: "uint224",
            name: "trailingPoints",
            type: "uint224",
          },
        ],
        indexed: false,
        internalType: "struct IFeeTiers.TraderInfo",
        name: "traderInfo",
        type: "tuple",
      },
    ],
    name: "TraderInfoUpdated",
    type: "event",
    signature:
      "0x211bcdec669891da564d4d5bd35fa76cf6cc72a218db19f402ec042770fb83fb",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "fromDay",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "toDay",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint224",
        name: "expiredPoints",
        type: "uint224",
      },
    ],
    name: "TraderTrailingPointsExpired",
    type: "event",
    signature:
      "0x964f0f6a92f6d7eedbff7670a2e850f5511e59321724a9dbef638c8068b7527b",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_normalFeeAmountCollateral",
        type: "uint256",
      },
    ],
    name: "calculateFeeAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4f09a236",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_feeTierIndex",
        type: "uint256",
      },
    ],
    name: "getFeeTier",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "feeMultiplier",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "pointsThreshold",
            type: "uint32",
          },
        ],
        internalType: "struct IFeeTiers.FeeTier",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xeccea3e2",
  },
  {
    inputs: [],
    name: "getFeeTiersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa89db8e5",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_day",
        type: "uint32",
      },
    ],
    name: "getFeeTiersTraderDailyInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "feeMultiplierCache",
            type: "uint32",
          },
          {
            internalType: "uint224",
            name: "points",
            type: "uint224",
          },
        ],
        internalType: "struct IFeeTiers.TraderDailyInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x794d8520",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getFeeTiersTraderInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "lastDayUpdated",
            type: "uint32",
          },
          {
            internalType: "uint224",
            name: "trailingPoints",
            type: "uint224",
          },
        ],
        internalType: "struct IFeeTiers.TraderInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xacbaaf33",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_groupIndex",
        type: "uint256",
      },
    ],
    name: "getGroupVolumeMultiplier",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x31ca4887",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_groupIndices",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_groupVolumeMultipliers",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_feeTiersIndices",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "feeMultiplier",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "pointsThreshold",
            type: "uint32",
          },
        ],
        internalType: "struct IFeeTiers.FeeTier[]",
        name: "_feeTiers",
        type: "tuple[]",
      },
    ],
    name: "initializeFeeTiers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x33534de2",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_feeTiersIndices",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "feeMultiplier",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "pointsThreshold",
            type: "uint32",
          },
        ],
        internalType: "struct IFeeTiers.FeeTier[]",
        name: "_feeTiers",
        type: "tuple[]",
      },
    ],
    name: "setFeeTiers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xeced5249",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_groupIndices",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_groupVolumeMultipliers",
        type: "uint256[]",
      },
    ],
    name: "setGroupVolumeMultipliers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x944f577a",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_volumeUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "updateTraderPoints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xfed8a190",
  },
  {
    inputs: [],
    name: "WrongWindowsCount",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongWindowsDuration",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint40",
        name: "cumulativeFactor",
        type: "uint40",
      },
    ],
    name: "CumulativeFactorUpdated",
    type: "event",
    signature:
      "0x2742ec28d0252b4477106a77a10b04e1c1ecd2b568c7168d56c3a3154d3a3122",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint48",
        name: "windowsDuration",
        type: "uint48",
      },
      {
        indexed: true,
        internalType: "uint48",
        name: "windowsCount",
        type: "uint48",
      },
    ],
    name: "OiWindowsSettingsInitialized",
    type: "event",
    signature:
      "0x13a1cf276d620019ba08cdbba6c90fc281a94ee3481ea8aff3b514c8ab4d0ac2",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "valueAboveUsd",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "valueBelowUsd",
        type: "uint128",
      },
    ],
    name: "OnePercentDepthUpdated",
    type: "event",
    signature:
      "0x636bd42d4023c080480c167f471d64277a2a04d8f812420062908ace34475092",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint128",
            name: "oiLongUsd",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "oiShortUsd",
            type: "uint128",
          },
        ],
        indexed: false,
        internalType: "struct IPriceImpact.PairOi",
        name: "totalPairOi",
        type: "tuple",
      },
    ],
    name: "PriceImpactOiTransferredPair",
    type: "event",
    signature:
      "0xbc0bf036cfe0e40ec07eeea05e96c6a78f2bc92a80f5d10b9179a2649e3bb717",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "pairsCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prevCurrentWindowId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prevEarliestWindowId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newCurrentWindowId",
        type: "uint256",
      },
    ],
    name: "PriceImpactOiTransferredPairs",
    type: "event",
    signature:
      "0x73a54fbb7b96ef55a35eecf33a61c9ae379cbb38a4d6de352ee3e7c456211a22",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "trader",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint48",
            name: "windowsDuration",
            type: "uint48",
          },
          {
            internalType: "uint256",
            name: "pairIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "windowId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "open",
            type: "bool",
          },
          {
            internalType: "uint128",
            name: "openInterestUsd",
            type: "uint128",
          },
        ],
        indexed: false,
        internalType: "struct IPriceImpact.OiWindowUpdate",
        name: "oiWindowUpdate",
        type: "tuple",
      },
    ],
    name: "PriceImpactOpenInterestAdded",
    type: "event",
    signature:
      "0xcca5358ade10271036cf22898f07ad681f9dd7fc3e861da5fc31319c4b890ad4",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint48",
        name: "windowsCount",
        type: "uint48",
      },
    ],
    name: "PriceImpactWindowsCountUpdated",
    type: "event",
    signature:
      "0xcd8ae5cbabd45f9918819404692cdffaab6769e8cf5a597405518a1b33419d71",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint48",
        name: "windowsDuration",
        type: "uint48",
      },
    ],
    name: "PriceImpactWindowsDurationUpdated",
    type: "event",
    signature:
      "0x5c4b755bc1cf4bae3a95cfc185b1e390e2289a97933671d8a098a4131b020664",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "protectionCloseFactorBlocks",
        type: "uint32",
      },
    ],
    name: "ProtectionCloseFactorBlocksUpdated",
    type: "event",
    signature:
      "0xd537ef0f85bea3a23f6af53d4c1b29fdc74cdbd3a07a37bfdb76f5368aebd660",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint40",
        name: "protectionCloseFactor",
        type: "uint40",
      },
    ],
    name: "ProtectionCloseFactorUpdated",
    type: "event",
    signature:
      "0x471eb2788149a10519cea684f0149db7c6af0e5fa1182f06b50c5420fe95d12a",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "_oiDeltaCollateral",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_open",
        type: "bool",
      },
    ],
    name: "addPriceImpactOpenInterest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x23ce624b",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "_windowsDuration",
        type: "uint48",
      },
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_windowId",
        type: "uint256",
      },
    ],
    name: "getOiWindow",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "oiLongUsd",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "oiShortUsd",
            type: "uint128",
          },
        ],
        internalType: "struct IPriceImpact.PairOi",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x823ef2ac",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "_windowsDuration",
        type: "uint48",
      },
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_windowIds",
        type: "uint256[]",
      },
    ],
    name: "getOiWindows",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "oiLongUsd",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "oiShortUsd",
            type: "uint128",
          },
        ],
        internalType: "struct IPriceImpact.PairOi[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0d12f7cb",
  },
  {
    inputs: [],
    name: "getOiWindowsSettings",
    outputs: [
      {
        components: [
          {
            internalType: "uint48",
            name: "startTs",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "windowsDuration",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "windowsCount",
            type: "uint48",
          },
        ],
        internalType: "struct IPriceImpact.OiWindowsSettings",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xb56df676",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
    ],
    name: "getPairDepth",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "onePercentDepthAboveUsd",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "onePercentDepthBelowUsd",
            type: "uint128",
          },
        ],
        internalType: "struct IPriceImpact.PairDepth",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x375bb2bb",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_indices",
        type: "uint256[]",
      },
    ],
    name: "getPairDepths",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "onePercentDepthAboveUsd",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "onePercentDepthBelowUsd",
            type: "uint128",
          },
        ],
        internalType: "struct IPriceImpact.PairDepth[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0d569f27",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_indices",
        type: "uint256[]",
      },
    ],
    name: "getPairFactors",
    outputs: [
      {
        components: [
          {
            internalType: "uint40",
            name: "protectionCloseFactor",
            type: "uint40",
          },
          {
            internalType: "uint32",
            name: "protectionCloseFactorBlocks",
            type: "uint32",
          },
          {
            internalType: "uint40",
            name: "cumulativeFactor",
            type: "uint40",
          },
          {
            internalType: "uint144",
            name: "__placeholder",
            type: "uint144",
          },
        ],
        internalType: "struct IPriceImpact.PairFactors[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x8db9e2da",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
    ],
    name: "getPriceImpactOi",
    outputs: [
      {
        internalType: "uint256",
        name: "activeOi",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xb6d92b02",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pairIndex",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_tradeOpenInterestUsd",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isPnlPositive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_open",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_lastPosIncreaseBlock",
        type: "uint256",
      },
      {
        internalType: "enum ITradingStorage.ContractsVersion",
        name: "_contractsVersion",
        type: "uint8",
      },
    ],
    name: "getTradePriceImpact",
    outputs: [
      {
        internalType: "uint256",
        name: "priceImpactP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "priceAfterImpact",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xdd5ef6f1",
  },
  {
    inputs: [
      {
        internalType: "uint16[]",
        name: "_pairIndices",
        type: "uint16[]",
      },
      {
        internalType: "uint40[]",
        name: "_protectionCloseFactors",
        type: "uint40[]",
      },
      {
        internalType: "uint32[]",
        name: "_protectionCloseFactorBlocks",
        type: "uint32[]",
      },
      {
        internalType: "uint40[]",
        name: "_cumulativeFactors",
        type: "uint40[]",
      },
    ],
    name: "initializePairFactors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x3d7e587a",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "_windowsDuration",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "_windowsCount",
        type: "uint48",
      },
    ],
    name: "initializePriceImpact",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x01d5664a",
  },
  {
    inputs: [
      {
        internalType: "uint16[]",
        name: "_pairIndices",
        type: "uint16[]",
      },
      {
        internalType: "uint40[]",
        name: "_cumulativeFactors",
        type: "uint40[]",
      },
    ],
    name: "setCumulativeFactors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xa7d518fc",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_indices",
        type: "uint256[]",
      },
      {
        internalType: "uint128[]",
        name: "_depthsAboveUsd",
        type: "uint128[]",
      },
      {
        internalType: "uint128[]",
        name: "_depthsBelowUsd",
        type: "uint128[]",
      },
    ],
    name: "setPairDepths",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x6474b399",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "_newWindowsCount",
        type: "uint48",
      },
    ],
    name: "setPriceImpactWindowsCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x10751b4f",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "_newWindowsDuration",
        type: "uint48",
      },
    ],
    name: "setPriceImpactWindowsDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x39b0fc82",
  },
  {
    inputs: [
      {
        internalType: "uint16[]",
        name: "_pairIndices",
        type: "uint16[]",
      },
      {
        internalType: "uint32[]",
        name: "_protectionCloseFactorBlocks",
        type: "uint32[]",
      },
    ],
    name: "setProtectionCloseFactorBlocks",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x2a4cde4a",
  },
  {
    inputs: [
      {
        internalType: "uint16[]",
        name: "_pairIndices",
        type: "uint16[]",
      },
      {
        internalType: "uint40[]",
        name: "_protectionCloseFactors",
        type: "uint40[]",
      },
    ],
    name: "setProtectionCloseFactors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xef0243dc",
  },
  {
    inputs: [],
    name: "CollateralAlreadyActive",
    type: "error",
  },
  {
    inputs: [],
    name: "CollateralAlreadyDisabled",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxSlippageZero",
    type: "error",
  },
  {
    inputs: [],
    name: "MissingCollaterals",
    type: "error",
  },
  {
    inputs: [],
    name: "TradeInfoCollateralPriceUsdZero",
    type: "error",
  },
  {
    inputs: [],
    name: "TradeOpenPriceZero",
    type: "error",
  },
  {
    inputs: [],
    name: "TradePairNotListed",
    type: "error",
  },
  {
    inputs: [],
    name: "TradePositionSizeZero",
    type: "error",
  },
  {
    inputs: [],
    name: "TradeSlInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "TradeTpInvalid",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "collateral",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "index",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "gToken",
        type: "address",
      },
    ],
    name: "CollateralAdded",
    type: "event",
    signature:
      "0xa02b5df63a0ca2660cbe23b5eb92c7f2ae514aee4a543a6032b38ef338865dbf",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "index",
        type: "uint8",
      },
    ],
    name: "CollateralDisabled",
    type: "event",
    signature:
      "0x09a6e6672fd5a685707eca1eeb3a3ef190ccf5ceaf9a78e410859f2d7983cc92",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "index",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    name: "CollateralUpdated",
    type: "event",
    signature:
      "0x98bbde8d067842c4760a76b32aebf2cd4feb8f07ddcf20d81c619c16f0242ecb",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "collateral",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "index",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "gToken",
        type: "address",
      },
    ],
    name: "GTokenUpdated",
    type: "event",
    signature:
      "0x347ad17cfe896bbbbdf75fa51fd03a1f1366df72ba0baf20ebed1ea1394a8ecd",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "openPrice",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "tp",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sl",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "maxSlippageP",
        type: "uint16",
      },
    ],
    name: "OpenOrderDetailsUpdated",
    type: "event",
    signature:
      "0x57166866105b85933cf7d2f84637e524028a4ca84133309f14b2ce0dfc113498",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
    ],
    name: "PendingOrderClosed",
    type: "event",
    signature:
      "0xf0e19a36a85c073783ad5d0a8026dffa190d250d673c8c80b687cbef125571f3",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "pairIndex",
                type: "uint16",
              },
              {
                internalType: "uint24",
                name: "leverage",
                type: "uint24",
              },
              {
                internalType: "bool",
                name: "long",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isOpen",
                type: "bool",
              },
              {
                internalType: "uint8",
                name: "collateralIndex",
                type: "uint8",
              },
              {
                internalType: "enum ITradingStorage.TradeType",
                name: "tradeType",
                type: "uint8",
              },
              {
                internalType: "uint120",
                name: "collateralAmount",
                type: "uint120",
              },
              {
                internalType: "uint64",
                name: "openPrice",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "tp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "sl",
                type: "uint64",
              },
              {
                internalType: "uint192",
                name: "__placeholder",
                type: "uint192",
              },
            ],
            internalType: "struct ITradingStorage.Trade",
            name: "trade",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "enum ITradingStorage.PendingOrderType",
            name: "orderType",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.PendingOrder",
        name: "pendingOrder",
        type: "tuple",
      },
    ],
    name: "PendingOrderStored",
    type: "event",
    signature:
      "0xc1f6d032e333e12d4ba1d8cdf8c4abc1bcaab7381a4eaa19a918a28f223f519d",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
    ],
    name: "TradeClosed",
    type: "event",
    signature:
      "0xedf2f9a86d6e2127c61aaaeb10a282ee4e0aa89ea19c7db37df80fece027a493",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint120",
        name: "collateralAmount",
        type: "uint120",
      },
    ],
    name: "TradeCollateralUpdated",
    type: "event",
    signature:
      "0xce228a7b1b8e239798e94cb2ba581d57501692fc1d29719a891125f1f393826d",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "maxClosingSlippageP",
        type: "uint16",
      },
    ],
    name: "TradeMaxClosingSlippagePUpdated",
    type: "event",
    signature:
      "0xb34e0065c48018b4a48b78c4729fd9ffd1968c59d6532e600c4afb42ce093da1",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint120",
        name: "collateralAmount",
        type: "uint120",
      },
      {
        indexed: false,
        internalType: "uint24",
        name: "leverage",
        type: "uint24",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "openPrice",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newTp",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newSl",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPartialIncrease",
        type: "bool",
      },
    ],
    name: "TradePositionUpdated",
    type: "event",
    signature:
      "0x3890801c6f1ea37e9eb6aaae6cb1e57eeb8fe67e3af47b2533ff1fc4d1031ede",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newSl",
        type: "uint64",
      },
    ],
    name: "TradeSlUpdated",
    type: "event",
    signature:
      "0x38f5d5d40d9c4a41aa03d21461f1b07aa6b4ef035fb9d21f02d53a82c712a002",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Trade",
        name: "trade",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "tpLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "slLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
          {
            internalType: "uint48",
            name: "lastOiUpdateTs",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "collateralPriceUsd",
            type: "uint48",
          },
          {
            internalType: "enum ITradingStorage.ContractsVersion",
            name: "contractsVersion",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "lastPosIncreaseBlock",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "__placeholder",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.TradeInfo",
        name: "tradeInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        indexed: false,
        internalType: "struct IPairsStorage.GroupLiquidationParams",
        name: "liquidationParams",
        type: "tuple",
      },
    ],
    name: "TradeStored",
    type: "event",
    signature:
      "0xb4c8599e992aeeb8f86e02eaee1061646ddf10a354b91f1daa776eb4595387a3",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newTp",
        type: "uint64",
      },
    ],
    name: "TradeTpUpdated",
    type: "event",
    signature:
      "0x3d045f25e6a6757ae5ca79ce5d28d84d69713804353a02c521d6a5352c0f9e20",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum ITradingStorage.TradingActivated",
        name: "activated",
        type: "uint8",
      },
    ],
    name: "TradingActivatedUpdated",
    type: "event",
    signature:
      "0x4b502c3b75c299352edc7887297ae0f7c401ed654650a4c0e663458b6ed75fe4",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_collateral",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gToken",
        type: "address",
      },
    ],
    name: "addCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc6783af1",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_orderId",
        type: "tuple",
      },
    ],
    name: "closePendingOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x4fb70bba",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
    ],
    name: "closeTrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x8583909b",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getAllPendingOrders",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "pairIndex",
                type: "uint16",
              },
              {
                internalType: "uint24",
                name: "leverage",
                type: "uint24",
              },
              {
                internalType: "bool",
                name: "long",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isOpen",
                type: "bool",
              },
              {
                internalType: "uint8",
                name: "collateralIndex",
                type: "uint8",
              },
              {
                internalType: "enum ITradingStorage.TradeType",
                name: "tradeType",
                type: "uint8",
              },
              {
                internalType: "uint120",
                name: "collateralAmount",
                type: "uint120",
              },
              {
                internalType: "uint64",
                name: "openPrice",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "tp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "sl",
                type: "uint64",
              },
              {
                internalType: "uint192",
                name: "__placeholder",
                type: "uint192",
              },
            ],
            internalType: "struct ITradingStorage.Trade",
            name: "trade",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "enum ITradingStorage.PendingOrderType",
            name: "orderType",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
        ],
        internalType: "struct ITradingStorage.PendingOrder[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x2d11445f",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getAllTradeInfos",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "tpLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "slLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
          {
            internalType: "uint48",
            name: "lastOiUpdateTs",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "collateralPriceUsd",
            type: "uint48",
          },
          {
            internalType: "enum ITradingStorage.ContractsVersion",
            name: "contractsVersion",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "lastPosIncreaseBlock",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "__placeholder",
            type: "uint8",
          },
        ],
        internalType: "struct ITradingStorage.TradeInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xeb50287f",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getAllTrades",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xdffd8a1f",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "getAllTradesLiquidationParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        internalType: "struct IPairsStorage.GroupLiquidationParams[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xc2b96e65",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_index",
        type: "uint8",
      },
    ],
    name: "getCollateral",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateral",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "uint88",
            name: "__placeholder",
            type: "uint88",
          },
          {
            internalType: "uint128",
            name: "precision",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "precisionDelta",
            type: "uint128",
          },
        ],
        internalType: "struct ITradingStorage.Collateral",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xbb33a55b",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_collateral",
        type: "address",
      },
    ],
    name: "getCollateralIndex",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x5c3ed7c3",
  },
  {
    inputs: [],
    name: "getCollaterals",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateral",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "uint88",
            name: "__placeholder",
            type: "uint88",
          },
          {
            internalType: "uint128",
            name: "precision",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "precisionDelta",
            type: "uint128",
          },
        ],
        internalType: "struct ITradingStorage.Collateral[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x78b92636",
  },
  {
    inputs: [],
    name: "getCollateralsCount",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa3e15d09",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "enum ITradingStorage.CounterType",
        name: "_type",
        type: "uint8",
      },
    ],
    name: "getCounters",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "currentIndex",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "openCount",
            type: "uint32",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Counter",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0212f0d6",
  },
  {
    inputs: [],
    name: "getCurrentContractsVersion",
    outputs: [
      {
        internalType: "enum ITradingStorage.ContractsVersion",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
    signature: "0x9095b119",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getGToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x6a0aff41",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_orderId",
        type: "tuple",
      },
    ],
    name: "getPendingOrder",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "pairIndex",
                type: "uint16",
              },
              {
                internalType: "uint24",
                name: "leverage",
                type: "uint24",
              },
              {
                internalType: "bool",
                name: "long",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isOpen",
                type: "bool",
              },
              {
                internalType: "uint8",
                name: "collateralIndex",
                type: "uint8",
              },
              {
                internalType: "enum ITradingStorage.TradeType",
                name: "tradeType",
                type: "uint8",
              },
              {
                internalType: "uint120",
                name: "collateralAmount",
                type: "uint120",
              },
              {
                internalType: "uint64",
                name: "openPrice",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "tp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "sl",
                type: "uint64",
              },
              {
                internalType: "uint192",
                name: "__placeholder",
                type: "uint192",
              },
            ],
            internalType: "struct ITradingStorage.Trade",
            name: "trade",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "enum ITradingStorage.PendingOrderType",
            name: "orderType",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
        ],
        internalType: "struct ITradingStorage.PendingOrder",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xc6e729bb",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getPendingOrders",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "pairIndex",
                type: "uint16",
              },
              {
                internalType: "uint24",
                name: "leverage",
                type: "uint24",
              },
              {
                internalType: "bool",
                name: "long",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isOpen",
                type: "bool",
              },
              {
                internalType: "uint8",
                name: "collateralIndex",
                type: "uint8",
              },
              {
                internalType: "enum ITradingStorage.TradeType",
                name: "tradeType",
                type: "uint8",
              },
              {
                internalType: "uint120",
                name: "collateralAmount",
                type: "uint120",
              },
              {
                internalType: "uint64",
                name: "openPrice",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "tp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "sl",
                type: "uint64",
              },
              {
                internalType: "uint192",
                name: "__placeholder",
                type: "uint192",
              },
            ],
            internalType: "struct ITradingStorage.Trade",
            name: "trade",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "enum ITradingStorage.PendingOrderType",
            name: "orderType",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
        ],
        internalType: "struct ITradingStorage.PendingOrder[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4c73cb25",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
    ],
    name: "getTrade",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x15878e07",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
    ],
    name: "getTradeInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "tpLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "slLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
          {
            internalType: "uint48",
            name: "lastOiUpdateTs",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "collateralPriceUsd",
            type: "uint48",
          },
          {
            internalType: "enum ITradingStorage.ContractsVersion",
            name: "contractsVersion",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "lastPosIncreaseBlock",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "__placeholder",
            type: "uint8",
          },
        ],
        internalType: "struct ITradingStorage.TradeInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x75cd812d",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getTradeInfos",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "tpLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "slLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
          {
            internalType: "uint48",
            name: "lastOiUpdateTs",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "collateralPriceUsd",
            type: "uint48",
          },
          {
            internalType: "enum ITradingStorage.ContractsVersion",
            name: "contractsVersion",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "lastPosIncreaseBlock",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "__placeholder",
            type: "uint8",
          },
        ],
        internalType: "struct ITradingStorage.TradeInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0d1e3c94",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
    ],
    name: "getTradeLiquidationParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        internalType: "struct IPairsStorage.GroupLiquidationParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x28dc892f",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "_orderType",
        type: "uint8",
      },
    ],
    name: "getTradePendingOrderBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x067e84dd",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getTraderStored",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xbed8d2da",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_offset",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "_limit",
        type: "uint32",
      },
    ],
    name: "getTraders",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0e503724",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getTrades",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4bfad7c0",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getTradesLiquidationParams",
    outputs: [
      {
        components: [
          {
            internalType: "uint40",
            name: "maxLiqSpreadP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "startLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "endLiqThresholdP",
            type: "uint40",
          },
          {
            internalType: "uint24",
            name: "startLeverage",
            type: "uint24",
          },
          {
            internalType: "uint24",
            name: "endLeverage",
            type: "uint24",
          },
        ],
        internalType: "struct IPairsStorage.GroupLiquidationParams[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xf7746f3c",
  },
  {
    inputs: [],
    name: "getTradingActivated",
    outputs: [
      {
        internalType: "enum ITradingStorage.TradingActivated",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4115c122",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_gns",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gnsStaking",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_collaterals",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_gTokens",
        type: "address[]",
      },
    ],
    name: "initializeTradingStorage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x1b7d88e5",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_index",
        type: "uint8",
      },
    ],
    name: "isCollateralActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4d140218",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_index",
        type: "uint8",
      },
    ],
    name: "isCollateralListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x1d2ffb42",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "pairIndex",
                type: "uint16",
              },
              {
                internalType: "uint24",
                name: "leverage",
                type: "uint24",
              },
              {
                internalType: "bool",
                name: "long",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isOpen",
                type: "bool",
              },
              {
                internalType: "uint8",
                name: "collateralIndex",
                type: "uint8",
              },
              {
                internalType: "enum ITradingStorage.TradeType",
                name: "tradeType",
                type: "uint8",
              },
              {
                internalType: "uint120",
                name: "collateralAmount",
                type: "uint120",
              },
              {
                internalType: "uint64",
                name: "openPrice",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "tp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "sl",
                type: "uint64",
              },
              {
                internalType: "uint192",
                name: "__placeholder",
                type: "uint192",
              },
            ],
            internalType: "struct ITradingStorage.Trade",
            name: "trade",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "enum ITradingStorage.PendingOrderType",
            name: "orderType",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
        ],
        internalType: "struct ITradingStorage.PendingOrder",
        name: "_pendingOrder",
        type: "tuple",
      },
    ],
    name: "storePendingOrder",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "pairIndex",
                type: "uint16",
              },
              {
                internalType: "uint24",
                name: "leverage",
                type: "uint24",
              },
              {
                internalType: "bool",
                name: "long",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isOpen",
                type: "bool",
              },
              {
                internalType: "uint8",
                name: "collateralIndex",
                type: "uint8",
              },
              {
                internalType: "enum ITradingStorage.TradeType",
                name: "tradeType",
                type: "uint8",
              },
              {
                internalType: "uint120",
                name: "collateralAmount",
                type: "uint120",
              },
              {
                internalType: "uint64",
                name: "openPrice",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "tp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "sl",
                type: "uint64",
              },
              {
                internalType: "uint192",
                name: "__placeholder",
                type: "uint192",
              },
            ],
            internalType: "struct ITradingStorage.Trade",
            name: "trade",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "enum ITradingStorage.PendingOrderType",
            name: "orderType",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
        ],
        internalType: "struct ITradingStorage.PendingOrder",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x93f9384e",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade",
        name: "_trade",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "createdBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "tpLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "slLastUpdatedBlock",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxSlippageP",
            type: "uint16",
          },
          {
            internalType: "uint48",
            name: "lastOiUpdateTs",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "collateralPriceUsd",
            type: "uint48",
          },
          {
            internalType: "enum ITradingStorage.ContractsVersion",
            name: "contractsVersion",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "lastPosIncreaseBlock",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "__placeholder",
            type: "uint8",
          },
        ],
        internalType: "struct ITradingStorage.TradeInfo",
        name: "_tradeInfo",
        type: "tuple",
      },
    ],
    name: "storeTrade",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xd7ec0787",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "toggleCollateralActiveState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x49f7895b",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_collateral",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gToken",
        type: "address",
      },
    ],
    name: "updateGToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x63450d74",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "uint64",
        name: "_openPrice",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_tp",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_sl",
        type: "uint64",
      },
      {
        internalType: "uint16",
        name: "_maxSlippageP",
        type: "uint16",
      },
    ],
    name: "updateOpenOrderDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xeb2dfde8",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "uint120",
        name: "_collateralAmount",
        type: "uint120",
      },
    ],
    name: "updateTradeCollateralAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x5a68200d",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "uint16",
        name: "_maxSlippageP",
        type: "uint16",
      },
    ],
    name: "updateTradeMaxClosingSlippageP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x07d426fd",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "uint120",
        name: "_collateralAmount",
        type: "uint120",
      },
      {
        internalType: "uint24",
        name: "_leverage",
        type: "uint24",
      },
      {
        internalType: "uint64",
        name: "_openPrice",
        type: "uint64",
      },
      {
        internalType: "bool",
        name: "_isPartialIncrease",
        type: "bool",
      },
    ],
    name: "updateTradePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x72570e24",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "uint64",
        name: "_newSl",
        type: "uint64",
      },
    ],
    name: "updateTradeSl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x1053c279",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "uint64",
        name: "_newTp",
        type: "uint64",
      },
    ],
    name: "updateTradeTp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xb8f741d4",
  },
  {
    inputs: [
      {
        internalType: "enum ITradingStorage.TradingActivated",
        name: "_activated",
        type: "uint8",
      },
    ],
    name: "updateTradingActivated",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xb78f4b36",
  },
  {
    inputs: [],
    name: "NoPendingTriggerRewards",
    type: "error",
  },
  {
    inputs: [],
    name: "TimeoutBlocksZero",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardsPerOracleGns",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oraclesCount",
        type: "uint256",
      },
    ],
    name: "TriggerRewarded",
    type: "event",
    signature:
      "0x82bfbe6a1c6cb1077af1001e76028d28d03bf40ac393b689ea90d22e10d3f2da",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardsGns",
        type: "uint256",
      },
    ],
    name: "TriggerRewardsClaimed",
    type: "event",
    signature:
      "0x0e430d4d92cf840e4840d7defc88d12f7b5d7e45222f5d571914c734e1cc8335",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "timeoutBlocks",
        type: "uint16",
      },
    ],
    name: "TriggerTimeoutBlocksUpdated",
    type: "event",
    signature:
      "0x652d3f2e78702ea06eebce1653dfcd9731f4d9888a0032700b1b7b0b051ad6b8",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
    ],
    name: "claimPendingTriggerRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x63790a1b",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardGns",
        type: "uint256",
      },
    ],
    name: "distributeTriggerReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x69f5395e",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
    ],
    name: "getTriggerPendingRewardsGns",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x9fd0bdad",
  },
  {
    inputs: [],
    name: "getTriggerTimeoutBlocks",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x1187f9bd",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_orderBlock",
        type: "uint256",
      },
    ],
    name: "hasActiveOrder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x8765f772",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_timeoutBlocks",
        type: "uint16",
      },
    ],
    name: "initializeTriggerRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xe2c3542b",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_timeoutBlocks",
        type: "uint16",
      },
    ],
    name: "updateTriggerTimeoutBlocks",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x9e353611",
  },
  {
    inputs: [],
    name: "AboveExposureLimits",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyBeingMarketClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "CollateralNotActive",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "",
        type: "uint8",
      },
    ],
    name: "ConflictingPendingOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "DelegateNotApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "DelegatedActionNotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientCollateral",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDecreasePositionSizeInput",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidIncreasePositionSizeInput",
    type: "error",
  },
  {
    inputs: [],
    name: "NewPositionSizeSmaller",
    type: "error",
  },
  {
    inputs: [],
    name: "NoOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "NoSl",
    type: "error",
  },
  {
    inputs: [],
    name: "NoTp",
    type: "error",
  },
  {
    inputs: [],
    name: "NoTrade",
    type: "error",
  },
  {
    inputs: [],
    name: "NotWrappedNativeToken",
    type: "error",
  },
  {
    inputs: [],
    name: "NotYourOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "PendingTrigger",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceImpactTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceZero",
    type: "error",
  },
  {
    inputs: [],
    name: "WaitTimeout",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongLeverage",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongSl",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongTp",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "bypass",
        type: "bool",
      },
    ],
    name: "ByPassTriggerLinkUpdated",
    type: "event",
    signature:
      "0x06e17fbb36333cd9cb0220b0e3cb4ce4d9d6b543f762e8ca6038422e24fa59e4",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "pendingOrderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
    ],
    name: "ChainlinkCallbackTimeout",
    type: "event",
    signature:
      "0x3f709185dd46048fccc37c6e34d58fff306fc7991fdbae962679345db3ed2e32",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "index",
        type: "uint32",
      },
    ],
    name: "CouldNotCloseTrade",
    type: "event",
    signature:
      "0x051ed9aeed13c97b879c0dd2b13c76171e2760abe3d62bca140dc70b39bd86f1",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isIncrease",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "marketPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralDelta",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "newLeverage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "newCollateralAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liqPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "govFeeCollateral",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct IUpdateLeverage.UpdateLeverageValues",
        name: "values",
        type: "tuple",
      },
    ],
    name: "LeverageUpdateExecuted",
    type: "event",
    signature:
      "0xd377bf540561d2182d611090b46189834f8bb72f02121dc896866c06e02e6655",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isIncrease",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newLeverage",
        type: "uint256",
      },
    ],
    name: "LeverageUpdateInitiated",
    type: "event",
    signature:
      "0xf4181f0fa2e1d3cda20bb810e0427d87916eb5dac8c73a7f779ae13e55ec578f",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "open",
        type: "bool",
      },
    ],
    name: "MarketOrderInitiated",
    type: "event",
    signature:
      "0x3a60290d7335bce64a807e90f39655517bb5fa702423fa8fac283a5ea16d3a97",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newValueBlocks",
        type: "uint256",
      },
    ],
    name: "MarketOrdersTimeoutBlocksUpdated",
    type: "event",
    signature:
      "0x91e136d1ad9bf0a586afd0c7699533d033f9092cc48c9e2e16a8c1bc87a33456",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nativeTokenAmount",
        type: "uint256",
      },
    ],
    name: "NativeTokenWrapped",
    type: "event",
    signature:
      "0x4140bfb1a8c58243a51a8ab319eda78a7382befc5ff76598e746df60996b9d0d",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "index",
        type: "uint32",
      },
    ],
    name: "OpenLimitCanceled",
    type: "event",
    signature:
      "0x30a872d1bbd3e31dbb65ce3a53ede9f12b497e1b134c66e64a10f850c4391bf0",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "index",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newPrice",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newTp",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "newSl",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "maxSlippageP",
        type: "uint64",
      },
    ],
    name: "OpenLimitUpdated",
    type: "event",
    signature:
      "0x11c151b754cb223cb771e3d8ece99deae21de397c95d3b1ca4ccb995620766bf",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "index",
        type: "uint32",
      },
    ],
    name: "OpenOrderPlaced",
    type: "event",
    signature:
      "0xb57382e21e3ceb31b5beda26d7cc7e459dc52a0b1f5ae0c9b4e603401b7dc642",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "marketPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralPriceUsd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralDelta",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "leverageDelta",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "positionSizeCollateralDelta",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "existingPositionSizeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "existingLiqPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceAfterImpact",
            type: "uint256",
          },
          {
            internalType: "int256",
            name: "existingPnlCollateral",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "borrowingFeeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "vaultFeeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gnsStakingFeeCollateral",
            type: "uint256",
          },
          {
            internalType: "int256",
            name: "availableCollateralInDiamond",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "collateralSentToTrader",
            type: "int256",
          },
          {
            internalType: "uint120",
            name: "newCollateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint24",
            name: "newLeverage",
            type: "uint24",
          },
        ],
        indexed: false,
        internalType: "struct IUpdatePositionSize.DecreasePositionSizeValues",
        name: "values",
        type: "tuple",
      },
    ],
    name: "PositionSizeDecreaseExecuted",
    type: "event",
    signature:
      "0xe74b50af866d7f8e3577bc959bf73a2690841f0abce22ab0cfb1b1c84122a7d7",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "marketPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralPriceUsd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralDelta",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "leverageDelta",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "positionSizeCollateralDelta",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "existingPositionSizeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "newPositionSizeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "newCollateralAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "newLeverage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceAfterImpact",
            type: "uint256",
          },
          {
            internalType: "int256",
            name: "existingPnlCollateral",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "newOpenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "borrowingFeeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "openingFeesCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "existingLiqPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "newLiqPrice",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct IUpdatePositionSize.IncreasePositionSizeValues",
        name: "values",
        type: "tuple",
      },
    ],
    name: "PositionSizeIncreaseExecuted",
    type: "event",
    signature:
      "0xf09a9c949c4bd4cbe75b424bea11c683c3ae55e7cdb8321c3ec37e01af72c8d5",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isIncrease",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralDelta",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "leverageDelta",
        type: "uint256",
      },
    ],
    name: "PositionSizeUpdateInitiated",
    type: "event",
    signature:
      "0xef86ff293bce1d37f4b09f9c27b48f752d86a9fde1109f1bd8b806e05e7bada5",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "byPassesLinkCost",
        type: "bool",
      },
    ],
    name: "TriggerOrderInitiated",
    type: "event",
    signature:
      "0x1472b674eddef9a7145c9353c62f5c03cfcf54556c14c3a0ebbf394da6e0c9ea",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
    ],
    name: "cancelOpenOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x85886333",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_orderIndex",
        type: "uint32",
      },
    ],
    name: "cancelOrderAfterTimeout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xb6919540",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint64",
        name: "_expectedPrice",
        type: "uint64",
      },
    ],
    name: "closeTradeMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x36ce736b",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint120",
        name: "_collateralDelta",
        type: "uint120",
      },
      {
        internalType: "uint24",
        name: "_leverageDelta",
        type: "uint24",
      },
      {
        internalType: "uint64",
        name: "_expectedPrice",
        type: "uint64",
      },
    ],
    name: "decreasePositionSize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xa7cac572",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_callData",
        type: "bytes",
      },
    ],
    name: "delegatedTradingAction",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x737b84cd",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getByPassTriggerLink",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x85898e08",
  },
  {
    inputs: [],
    name: "getMarketOrdersTimeoutBlocks",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa4bdee80",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
    ],
    name: "getTradingDelegate",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x4aac6480",
  },
  {
    inputs: [],
    name: "getWrappedNativeToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x1d9478b6",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint120",
        name: "_collateralDelta",
        type: "uint120",
      },
      {
        internalType: "uint24",
        name: "_leverageDelta",
        type: "uint24",
      },
      {
        internalType: "uint64",
        name: "_expectedPrice",
        type: "uint64",
      },
      {
        internalType: "uint16",
        name: "_maxSlippageP",
        type: "uint16",
      },
    ],
    name: "increasePositionSize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x24058ad3",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_marketOrdersTimeoutBlocks",
        type: "uint16",
      },
      {
        internalType: "address[]",
        name: "_usersByPassTriggerLink",
        type: "address[]",
      },
    ],
    name: "initializeTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x5179cecf",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "isWrappedNativeToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x84e93347",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade",
        name: "_trade",
        type: "tuple",
      },
      {
        internalType: "uint16",
        name: "_maxSlippageP",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "_referrer",
        type: "address",
      },
    ],
    name: "openTrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x4465c3e4",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade",
        name: "_trade",
        type: "tuple",
      },
      {
        internalType: "uint16",
        name: "_maxSlippageP",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "_referrer",
        type: "address",
      },
    ],
    name: "openTradeNative",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    signature: "0x080e83e1",
  },
  {
    inputs: [],
    name: "removeTradingDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x031c722b",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_delegate",
        type: "address",
      },
    ],
    name: "setTradingDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x604755cf",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_packed",
        type: "uint256",
      },
    ],
    name: "triggerOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xeb9359aa",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_users",
        type: "address[]",
      },
      {
        internalType: "bool[]",
        name: "_shouldByPass",
        type: "bool[]",
      },
    ],
    name: "updateByPassTriggerLink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x9bf1584e",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint24",
        name: "_newLeverage",
        type: "uint24",
      },
    ],
    name: "updateLeverage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x0bce9aaa",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_valueBlocks",
        type: "uint16",
      },
    ],
    name: "updateMarketOrdersTimeoutBlocks",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x52d029d2",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint16",
        name: "_maxSlippageP",
        type: "uint16",
      },
    ],
    name: "updateMaxClosingSlippageP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x9e8433d0",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint64",
        name: "_triggerPrice",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_tp",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_sl",
        type: "uint64",
      },
      {
        internalType: "uint16",
        name: "_maxSlippageP",
        type: "uint16",
      },
    ],
    name: "updateOpenOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xa4bb127e",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint64",
        name: "_newSl",
        type: "uint64",
      },
    ],
    name: "updateSl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xb5d9e9d0",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint64",
        name: "_newTp",
        type: "uint64",
      },
    ],
    name: "updateTp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xf401f2bb",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCollateral",
        type: "uint256",
      },
    ],
    name: "BorrowingFeeCharged",
    type: "event",
    signature:
      "0x2aac04047becf1d92defe3c1ee644bdd7b50ae634a7e5ebfca84c2be3fc63344",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCollateral",
        type: "uint256",
      },
    ],
    name: "GTokenFeeCharged",
    type: "event",
    signature:
      "0xfe4ab97508a97bb85ad1e2680662e58549e51982d965eed4ef6d7fcd4cc4295f",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCollateral",
        type: "uint256",
      },
    ],
    name: "GnsStakingFeeCharged",
    type: "event",
    signature:
      "0x8e4c272f039ef17bb8cb5a5bc5d6f0cebf9c5037dceae9528bb05b0c4f5a7b80",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCollateral",
        type: "uint256",
      },
    ],
    name: "GovFeeCharged",
    type: "event",
    signature:
      "0xeb561f0609b402569e8a7e8fe9d4f408b92c96fb83001b2cd78fd55c29bbbac3",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Trade",
        name: "t",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "triggerCaller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "orderType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceImpactP",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "percentProfit",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountSentToTrader",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralPriceUsd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "exactExecution",
        type: "bool",
      },
    ],
    name: "LimitExecuted",
    type: "event",
    signature:
      "0xc10f67c0e22c53149183a414c16a62334103432a2c48b839a057cd9bd5fdeb99",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
    ],
    name: "MarketCloseCanceled",
    type: "event",
    signature:
      "0x1d7048e18d77f0864147aec27ae4b78d421fe35ddde1ea0ec535562c4a90cc58",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Trade",
        name: "t",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "open",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "price",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceImpactP",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "percentProfit",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountSentToTrader",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralPriceUsd",
        type: "uint256",
      },
    ],
    name: "MarketExecuted",
    type: "event",
    signature:
      "0xbbd5cfa7b4ec0d44d4155fcaad32af9cf7e65799d6b8b08f233b930de7bcd9a8",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
    ],
    name: "MarketOpenCanceled",
    type: "event",
    signature:
      "0x377325122a5a86014bf0a307dc0c8eab0bf1e2858ff6e1522a7551e6df253782",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCollateral",
        type: "uint256",
      },
    ],
    name: "PendingGovFeesClaimed",
    type: "event",
    signature:
      "0x0b92b2d73b4c8443d11985dbf6a8cfdfc03b93d6679aab94b7d4fb5842dd0cb0",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCollateral",
        type: "uint256",
      },
    ],
    name: "ReferralFeeCharged",
    type: "event",
    signature:
      "0x264425c9f39f6b517f96e5447a9347098bfbe112753fada5068de9fdf6d5168c",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCollateral",
        type: "uint256",
      },
    ],
    name: "TriggerFeeCharged",
    type: "event",
    signature:
      "0x9460073dee9bbc6b4566aae39b3ec7308696e65ec5d376434076d72afabe3eba",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "triggerCaller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "orderType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
    ],
    name: "TriggerOrderCanceled",
    type: "event",
    signature:
      "0x0766d5a97748cddd280198f717da563fe9aad4d38e5bd546fe56d04fbc68a3cd",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "valueP",
        type: "uint8",
      },
    ],
    name: "VaultClosingFeePUpdated",
    type: "event",
    signature:
      "0x1be5a8e0282c1b895f845900a8efe7585790659f1b4f062f17000e2712dd8601",
  },
  {
    inputs: [],
    name: "claimPendingGovFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x36c3dba2",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "_a",
        type: "tuple",
      },
    ],
    name: "closeTradeMarketCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x4b0b5629",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "_a",
        type: "tuple",
      },
    ],
    name: "decreasePositionSizeMarketCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xe1d88718",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "_a",
        type: "tuple",
      },
    ],
    name: "executeTriggerCloseOrderCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc61a7ad4",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "_a",
        type: "tuple",
      },
    ],
    name: "executeTriggerOpenOrderCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x3b0c5938",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getPendingGovFeesCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x2c6fe6d1",
  },
  {
    inputs: [],
    name: "getVaultClosingFeeP",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa5b26e46",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "_a",
        type: "tuple",
      },
    ],
    name: "increasePositionSizeMarketCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x10d8e754",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_vaultClosingFeeP",
        type: "uint8",
      },
    ],
    name: "initializeCallbacks",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xec98ec83",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "_a",
        type: "tuple",
      },
    ],
    name: "openTradeMarketCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x13ebc2c6",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "_a",
        type: "tuple",
      },
    ],
    name: "updateLeverageCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x92dd2940",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_valueP",
        type: "uint8",
      },
    ],
    name: "updateVaultClosingFeeP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xcbc8e6f2",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "_orderType",
        type: "uint8",
      },
      {
        internalType: "uint64",
        name: "_open",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_high",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_low",
        type: "uint64",
      },
    ],
    name: "validateTriggerCloseOrderCallback",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade",
        name: "t",
        type: "tuple",
      },
      {
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "positionSizeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gnsPriceCollateral",
            type: "uint256",
          },
          {
            internalType: "int256",
            name: "profitP",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "executionPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liqPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountSentToTrader",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward2",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward3",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "collateralPrecisionDelta",
            type: "uint128",
          },
          {
            internalType: "uint256",
            name: "collateralPriceUsd",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "exactExecution",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "closingFeeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "triggerFeeCollateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateralLeftInStorage",
            type: "uint256",
          },
        ],
        internalType: "struct ITradingCallbacks.Values",
        name: "v",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "priceImpactP",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x85ea3c78",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "_orderType",
        type: "uint8",
      },
      {
        internalType: "uint64",
        name: "_open",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_high",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_low",
        type: "uint64",
      },
    ],
    name: "validateTriggerOpenOrderCallback",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint24",
            name: "leverage",
            type: "uint24",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isOpen",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "enum ITradingStorage.TradeType",
            name: "tradeType",
            type: "uint8",
          },
          {
            internalType: "uint120",
            name: "collateralAmount",
            type: "uint120",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "tp",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "sl",
            type: "uint64",
          },
          {
            internalType: "uint192",
            name: "__placeholder",
            type: "uint192",
          },
        ],
        internalType: "struct ITradingStorage.Trade",
        name: "t",
        type: "tuple",
      },
      {
        internalType: "enum ITradingCallbacks.CancelReason",
        name: "cancelReason",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "priceImpactP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "priceAfterImpact",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exactExecution",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa96ae63b",
  },
  {
    inputs: [],
    name: "BorrowingWrongExponent",
    type: "error",
  },
  {
    inputs: [],
    name: "BorrowingZeroGroup",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "groupIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "accFeeLong",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "accFeeShort",
        type: "uint64",
      },
    ],
    name: "BorrowingGroupAccFeesUpdated",
    type: "event",
    signature:
      "0xb4297e7afacc3feba1f03e1a444e70031a62f3ae4d6372c2b0cb3e0e62e8568e",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "groupIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "increase",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "delta",
        type: "uint72",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "newOiLong",
        type: "uint72",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "newOiShort",
        type: "uint72",
      },
    ],
    name: "BorrowingGroupOiUpdated",
    type: "event",
    signature:
      "0xb36af604fa0e5c3505abb63091d204895a517928138498bb965622d2258bdeb5",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "groupIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "feePerBlock",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "maxOi",
        type: "uint72",
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "feeExponent",
        type: "uint48",
      },
    ],
    name: "BorrowingGroupUpdated",
    type: "event",
    signature:
      "0x8f029f3a48396ff1466df7488d31984ab9265a55be3de042cd03662ad2c894ca",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "index",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "initialPairAccFee",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "initialGroupAccFee",
        type: "uint64",
      },
    ],
    name: "BorrowingInitialAccFeesStored",
    type: "event",
    signature:
      "0x49a2b4d58db9411e83e598fad88462d2474d8f9aae8a9ba41acdfde33f4f3751",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "accFeeLong",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "accFeeShort",
        type: "uint64",
      },
    ],
    name: "BorrowingPairAccFeesUpdated",
    type: "event",
    signature:
      "0x12515cf8712ede0f0e48dd7513c14f22f116a6b3f95bd493da7511cf7dcbadd7",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "prevGroupIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "newGroupIndex",
        type: "uint16",
      },
    ],
    name: "BorrowingPairGroupUpdated",
    type: "event",
    signature:
      "0x2281c18b617b78612026764ea9d5175174342c49b30da77900f7518a83242fa7",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "increase",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "delta",
        type: "uint72",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "newOiLong",
        type: "uint72",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "newOiShort",
        type: "uint72",
      },
    ],
    name: "BorrowingPairOiUpdated",
    type: "event",
    signature:
      "0x012adc2457c8405bb9a0f2f3be4cc4bff84f095e6a16535b080facddec7804d3",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "groupIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "feePerBlock",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "feeExponent",
        type: "uint48",
      },
      {
        indexed: false,
        internalType: "uint72",
        name: "maxOi",
        type: "uint72",
      },
    ],
    name: "BorrowingPairParamsUpdated",
    type: "event",
    signature:
      "0x3984f24e4863ca281d86902d6706218ef6b050f256dcc978dbe508eaf8c3a431",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "index",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "open",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "long",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionSizeCollateral",
        type: "uint256",
      },
    ],
    name: "TradeBorrowingCallbackHandled",
    type: "event",
    signature:
      "0x1d4556af371eac83495a853ba4f1af8a2d4e0c76ab08719dbd24b372cfc0acc3",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getAllBorrowingPairs",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "accFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "accFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint48",
            name: "accLastUpdatedBlock",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingData[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint72",
            name: "long",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "short",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "max",
            type: "uint72",
          },
          {
            internalType: "uint40",
            name: "__placeholder",
            type: "uint40",
          },
        ],
        internalType: "struct IBorrowingFees.OpenInterest[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint16",
            name: "groupIndex",
            type: "uint16",
          },
          {
            internalType: "uint48",
            name: "block",
            type: "uint48",
          },
          {
            internalType: "uint64",
            name: "initialAccFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "initialAccFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "prevGroupAccFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "prevGroupAccFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "pairAccFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "pairAccFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "__placeholder",
            type: "uint64",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingPairGroup[][]",
        name: "",
        type: "tuple[][]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x48da5b38",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_groupIndex",
        type: "uint16",
      },
    ],
    name: "getBorrowingGroup",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "accFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "accFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint48",
            name: "accLastUpdatedBlock",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xfff24740",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_groupIndex",
        type: "uint16",
      },
    ],
    name: "getBorrowingGroupOi",
    outputs: [
      {
        components: [
          {
            internalType: "uint72",
            name: "long",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "short",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "max",
            type: "uint72",
          },
          {
            internalType: "uint40",
            name: "__placeholder",
            type: "uint40",
          },
        ],
        internalType: "struct IBorrowingFees.OpenInterest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x13a9baae",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_groupIndex",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_currentBlock",
        type: "uint256",
      },
    ],
    name: "getBorrowingGroupPendingAccFees",
    outputs: [
      {
        internalType: "uint64",
        name: "accFeeLong",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "accFeeShort",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "groupAccFeeDelta",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xd2b9099a",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16[]",
        name: "_indices",
        type: "uint16[]",
      },
    ],
    name: "getBorrowingGroups",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "accFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "accFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint48",
            name: "accLastUpdatedBlock",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingData[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint72",
            name: "long",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "short",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "max",
            type: "uint72",
          },
          {
            internalType: "uint40",
            name: "__placeholder",
            type: "uint40",
          },
        ],
        internalType: "struct IBorrowingFees.OpenInterest[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xfbbf9740",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
    ],
    name: "getBorrowingInitialAccFees",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "accPairFee",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "accGroupFee",
            type: "uint64",
          },
          {
            internalType: "uint48",
            name: "block",
            type: "uint48",
          },
          {
            internalType: "uint80",
            name: "__placeholder",
            type: "uint80",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingInitialAccFees",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xab6192ed",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
    ],
    name: "getBorrowingPair",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "accFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "accFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint48",
            name: "accLastUpdatedBlock",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x5d5bf24d",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
    ],
    name: "getBorrowingPairGroupIndex",
    outputs: [
      {
        internalType: "uint16",
        name: "groupIndex",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xe6a6633f",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
    ],
    name: "getBorrowingPairGroups",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "groupIndex",
            type: "uint16",
          },
          {
            internalType: "uint48",
            name: "block",
            type: "uint48",
          },
          {
            internalType: "uint64",
            name: "initialAccFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "initialAccFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "prevGroupAccFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "prevGroupAccFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "pairAccFeeLong",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "pairAccFeeShort",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "__placeholder",
            type: "uint64",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingPairGroup[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xfd03e048",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
    ],
    name: "getBorrowingPairOi",
    outputs: [
      {
        components: [
          {
            internalType: "uint72",
            name: "long",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "short",
            type: "uint72",
          },
          {
            internalType: "uint72",
            name: "max",
            type: "uint72",
          },
          {
            internalType: "uint40",
            name: "__placeholder",
            type: "uint40",
          },
        ],
        internalType: "struct IBorrowingFees.OpenInterest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0077b57e",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_currentBlock",
        type: "uint256",
      },
    ],
    name: "getBorrowingPairPendingAccFees",
    outputs: [
      {
        internalType: "uint64",
        name: "accFeeLong",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "accFeeShort",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "pairAccFeeDelta",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0c7be6ca",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
    ],
    name: "getPairMaxOi",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x5667b5c0",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
    ],
    name: "getPairMaxOiCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x274d1278",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
    ],
    name: "getPairOiCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xeb2ea3a2",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
    ],
    name: "getPairOisCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "longOi",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shortOi",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xf6f7c948",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "trader",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leverage",
            type: "uint256",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingFeeInput",
        name: "_input",
        type: "tuple",
      },
    ],
    name: "getTradeBorrowingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "feeAmountCollateral",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x0804db93",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "collateralIndex",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "trader",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "openPrice",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "long",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leverage",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "useBorrowingFees",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "uint40",
                name: "maxLiqSpreadP",
                type: "uint40",
              },
              {
                internalType: "uint40",
                name: "startLiqThresholdP",
                type: "uint40",
              },
              {
                internalType: "uint40",
                name: "endLiqThresholdP",
                type: "uint40",
              },
              {
                internalType: "uint24",
                name: "startLeverage",
                type: "uint24",
              },
              {
                internalType: "uint24",
                name: "endLeverage",
                type: "uint24",
              },
            ],
            internalType: "struct IPairsStorage.GroupLiquidationParams",
            name: "liquidationParams",
            type: "tuple",
          },
        ],
        internalType: "struct IBorrowingFees.LiqPriceInput",
        name: "_input",
        type: "tuple",
      },
    ],
    name: "getTradeLiquidationPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x61ddacb0",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "_positionSizeCollateral",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_open",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
    ],
    name: "handleTradeBorrowingCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xfc79e929",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "_index",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
    ],
    name: "resetTradeBorrowingFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x4fa72788",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_groupIndex",
        type: "uint16",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint72",
            name: "maxOi",
            type: "uint72",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingGroupParams",
        name: "_value",
        type: "tuple",
      },
    ],
    name: "setBorrowingGroupParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x9fed9481",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16[]",
        name: "_indices",
        type: "uint16[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint72",
            name: "maxOi",
            type: "uint72",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingGroupParams[]",
        name: "_values",
        type: "tuple[]",
      },
    ],
    name: "setBorrowingGroupParamsArray",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x02c4e7c1",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        components: [
          {
            internalType: "uint16",
            name: "groupIndex",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
          {
            internalType: "uint72",
            name: "maxOi",
            type: "uint72",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingPairParams",
        name: "_value",
        type: "tuple",
      },
    ],
    name: "setBorrowingPairParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x33b516cf",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16[]",
        name: "_indices",
        type: "uint16[]",
      },
      {
        components: [
          {
            internalType: "uint16",
            name: "groupIndex",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "feePerBlock",
            type: "uint32",
          },
          {
            internalType: "uint48",
            name: "feeExponent",
            type: "uint48",
          },
          {
            internalType: "uint72",
            name: "maxOi",
            type: "uint72",
          },
        ],
        internalType: "struct IBorrowingFees.BorrowingPairParams[]",
        name: "_values",
        type: "tuple[]",
      },
    ],
    name: "setBorrowingPairParamsArray",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xeb1802f8",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        internalType: "bool",
        name: "_long",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_positionSizeCollateral",
        type: "uint256",
      },
    ],
    name: "withinMaxBorrowingGroupOi",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x801c7961",
  },
  {
    inputs: [],
    name: "InvalidCandle",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPoolType",
    type: "error",
  },
  {
    inputs: [],
    name: "OracleAlreadyListed",
    type: "error",
  },
  {
    inputs: [],
    name: "RequestAlreadyPending",
    type: "error",
  },
  {
    inputs: [],
    name: "SourceNotOracleOfRequest",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferAndCallToOracleFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongCollateralUsdDecimals",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "contract ILiquidityPool",
            name: "pool",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isGnsToken0InLp",
            type: "bool",
          },
          {
            internalType: "enum IPriceAggregator.PoolType",
            name: "poolType",
            type: "uint8",
          },
          {
            internalType: "uint80",
            name: "__placeholder",
            type: "uint80",
          },
        ],
        indexed: false,
        internalType: "struct IPriceAggregator.LiquidityPoolInfo",
        name: "newValue",
        type: "tuple",
      },
    ],
    name: "CollateralGnsLiquidityPoolUpdated",
    type: "event",
    signature:
      "0x99c41cee576e40e5483818b59dcfd6e36841e5f9a9557e09779e0b4541f9de0e",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "value",
        type: "address",
      },
    ],
    name: "CollateralUsdPriceFeedUpdated",
    type: "event",
    signature:
      "0x272401831c29114837867a7463e326c1b024e3dd2f0f108dec76352011db4fea",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "jobId",
        type: "bytes32",
      },
    ],
    name: "JobIdUpdated",
    type: "event",
    signature:
      "0x764c19c693af0da42ec6c6bed68a2dd1a2fa93d24785fcfce58ffa29ae313606",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amountLink",
        type: "uint256",
      },
    ],
    name: "LinkClaimedBack",
    type: "event",
    signature:
      "0xc4fc8431efbe3edf6cca5a73401623d342a9fad5807bcb502d2efca245cb6ffd",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "id",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "callbackAddress",
            type: "address",
          },
          {
            internalType: "bytes4",
            name: "callbackFunctionId",
            type: "bytes4",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "bytes",
                name: "buf",
                type: "bytes",
              },
              {
                internalType: "uint256",
                name: "capacity",
                type: "uint256",
              },
            ],
            internalType: "struct BufferChainlink.buffer",
            name: "buf",
            type: "tuple",
          },
        ],
        indexed: false,
        internalType: "struct Chainlink.Request",
        name: "request",
        type: "tuple",
      },
    ],
    name: "LinkRequestCreated",
    type: "event",
    signature:
      "0x170ae993ffa82f60cce26e128cf75e11b7deba03fe29685e5881a76c8452765c",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "value",
        type: "address",
      },
    ],
    name: "LinkUsdPriceFeedUpdated",
    type: "event",
    signature:
      "0xca648bfe353681131df098ecd895a5ec41f502a93a1223aa1b77f67fc271f2a3",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "value",
        type: "uint8",
      },
    ],
    name: "MinAnswersUpdated",
    type: "event",
    signature:
      "0x6bc925491f55f56cb08a3ff41035fb0fdeae0cecc94f8e32e9b8ba2ad17fa7f9",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "value",
        type: "address",
      },
    ],
    name: "OracleAdded",
    type: "event",
    signature:
      "0xbf21de46ba0ce5e377db4224a7253064e85c704765b54881c2ad551a30a28d0b",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oldOracle",
        type: "address",
      },
    ],
    name: "OracleRemoved",
    type: "event",
    signature:
      "0x0adc4a8d7cd2f125c921a2f757c5c86749579208090d4fbb65c26bae90179ac0",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oldOracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOracle",
        type: "address",
      },
    ],
    name: "OracleReplaced",
    type: "event",
    signature:
      "0x36f00e7308d970ca7446a252b7a1dd9c9cb50ea4559b602e595fc53967ac9dd9",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "orderId",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "pairIndex",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "request",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceData",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isLookback",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "usedInMedian",
        type: "bool",
      },
    ],
    name: "PriceReceived",
    type: "event",
    signature:
      "0x1d01fcc0e82c93f463da710266800aff752bf7da2435090b30616276602eb75a",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pairIndex",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "tradeId",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct ITradingStorage.Id",
        name: "pendingOrderId",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "orderType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fromBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isLookback",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "job",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "linkFeePerNode",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nodesCount",
        type: "uint256",
      },
    ],
    name: "PriceRequested",
    type: "event",
    signature:
      "0x59fd16e7bbed6457d473d57a799cffde3ff43e27a3a87479a5a431b4801f754f",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint32",
                name: "index",
                type: "uint32",
              },
            ],
            internalType: "struct ITradingStorage.Id",
            name: "orderId",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "spreadP",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "price",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
        ],
        indexed: false,
        internalType: "struct ITradingCallbacks.AggregatorAnswer",
        name: "a",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "orderType",
        type: "uint8",
      },
    ],
    name: "TradingCallbackExecuted",
    type: "event",
    signature:
      "0x3c7b39f62241be54daf88ab94fbb4f3b7e92a2abb908f2d2b4ce3d14dadd5a4f",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "newValue",
        type: "uint32",
      },
    ],
    name: "TwapIntervalUpdated",
    type: "event",
    signature:
      "0xc99f383ecd620c333255bd2aef929eedd6808999bac9bfc5f53e10d876abf1ce",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_a",
        type: "address",
      },
    ],
    name: "addOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xdf5dd1a5",
  },
  {
    inputs: [],
    name: "claimBackLink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x6f37d263",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_priceData",
        type: "uint256",
      },
    ],
    name: "fulfill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x4357855e",
  },
  {
    inputs: [],
    name: "getChainlinkToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x165d35e1",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_normalizedValue",
        type: "uint256",
      },
    ],
    name: "getCollateralFromUsdNormalizedValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x36f6def7",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getCollateralGnsLiquidityPool",
    outputs: [
      {
        components: [
          {
            internalType: "contract ILiquidityPool",
            name: "pool",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isGnsToken0InLp",
            type: "bool",
          },
          {
            internalType: "enum IPriceAggregator.PoolType",
            name: "poolType",
            type: "uint8",
          },
          {
            internalType: "uint80",
            name: "__placeholder",
            type: "uint80",
          },
        ],
        internalType: "struct IPriceAggregator.LiquidityPoolInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x6a43c9ad",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getCollateralPriceUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xbbb4e3f9",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getCollateralUsdPriceFeed",
    outputs: [
      {
        internalType: "contract IChainlinkFeed",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x9641c1f5",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_collateral",
        type: "address",
      },
    ],
    name: "getGnsPriceCollateralAddress",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x1de109d2",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getGnsPriceCollateralIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa91fa361",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getGnsPriceUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x891e656c",
  },
  {
    inputs: [],
    name: "getLimitJobId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xf4b0664d",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_trader",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_positionSizeCollateral",
        type: "uint256",
      },
    ],
    name: "getLinkFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xde38f77c",
  },
  {
    inputs: [],
    name: "getLinkUsdPriceFeed",
    outputs: [
      {
        internalType: "contract IChainlinkFeed",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xb144bbf0",
  },
  {
    inputs: [],
    name: "getMarketJobId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x8e667ac8",
  },
  {
    inputs: [],
    name: "getMinAnswers",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x69b53230",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getOracle",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x10a9de60",
  },
  {
    inputs: [],
    name: "getOracles",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x40884c52",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
    ],
    name: "getPendingRequest",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x88b12d55",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_pairIndex",
        type: "uint16",
      },
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_tradeId",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_orderId",
        type: "tuple",
      },
      {
        internalType: "enum ITradingStorage.PendingOrderType",
        name: "_orderType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_positionSizeCollateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fromBlock",
        type: "uint256",
      },
    ],
    name: "getPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x7e156b8c",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
    ],
    name: "getPriceAggregatorOrder",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
          {
            internalType: "enum ITradingStorage.PendingOrderType",
            name: "orderType",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "pairIndex",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "isLookback",
            type: "bool",
          },
          {
            internalType: "uint32",
            name: "__placeholder",
            type: "uint32",
          },
        ],
        internalType: "struct IPriceAggregator.Order",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x7d0fcd1e",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct ITradingStorage.Id",
        name: "_orderId",
        type: "tuple",
      },
    ],
    name: "getPriceAggregatorOrderAnswers",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "open",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "high",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "low",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "ts",
            type: "uint64",
          },
        ],
        internalType: "struct IPriceAggregator.OrderAnswer[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x9f62038f",
  },
  {
    inputs: [],
    name: "getRequestCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x3fad1834",
  },
  {
    inputs: [],
    name: "getTwapInterval",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x3e742e3b",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_collateralValue",
        type: "uint256",
      },
    ],
    name: "getUsdNormalizedValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xbbad411a",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_linkToken",
        type: "address",
      },
      {
        internalType: "contract IChainlinkFeed",
        name: "_linkUsdPriceFeed",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "_twapInterval",
        type: "uint24",
      },
      {
        internalType: "uint8",
        name: "_minAnswers",
        type: "uint8",
      },
      {
        internalType: "address[]",
        name: "_nodes",
        type: "address[]",
      },
      {
        internalType: "bytes32[2]",
        name: "_jobIds",
        type: "bytes32[2]",
      },
      {
        internalType: "uint8[]",
        name: "_collateralIndices",
        type: "uint8[]",
      },
      {
        components: [
          {
            internalType: "contract ILiquidityPool",
            name: "pool",
            type: "address",
          },
          {
            internalType: "enum IPriceAggregator.PoolType",
            name: "poolType",
            type: "uint8",
          },
        ],
        internalType: "struct IPriceAggregator.LiquidityPoolInput[]",
        name: "_gnsCollateralLiquidityPools",
        type: "tuple[]",
      },
      {
        internalType: "contract IChainlinkFeed[]",
        name: "_collateralUsdPriceFeeds",
        type: "address[]",
      },
    ],
    name: "initializePriceAggregator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xf1dd8b66",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "removeOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x80935dbf",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_a",
        type: "address",
      },
    ],
    name: "replaceOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x25e589cd",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "setLimitJobId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xe0bb91c2",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_jobId",
        type: "bytes32",
      },
    ],
    name: "setMarketJobId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x85f276b8",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "contract ILiquidityPool",
            name: "pool",
            type: "address",
          },
          {
            internalType: "enum IPriceAggregator.PoolType",
            name: "poolType",
            type: "uint8",
          },
        ],
        internalType: "struct IPriceAggregator.LiquidityPoolInput",
        name: "_liquidityPoolInput",
        type: "tuple",
      },
    ],
    name: "updateCollateralGnsLiquidityPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x2caa6f8a",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "contract IChainlinkFeed",
        name: "_value",
        type: "address",
      },
    ],
    name: "updateCollateralUsdPriceFeed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc07d2844",
  },
  {
    inputs: [
      {
        internalType: "contract IChainlinkFeed",
        name: "_value",
        type: "address",
      },
    ],
    name: "updateLinkUsdPriceFeed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x5beda778",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_value",
        type: "uint8",
      },
    ],
    name: "updateMinAnswers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x44eb8ba6",
  },
  {
    inputs: [
      {
        internalType: "uint24",
        name: "_twapInterval",
        type: "uint24",
      },
    ],
    name: "updateTwapInterval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xb166a495",
  },
  {
    inputs: [],
    name: "InvalidShareSum",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "balanceCollateral",
        type: "uint256",
      },
    ],
    name: "OtcBalanceUpdated",
    type: "event",
    signature:
      "0x8d9467a44ee925421a7b8bcb0b7a92c4adc261c218b290e799b14630ac940b2a",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "gnsTreasury",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "treasuryShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "stakingShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "burnShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumP",
            type: "uint64",
          },
        ],
        indexed: false,
        internalType: "struct IOtc.OtcConfig",
        name: "config",
        type: "tuple",
      },
    ],
    name: "OtcConfigUpdated",
    type: "event",
    signature:
      "0x8b0fa5246ac429f9dd5a918b5407b1c7d0d2e21903d0a690b811e97cdb1fff80",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "collateralIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gnsPriceCollateral",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "treasuryAmountGns",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakingAmountGns",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "burnAmountGns",
        type: "uint256",
      },
    ],
    name: "OtcExecuted",
    type: "event",
    signature:
      "0x946f4776eb5a3c4119694bcd42c3ac90e75160db79b8009a9e7748ed7599d110",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_collateralAmount",
        type: "uint256",
      },
    ],
    name: "addOtcCollateralBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x11d8818d",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getOtcBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0x2b08f467",
  },
  {
    inputs: [],
    name: "getOtcConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "gnsTreasury",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "treasuryShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "stakingShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "burnShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumP",
            type: "uint64",
          },
        ],
        internalType: "struct IOtc.OtcConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xb79de3b3",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
    ],
    name: "getOtcRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    signature: "0xa98113e0",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "gnsTreasury",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "treasuryShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "stakingShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "burnShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumP",
            type: "uint64",
          },
        ],
        internalType: "struct IOtc.OtcConfig",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "initializeOtc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x92c02720",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_collateralIndex",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_collateralAmount",
        type: "uint256",
      },
    ],
    name: "sellGnsForCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x2b381b1e",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "gnsTreasury",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "treasuryShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "stakingShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "burnShareP",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumP",
            type: "uint64",
          },
        ],
        internalType: "struct IOtc.OtcConfig",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "updateOtcConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc4999547",
  },
];
