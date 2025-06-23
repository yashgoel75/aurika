export const aurikaAbi = [
  { type: "fallback", stateMutability: "payable" },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "addOrder",
    inputs: [
      { name: "_date", type: "string", internalType: "string" },
      { name: "_time", type: "string", internalType: "string" },
      { name: "_isBuyOrder", type: "bool", internalType: "bool" },
      { name: "_quantity", type: "uint256", internalType: "uint256" },
      { name: "_avgPrice", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getOrders",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Aurika.Order[]",
        components: [
          { name: "date", type: "string", internalType: "string" },
          { name: "time", type: "string", internalType: "string" },
          { name: "isBuyOrder", type: "bool", internalType: "bool" },
          { name: "quantity", type: "uint256", internalType: "uint256" },
          { name: "avgPrice", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "users",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "invested", type: "uint256", internalType: "uint256" },
      { name: "quantity", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "OrderPlaced",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "isBuyOrder",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "quantity",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "avgPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "totalPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
];
