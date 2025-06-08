import Web3 from 'web3';

// Replace with your contract's address
const CONTRACT_ADDRESS = '0x4cC6E3C33B13A54C27dbf2Dd932bc940ad4fd77f';
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }

];

export const transferTicket = async (fromAddress, toAddress, tokenId) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const web3 = new Web3(window.ethereum);


    await window.ethereum.request({ method: 'eth_requestAccounts' });

  
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


    const tx = await contract.methods
      .transferFrom(fromAddress, toAddress, tokenId)
      .send({ from: fromAddress });

 
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: CONTRACT_ADDRESS,
            tokenId: tokenId,
          },
        },
      });
    } catch (watchError) {
      console.warn('Could not suggest NFT to wallet:', watchError);
    }

    return tx;
  } catch (error) {
    console.error('Transfer error:', error);
    throw error;
  }
};
