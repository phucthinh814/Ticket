import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { toast } from 'react-toastify';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState('');
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  // Kiểm tra MetaMask có được cài đặt không
  const checkMetaMask = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Kiểm tra trạng thái kết nối thực tế của ví
  const checkConnectionStatus = async () => {
    if (!checkMetaMask()) return false;
    try {
      const web3Instance = web3 || new Web3(window.ethereum);
      const accounts = await web3Instance.eth.getAccounts();
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

      // Kiểm tra mạng
      const chainId = await web3Instance.eth.getChainId();
      const desiredChainId = '0xaa36a7'; // Sepolia Testnet
      if (chainId !== parseInt(desiredChainId, 16)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            toast.error('Vui lòng thêm mạng Sepolia vào MetaMask!', {
              position: 'top-right',
              autoClose: 3000,
            });
            return false;
          }
          throw switchError;
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const wallet = accounts[0];
        setWalletAddress(wallet);
        setIsConnected(true);

        // Gửi địa chỉ ví tới API
        const response = await fetch('http://localhost:8080/api/connect-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: wallet }),
        });

        const data = await response.json();
        console.log('Phản hồi từ API:', data);

        if (data.token && data.role) {
          setRole(data.role);
          setToken(data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          toast.success('Đã kết nối ví thành công!', {
            position: 'top-right',
            autoClose: 2000,
          });
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Lỗi khi kết nối ví:', error);
      toast.error(`Lỗi kết nối ví: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
  };

  // Ngắt kết nối ví
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setWeb3(null);
    setBalance('');
    setRole(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
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
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
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

  // Xử lý sự kiện thay đổi tài khoản và mạng
  useEffect(() => {
    if (checkMetaMask()) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          const newWallet = accounts[0];
          setWalletAddress(newWallet);
          setIsConnected(true);

          try {
            const response = await fetch('http://localhost:8080/api/connect-wallet', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ walletId: newWallet }),
            });

            const data = await response.json();
            console.log('Phản hồi khi đổi ví:', data);

            if (data.token && data.role) {
              setRole(data.role);
              setToken(data.token);
              localStorage.setItem('token', data.token);
              localStorage.setItem('role', data.role);
              toast.success('Đã cập nhật ví thành công!', {
                position: 'top-right',
                autoClose: 2000,
              });
            } else {
              setRole(null);
              setToken(null);
              localStorage.removeItem('token');
              localStorage.removeItem('role');
            }
          } catch (error) {
            console.error('Lỗi khi gửi ví mới lên API:', error);
            toast.error('Lỗi khi cập nhật ví.', {
              position: 'top-right',
              autoClose: 3000,
            });
          }
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
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
        role,
        token,
        setRole,
        setToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};