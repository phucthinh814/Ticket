import Web3 from 'web3';

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eventId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "ticketTypeIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "quantities",
        "type": "uint256[]"
      }
    ],
    "name": "buyMultipleTickets",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "eventId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalprice",
        "type": "uint256"
      }
    ],
    "name": "TicketSold",
    "type": "event"
  }
  // ... other ABI entries omitted for brevity
];

const contractAddress = '0x1F99Cc3fC0a464E7AAd21C822dcd7C5d6d7B7284';
const fallbackWalletAddress = '0x32Bd162c618Ce4a088A5E42F7E096FC279BFc5D6';
const privateKey = 'c790a27aa5265da5403bb42b8e9819cf270304f4f10881371e853a55ebba0313';

export const buyMultipleTickets = async (eventId, ticketTypeIds, quantities, totalPriceInWei, account, web3Instance) => {
  try {
    const web3 = web3Instance || new Web3('https://sepolia.infura.io/v3/3d0b1ec030e3476c9c0da33258249774');
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const fromAddress = account || fallbackWalletAddress;

    const tx = {
      from: fromAddress,
      to: contractAddress,
      value: totalPriceInWei,
      data: contract.methods
        .buyMultipleTickets(eventId, ticketTypeIds, quantities)
        .encodeABI(),
    };

    // Mô phỏng giao dịch để kiểm tra revert
    try {
      await contract.methods
        .buyMultipleTickets(eventId, ticketTypeIds, quantities)
        .call({ from: fromAddress, value: totalPriceInWei });
    } catch (callError) {
      console.error('Mô phỏng giao dịch thất bại:', callError);
      throw new Error(`Giao dịch sẽ thất bại: ${callError.message}`);
    }

    // Ước tính gas
    let gasLimit;
    gasLimit = 10000000; // Fallback
    tx.gas = gasLimit;

    // Lấy gas price
    const gasPrice = await web3.eth.getGasPrice();
    // console.log('Gas price:', web3.utils.fromWei(gasPrice, 'gwei'), 'Gwei');

    // Kiểm tra số dư ví
    const balance = await web3.eth.getBalance(fromAddress);
    const totalCost = BigInt(totalPriceInWei) + BigInt(gasPrice) * BigInt(gasLimit);
    // console.log('Số dư ví:', web3.utils.fromWei(balance, 'ether'), 'ETH');
    // console.log('Tổng chi phí:', web3.utils.fromWei(totalCost.toString(), 'ether'), 'ETH');

    if (BigInt(balance) < totalCost) {
      throw new Error(`Số dư ví không đủ. Cần ${web3.utils.fromWei(totalCost.toString(), 'ether')} ETH, hiện có ${web3.utils.fromWei(balance, 'ether')} ETH.`);
    }

    let receipt;
    if (account && typeof window !== 'undefined' && window.ethereum) {
      // console.log('Gửi giao dịch qua MetaMask từ:', fromAddress);
      receipt = await web3.eth.sendTransaction(tx);
    } else {
      console.log('Gửi giao dịch bằng private key từ:', fromAddress);
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }

    // Phân tích log để lấy tokenIds từ sự kiện Transfer (ERC721)
    const transferEventSignature = web3.utils.sha3('Transfer(address,address,uint256)');
    const tokenIds = receipt.logs
      .filter(log => log.topics[0] === transferEventSignature && log.topics[1] === web3.utils.padLeft(0, 64)) // from = address(0)
      .map(log => {
        const decodedLog = web3.eth.abi.decodeLog(
          [
            { type: 'address', name: 'from', indexed: true },
            { type: 'address', name: 'to', indexed: true },
            { type: 'uint256', name: 'tokenId', indexed: true }
          ],
          log.data,
          log.topics.slice(1)
        );
        return Number(decodedLog.tokenId);
      });

    // console.log('Token IDs mint:', tokenIds);

    return { ...receipt, tokenIds };
  } catch (error) {
    console.error('Error in buyMultipleTickets:', error);
    throw error;
  }
};