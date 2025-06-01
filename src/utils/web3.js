import Web3 from 'web3';

const EVENT_MANAGER_ADDRESS = '0x68697C799cA9A09b2896C246CBD614980b6C810E';

const eventManagerABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "uint256[]", "name": "ticketTypeIds", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "quantities", "type": "uint256[]" }
    ],
    "name": "buyMultipleTickets",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "uint256", "name": "ticketTypeId", "type": "uint256" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" }
    ],
    "name": "buyTickets",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "string[]", "name": "TicketNames", "type": "string[]" },
      { "internalType": "uint256[]", "name": "TicketPrices", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "TicketQuantities", "type": "uint256[]" },
      { "internalType": "string[]", "name": "MetadataURIs", "type": "string[]" }
    ],
    "name": "createEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "createTicketType",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "ticketNFTAddress", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "location", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "organizer", "type": "address" }
    ],
    "name": "EventCreated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "uint256", "name": "ticketTypeId", "type": "uint256" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" }
    ],
    "name": "mintTicketsForType",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_ticketNFT", "type": "address" }
    ],
    "name": "setTicketNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "totalprice", "type": "uint256" }
    ],
    "name": "TicketSold",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "events",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "address", "name": "organizer", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "eventTickets",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" }
    ],
    "name": "getEventDetails",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "address", "name": "organizer", "type": "address" }
        ],
        "internalType": "struct IEventManager.Event",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "ticketTypeCounters",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const initWeb3 = async (web3Instance) => {
  let web3;
  if (web3Instance) {
    web3 = web3Instance;
  } else if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    console.log('Please install MetaMask!');
    return null;
  }

  const networkId = await web3.eth.net.getId();
  const contract = new web3.eth.Contract(eventManagerABI, EVENT_MANAGER_ADDRESS);
  return { web3, contract };
};

export default initWeb3;