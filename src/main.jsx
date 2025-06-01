import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'; // Adjust if you have a global CSS file
import router from './routes'; // Adjust the path to your router file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WalletProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        {/* <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // Có thể thay bằng "dark" hoặc "colored" nếu muốn
        /> */}
      </ThemeProvider>
    </WalletProvider>
  </React.StrictMode>
);