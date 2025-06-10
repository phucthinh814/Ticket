import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Sample ticket data with prices in ETH
const Tickets = [
  {
    id: "TCK001",
    eventName: "Hòa nhạc Sơn Tùng M-TP",
    ticketName: "VIP",
    price: 0.06, // Converted from 1,500,000 VND at ~25,000,000 VND/ETH
    purchaseDate: "2025-05-01",
    location: "Sân vận động Mỹ Đình, Hà Nội",
    eventDate: "2025-06-15",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "NFT001",
    status: "Chưa sử dụng",
    isListed: false,
    listingPrice: null,
  },
  {
    id: "TCK002",
    eventName: "Lễ hội âm nhạc EDM",
    ticketName: "Thường",
    price: 0.02, // Converted from 500,000 VND
    purchaseDate: "2025-04-20",
    location: "Quảng trường Ba Đình, Hà Nội",
    eventDate: "2025-07-10",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    tokenId: "NFT002",
    status: "Chưa sử dụng",
    isListed: true,
    listingPrice: 0.024,
  },
  {
    id: "TCK003",
    eventName: "Triển lãm nghệ thuật",
    ticketName: "Premium",
    price: 0.032, // Converted from 800,000 VND
    purchaseDate: "2025-03-15",
    location: "Bảo tàng Mỹ thuật TP.HCM",
    eventDate: "2025-06-20",
    walletAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    tokenId: "NFT003",
    status: "Đã sử dụng",
    isListed: false,
    listingPrice: null,
  },
  {
    id: "TCK004",
    eventName: "Hội chợ công nghệ",
    ticketName: "Standard",
    price: 0.012, // Converted from 300,000 VND
    purchaseDate: "2025-05-10",
    location: "SECC, TP.HCM",
    eventDate: "2025-08-05",
    walletAddress: "0x4567890abcdef1234567890abcdef1234567890",
    tokenId: "NFT004",
    status: "Chưa sử dụng",
    isListed: false,
    listingPrice: null,
  },
];

const MarketplaceTicketManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState(Tickets);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [sellPrice, setSellPrice] = useState("");
  const ticketsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  // Get tickets for the current page
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Pagination button class
  const getPageButtonClass = (number) => {
    return `px-3 py-1 mx-1 rounded-md transition-colors ${
      currentPage === number
        ? "bg-blue-500 text-white"
        : "bg-gray-300 text-black hover:bg-gray-400"
    }`.trim();
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format ETH price for display
  const formatETH = (price) => {
    return price ? `${Number(price).toFixed(6)} ETH` : "N/A";
  };

  // Handle sell ticket dialog open
  const handleSellTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setSellPrice("");
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTicketId(null);
    setSellPrice("");
  };

  // Handle confirm sell
  const handleConfirmSell = () => {
    const price = Number(sellPrice);
    if (price && price > 0) {
      setTickets(
        tickets.map((ticket) =>
          ticket.id === selectedTicketId
            ? { ...ticket, isListed: true, listingPrice: price }
            : ticket
        )
      );
      toast.success(`Vé ${selectedTicketId} đã được đăng bán với giá ${price.toFixed(6)} ETH`);
      handleDialogClose();
    } else {
      toast.error("Giá bán không hợp lệ!");
    }
  };

  // Handle cancel sale
  const handleCancelSale = (ticketId) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, isListed: false, listingPrice: null }
          : ticket
      )
    );
    toast.success(`Hủy bán vé ${ticketId} thành công!`);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Chợ vé của bạn
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Quản lý và bán vé của bạn trên Marketplace (thanh toán bằng ETH)
        </p>
      </div>

      {/* Desktop table */}
      <div className="md:block hidden">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">ID</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Sự kiện</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Loại vé</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Giá mua (ETH)</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Giá bán (ETH)</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ngày mua</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Địa điểm</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ngày sự kiện</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ví</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Token ID</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Trạng thái</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 text-black dark:text-white">{ticket.id}</td>
                <td className="px-4 py-2 text-black dark:text-white">{ticket.eventName}</td>
                <td className="px-4 py-2 text-black dark:text-white">{ticket.ticketName}</td>
                <td className="px-4 py-2 text-black dark:text-white">{formatETH(ticket.price)}</td>
                <td className="px-4 py-2 text-black dark:text-white">
                  {ticket.isListed ? formatETH(ticket.listingPrice) : "Chưa đăng bán"}
                </td>
                <td className="px-4 py-2 text-black dark:text-white">{formatDate(ticket.purchaseDate)}</td>
                <td className="px-4 py-2 text-black dark:text-white">{ticket.location}</td>
                <td className="px-4 py-2 text-black dark:text-white">{formatDate(ticket.eventDate)}</td>
                <td className="px-4 py-2 text-black dark:text-white">{formatAddress(ticket.walletAddress)}</td>
                <td className="px-4 py-2 text-black dark:text-white">{ticket.tokenId}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      ticket.status === "Chưa sử dụng"
                        ? "text-green-500"
                        : ticket.status === "Đã sử dụng"
                        ? "text-gray-500"
                        : "text-yellow-500"
                    }
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {ticket.status === "Chưa sử dụng" && (
                    ticket.isListed ? (
                      <button
                        onClick={() => handleCancelSale(ticket.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Hủy bán
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSellTicket(ticket.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Bán vé
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden block">
        {currentTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-b dark:border-gray-700"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">ID:</span>
                <span className="text-black dark:text-white">{ticket.id}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Sự kiện:</span>
                <span className="text-black dark:text-white">{ticket.eventName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Loại vé:</span>
                <span className="text-black dark:text-white">{ticket.ticketName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Giá mua:</span>
                <span className="text-black dark:text-white">{formatETH(ticket.price)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Giá bán:</span>
                <span className="text-black dark:text-white">
                  {ticket.isListed ? formatETH(ticket.listingPrice) : "Chưa đăng bán"}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Ngày mua:</span>
                <span className="text-black dark:text-white">{formatDate(ticket.purchaseDate)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Địa điểm:</span>
                <span className="text-black dark:text-white">{ticket.location}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Ngày sự kiện:</span>
                <span className="text-black dark:text-white">{formatDate(ticket.eventDate)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Ví:</span>
                <span className="text-black dark:text-white">{formatAddress(ticket.walletAddress)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Token ID:</span>
                <span className="text-black dark:text-white">{ticket.tokenId}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Trạng thái:</span>
                <span
                  className={
                    ticket.status === "Chưa sử dụng"
                      ? "text-green-500"
                      : ticket.status === "Đã sử dụng"
                      ? "text-gray-500"
                      : "text-yellow-500"
                  }
                >
                  {ticket.status}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Hành động:</span>
                {ticket.status === "Chưa sử dụng" && (
                  ticket.isListed ? (
                    <button
                      onClick={() => handleCancelSale(ticket.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Hủy bán
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSellTicket(ticket.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Bán vé
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6">
        <button
          onClick={handlePreviousPage}
          className="p-2 mx-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={getPageButtonClass(number)}
          >
            {number}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          className="p-2 mx-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      {/* Sell Ticket Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Đăng bán vé</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Giá bán (ETH)"
            type="number"
            fullWidth
            variant="outlined"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            InputProps={{ inputProps: { min: 0, step: "0.000001" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmSell}
            color="primary"
            disabled={!sellPrice || Number(sellPrice) <= 0}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MarketplaceTicketManagement;