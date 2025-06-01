import React, { useState } from 'react';
import { ticketTypeData } from '../../data/eventsData';
import { featuredEvents } from '../../data/eventsData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

const TicketTypeManagement = () => {
  // Khởi tạo trạng thái cho trang hiện tại, dialog, danh sách loại vé, sự kiện được chọn và loại vé mới
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ticketTypes, setTicketTypes] = useState(ticketTypeData);
  const [selectedEvent, setSelectedEvent] = useState('all'); // 'all' hoặc eventId
  const [newTicketType, setNewTicketType] = useState({
    eventId: '',
    name: '',
    price: '',
    amount: '',
    metadataURI: '',
  });
  const ticketsPerPage = 4; // Số loại vé mỗi trang

  // Lọc loại vé dựa trên sự kiện được chọn
  const filteredTicketTypes = selectedEvent === 'all'
    ? ticketTypes
    : ticketTypes.filter((ticketType) => ticketType.eventId === parseInt(selectedEvent));

  // Tính tổng số trang dựa trên số loại vé đã lọc
  const totalPages = Math.ceil(filteredTicketTypes.length / ticketsPerPage);

  // Lấy danh sách loại vé cho trang hiện tại
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTicketTypes = filteredTicketTypes.slice(indexOfFirstTicket, indexOfLastTicket);

  // Xử lý chuyển đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Chuyển sang trang trước
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Chuyển sang trang sau
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Xử lý thay đổi sự kiện được chọn
  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
    setCurrentPage(1); // Đặt lại về trang đầu khi thay đổi sự kiện
  };

  // Tạo danh sách số trang
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Mở dialog tạo loại vé mới
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // Đóng dialog và đặt lại form
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewTicketType({ eventId: '', name: '', price: '', amount: '', metadataURI: '' });
  };

  // Xử lý thay đổi giá trị trong form dialog
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicketType((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý tạo loại vé mới
  const handleCreateTicketType = () => {
    // Kiểm tra các trường bắt buộc
    if (!newTicketType.eventId || !newTicketType.name || !newTicketType.price || !newTicketType.amount) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Kiểm tra sự kiện có tồn tại
    const event = featuredEvents.find((e) => e.id === parseInt(newTicketType.eventId));
    if (!event) {
      toast.error('Sự kiện không tồn tại!');
      return;
    }

    // Tạo đối tượng loại vé mới
    const newType = {
      ticketTypeId: ticketTypes.length + 1,
      eventId: parseInt(newTicketType.eventId),
      eventName: event.name,
      name: newTicketType.name,
      price: parseFloat(newTicketType.price),
      amount: parseInt(newTicketType.amount),
      remainingAmount: parseInt(newTicketType.amount),
      metadataURI: newTicketType.metadataURI || `https://example.com/metadata/${newTicketType.name.toLowerCase().replace(/\s/g, '-')}.json`,
    };

    // Cập nhật danh sách loại vé
    setTicketTypes((prev) => [...prev, newType]);
    setCurrentPage(1); // Đặt lại về trang đầu
    handleCloseDialog();
    toast.success('Loại vé đã được tạo thành công!');
  };

  // Tạo lớp CSS cho nút phân trang
  const getPageButtonClass = (number) => {
    return `px-3 py-1 mx-1 rounded-md transition-colors ${
      currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'
    }`.trim();
  };

  return (
    <div className="p-6 mx-auto">
      {/* Tiêu đề và bộ lọc sự kiện */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Quản lý loại vé
        </h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Combobox chọn sự kiện */}
          <TextField
            select
            label="Chọn sự kiện"
            value={selectedEvent}
            onChange={handleEventChange}
            className="w-full sm:w-64 bg-white dark:bg-gray-800"
            size="small"
            InputProps={{
              className: 'text-black dark:text-white',
            }}
            InputLabelProps={{
              className: 'text-black dark:text-white',
            }}
          >
            <MenuItem value="all">Tất cả sự kiện</MenuItem>
            {featuredEvents.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name}
              </MenuItem>
            ))}
          </TextField>
          {/* Nút tạo loại vé */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleOpenDialog}
          >
            Tạo loại vé
          </button>
        </div>
      </div>

      {/* Bảng cho giao diện desktop */}
      <div className="md:block hidden">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">ID</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Sự kiện</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Tên loại vé</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Giá</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Tổng số vé</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Vé còn lại</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Metadata URI</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentTicketTypes.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center text-black dark:text-white">
                  Không có loại vé nào cho sự kiện này.
                </td>
              </tr>
            ) : (
              currentTicketTypes.map((ticketType) => (
                <tr key={ticketType.ticketTypeId} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-1 text-black dark:text-white">{ticketType.ticketTypeId}</td>
                  <td className="px-4 py-1 text-black dark:text-white">{ticketType.eventName}</td>
                  <td className="px-4 py-1 text-black dark:text-white">{ticketType.name}</td>
                  <td className="px-4 py-1 text-black dark:text-white">{ticketType.price.toLocaleString('en-US')}</td>
                  <td className="px-4 py-1 text-black dark:text-white">{ticketType.amount}</td>
                  <td className="px-4 py-1 text-black dark:text-white">{ticketType.remainingAmount}</td>
                  <td className="px-4 py-1 text-black dark:text-white truncate max-w-xs">{ticketType.metadataURI}</td>
                  <td className="px-4 py-1">
                    <span className={ticketType.remainingAmount > 0 ? 'text-green-600' : 'text-red-600'}>
                      {ticketType.remainingAmount > 0 ? 'Còn Vé' : 'Hết Vé'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Giao diện cho mobile */}
      <div className="md:hidden block">
        {currentTicketTypes.length === 0 ? (
          <p className="text-center text-black dark:text-white py-4">Không có loại vé nào cho sự kiện này.</p>
        ) : (
          currentTicketTypes.map((ticketType) => (
            <div
              key={ticketType.ticketTypeId}
              className="mb-4 p-2 bg-white rounded-lg shadow-md border-b border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col space-y-1">
                <div className="flex">
                  <span className="font-semibold text-black w-28">ID:</span>
                  <span className="text-black">{ticketType.ticketTypeId}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-black w-28">Sự kiện:</span>
                  <span className="text-black">{ticketType.eventName}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-black w-28">Loại Vé:</span>
                  <span className="text-black">{ticketType.name}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-black w-28">Giá:</span>
                  <span className="text-black">{ticketType.price.toLocaleString('en-US')} VND</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-black w-28">Tổng Số Vé:</span>
                  <span className="text-black">{ticketType.amount}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-black w-28">Vé Còn Lại:</span>
                  <span className="text-black">{ticketType.remainingAmount}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-black w-28">Metadata URI:</span>
                  <span className="text-black truncate">{ticketType.metadataURI}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-black w-28">Status:</span>
                  <span className={ticketType.remainingAmount > 0 ? 'text-green-600' : 'text-red-600'}>
                    {ticketType.remainingAmount > 0 ? 'Còn Vé' : 'Hết Vé'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      {filteredTicketTypes.length > 0 && (
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
      )}

      {/* Dialog tạo loại vé mới */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Tạo Loại Vé Mới</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Sự kiện"
            name="eventId"
            value={newTicketType.eventId}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          >
            {featuredEvents.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Tên Loại Vé"
            name="name"
            value={newTicketType.name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Giá (VND)"
            name="price"
            type="number"
            value={newTicketType.price}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Số Lượng"
            name="amount"
            type="number"
            value={newTicketType.amount}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Metadata URI"
            name="metadataURI"
            value={newTicketType.metadataURI}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleCreateTicketType} color="primary">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo Toast */}
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

export default TicketTypeManagement;