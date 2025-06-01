import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { toast } from 'react-toastify';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState('');

  // Kiểm tra MetaMask có được cài đặt không
  const checkMetaMask = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Kiểm tra trạng thái kết nối thực tế của ví
  const checkConnectionStatus = async () => {
    if (!checkMetaMask() || !web3) return false;
    try {
      const accounts = await web3.eth.getAccounts();
      return accounts.length > 0;
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái kết nối:', error);
      return false;
    }
  };

  // Kết nối ví MetaMask
  const connectWallet = async () => {
    if (!checkMetaMask()) {
      toast.error('Vui lòng cài đặt MetaMask để kết nối ví!', {
        position: 'top-right',
        autoClose: 2000,
      });
      return false;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Kiểm tra mạng (Sepolia Testnet)
      const chainId = await web3Instance.eth.getChainId();
      const desiredChainId = '0xaa36a7'; // Sepolia Testnet (11155111)
      if (chainId !== parseInt(desiredChainId, 16)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Testnet',
                    nativeCurrency: {
                      name: 'Sepolia ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                  },
                ],
              });
            } catch (addError) {
              toast.error('Không thể thêm mạng Sepolia Testnet. Vui lòng thêm thủ công trong MetaMask.', {
                position: 'top-right',
                autoClose: 2000,
              });
              return false;
            }
          } else {
            toast.error('Vui lòng chuyển sang mạng Sepolia Testnet trong MetaMask.', {
              position: 'top-right',
              autoClose: 2000,
            });
            return false;
          }
        }
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Instance.eth.getAccounts();

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        toast.success('Đã kết nối ví thành công!', {
          position: 'top-right',
          autoClose: 2000,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Lỗi khi kết nối ví:', error);
      // Không hiển thị lỗi ở đây, để hàm gọi xử lý
      return false;
    }
  };

  // Ngắt kết nối ví
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setWeb3(null);
    setBalance('');
    toast.info('Đã ngắt kết nối ví.', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  // Rút gọn địa chỉ ví
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Lấy số dư ví
  useEffect(() => {
    const fetchBalance = async () => {
      if (web3 && walletAddress) {
        try {
          const bal = await web3.eth.getBalance(walletAddress);
          setBalance(web3.utils.fromWei(bal, 'ether'));
        } catch (error) {
          console.error('Lỗi khi lấy số dư:', error);
        }
      }
    };
    fetchBalance();
  }, [web3, walletAddress]);

  // Kiểm tra trạng thái ví khi tải
  useEffect(() => {
    const checkIfConnected = async () => {
      if (checkMetaMask()) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra kết nối:', error);
        }
      }
    };
    checkIfConnected();
  }, []);

  // Lắng nghe thay đổi tài khoản hoặc mạng
  useEffect(() => {
    if (checkMetaMask()) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return () => {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        web3,
        balance,
        connectWallet,
        disconnectWallet,
        shortenAddress,
        checkConnectionStatus,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};