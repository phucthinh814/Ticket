import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import initWeb3 from '../../utils/web3'; // Adjust the path to your initWeb3 file
import axios from 'axios';
import { toast } from 'react-toastify'; // Import react-toastify

const CreateEventDialog = ({ isOpen, onClose }) => {
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    startTime: null,
    endTime: null,
    ticketTypes: [],
    image: null, // Ensure image is included in initial state
  });
  const [ticketData, setTicketData] = useState({
    name: '',
    price: '',
    quantity: '',
    image: null,
    benefits: [''],
  });
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');

  // Initialize Web3 and contract
  useEffect(() => {
    const initialize = async () => {
      try {
        const { web3, contract } = await initWeb3();
        if (web3 && contract) {
          setWeb3(web3);
          setContract(contract);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);
        } else {
          setError('Không thể khởi tạo Web3. Vui lòng kiểm tra MetaMask.');
        }
      } catch (err) {
        setError('Lỗi khởi tạo Web3: ' + err.message);
      }
    };
    initialize();
  }, []);

  // Debug ticketTypes state
  useEffect(() => {
    console.log('eventData.ticketTypes:', eventData.ticketTypes);
  }, [eventData.ticketTypes]);

  // Pinata configuration
  const pinataApiKey = 'b869ac476033c582beb1';
  const pinataSecretApiKey = 'ef378aca287179d1fc486b43ae3f451ee92759f2885273f62228f72e77332496';
  const pinataJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzczNTlmOC05OWVjLTQyMjYtODNkMy0zNWQwM2YwOTdjYjUiLCJlbWFpbCI6Im5ndXllbnRyYW5waHVjdGhpbmg5MTUwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiODY5YWM0NzYwMzNjNTgyYmViMSIsInNjb3BlZEtleVNlY3JldCI6ImVmMzc4YWNhMjg3MTc5ZDFmYzQ4NmI0M2FlM2Y0NTFlZTkyNzU5ZjI4ODUyNzNmNjIyMjhmNzJlNzczMzI0OTYiLCJleHAiOjE3Nzg4NTY1NDB9.JFBpUtgXHHBuszzUjw35Pi3c6imJFiPRKyevrwvPxnQ';

  // Upload image and metadata to Pinata
  const uploadToPinata = async (file, metadata) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const imageRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = `ipfs://${imageRes.data.IpfsHash}`;

      metadata.image = imageUrl;
      const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
          'Content-Type': 'application/json',
        },
      });
      return `ipfs://${metadataRes.data.IpfsHash}`;
    } catch (error) {
      console.error('Lỗi tải lên Pinata:', error);
      throw new Error('Không thể tải lên Pinata');
    }
  };

  // Add ticket from dialog
  const handleAddTicketFromDialog = async () => {
    if (!ticketData.name || !ticketData.price || !ticketData.quantity || !ticketData.image) {
      setError('Vui lòng điền đầy đủ thông tin vé');
      return;
    }

    try {
      const metadata = {
        name: ticketData.name,
        description: `Vé cho sự kiện ${eventData.name || 'Không xác định'}`,
        image: 'ipfs://placeholder',
        attributes: ticketData.benefits
          .filter((benefit) => benefit.trim() !== '')
          .map((benefit, index) => ({
            trait_type: `Lợi ích ${index + 1}`,
            value: benefit,
          })),
      };

      const metadataURI = await uploadToPinata(ticketData.image, metadata);

      const newTicket = {
        name: ticketData.name,
        price: web3 ? web3.utils.toWei(ticketData.price, 'ether') : ticketData.price,
        quantity: parseInt(ticketData.quantity),
        metadataURI,
        image: ticketData.image,
        benefits: ticketData.benefits.filter((benefit) => benefit.trim() !== ''),
      };

      setEventData((prev) => ({
        ...prev,
        ticketTypes: prev.ticketTypes ? [...prev.ticketTypes, newTicket] : [newTicket],
      }));

      setTicketData({
        name: '',
        price: '',
        quantity: '',
        image: null,
        benefits: [''],
      });
      setIsTicketDialogOpen(false);
      setError('');
    } catch (error) {
      setError('Lỗi khi thêm vé: ' + error.message);
    }
  };

  // Remove ticket
  const handleRemoveTicket = (index) => {
    setEventData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  // Update ticket information
  const handleUpdateTicket = (index, field, value) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === 'price' && web3 ? web3.utils.toWei(value, 'ether') : value,
    };
    setEventData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }));
  };

  // Update benefit
  const handleUpdateBenefit = (ticketIndex, benefitIndex, value) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[ticketIndex].benefits[benefitIndex] = value;
    setEventData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }));
  };

  // Add benefit
  const handleAddBenefit = (ticketIndex) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[ticketIndex].benefits = [...updatedTickets[ticketIndex].benefits, ''];
    setEventData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }));
  };

  // Remove benefit
  const handleRemoveBenefit = (ticketIndex, benefitIndex) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[ticketIndex].benefits = updatedTickets[ticketIndex].benefits.filter((_, i) => i !== benefitIndex);
    setEventData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }));
  };

  // Save event to smart contract
  const handleSaveEvent = async () => {
    if (!web3 || !contract || !accounts.length) {
      setError('Web3 chưa được khởi tạo hoặc chưa kết nối ví');
      return;
    }

    if (!eventData.name || !eventData.location || !eventData.startTime || !eventData.endTime || !eventData.ticketTypes.length) {
      setError('Vui lòng điền đầy đủ thông tin sự kiện và thêm ít nhất một loại vé');
      return;
    }

    try {
      const ticketNames = eventData.ticketTypes.map((ticket) => ticket.name);
      const ticketPrices = eventData.ticketTypes.map((ticket) => ticket.price);
      const ticketQuantities = eventData.ticketTypes.map((ticket) => ticket.quantity);
      const metadataURIs = eventData.ticketTypes.map((ticket) => ticket.metadataURI);

      await contract.methods
        .createEvent(
          eventData.name,
          eventData.location,
          Math.floor(eventData.startTime.getTime() / 1000),
          Math.floor(eventData.endTime.getTime() / 1000),
          ticketNames,
          ticketPrices,
          ticketQuantities,
          metadataURIs
        )
        .send({ from: accounts[0] });

      // Show success toast
      toast.success('Sự kiện được tạo thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setEventData({
        name: '',
        location: '',
        startTime: null,
        endTime: null,
        ticketTypes: [],
        image: null,
      });
      setError('');
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
      setError('Không thể tạo sự kiện trên blockchain: ' + error.message);
    }
  };

  // Upload event image
  const handleEventImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData((prev) => ({ ...prev, image: file }));
    }
  };

  // Upload ticket image
  const handleTicketImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTicketData((prev) => ({ ...prev, image: file }));
    }
  };

  // Update ticket image
  const handleUpdateTicketImage = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedTickets = [...eventData.ticketTypes];
      updatedTickets[index] = { ...updatedTickets[index], image: file };
      setEventData((prev) => ({
        ...prev,
        ticketTypes: updatedTickets,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Tạo sự kiện mới</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên sự kiện"
            value={eventData.name}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="Địa điểm"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
          <div className="flex flex-col space-y-1">
            <label className="text-black dark:text-white text-sm sm:text-base">Thời gian bắt đầu</label>
            <Datetime
              value={eventData.startTime}
              onChange={(date) => setEventData({ ...eventData, startTime: date.toDate() })}
              inputProps={{
                className: 'w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base',
              }}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-black dark:text-white text-sm sm:text-base">Thời gian kết thúc</label>
            <Datetime
              value={eventData.endTime}
              onChange={(date) => setEventData({ ...eventData, endTime: date.toDate() })}
              inputProps={{
                className: 'w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base',
              }}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-black dark:text-white text-sm sm:text-base">Hình ảnh sự kiện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleEventImageUpload}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {eventData.image ? eventData.image.name : 'Chưa chọn file'}
            </p>
            {eventData.image && (
              <img
                src={URL.createObjectURL(eventData.image)}
                alt="Event preview"
                className="w-24 h-24 object-cover mt-2"
              />
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-black dark:text-white mb-2">Loại vé</h4>
            <button
              onClick={() => setIsTicketDialogOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 text-sm sm:text-base"
            >
              Tạo loại vé
            </button>

            {eventData.ticketTypes && eventData.ticketTypes.length > 0 ? (
              eventData.ticketTypes.map((ticket, index) => (
                <div key={index} className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
                  <h5 className="text-md font-semibold text-black dark:text-white">Vé {index + 1}</h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Tên loại vé"
                      value={ticket.name || ''}
                      onChange={(e) => handleUpdateTicket(index, 'name', e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    />
                    <input
                      type="number"
                      placeholder="Giá vé (ETH)"
                      value={web3 && ticket.price ? web3.utils.fromWei(ticket.price, 'ether') : ticket.price || ''}
                      onChange={(e) => handleUpdateTicket(index, 'price', e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    />
                    <input
                      type="number"
                      placeholder="Số lượng vé"
                      value={ticket.quantity || ''}
                      onChange={(e) => handleUpdateTicket(index, 'quantity', parseInt(e.target.value))}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    />
                    <div className="flex flex-col space-y-1">
                      <label className="text-black dark:text-white text-sm sm:text-base">Hình ảnh vé</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpdateTicketImage(index, e)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ticket.image ? ticket.image.name : 'Chưa chọn file'}
                      </p>
                      {ticket.image && (
                        <img
                          src={URL.createObjectURL(ticket.image)}
                          alt="Ticket preview"
                          className="w-24 h-24 object-cover mt-2"
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="text-sm font-semibold text-black dark:text-white mb-1">Lợi ích</h6>
                      {(ticket.benefits || []).map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                          <input
                            type="text"
                            value={benefit || ''}
                            onChange={(e) => handleUpdateBenefit(index, benefitIndex, e.target.value)}
                            className="w-full sm:w-auto flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                          />
                          <button
                            onClick={() => handleRemoveBenefit(index, benefitIndex)}
                            className="w-full sm:w-auto px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddBenefit(index)}
                        className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
                      >
                        Thêm lợi ích
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveTicket(index)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2 text-sm sm:text-base"
                    >
                      Xóa vé
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-2">Chưa có loại vé nào</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 text-sm sm:text-base"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveEvent}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base"
          >
            Lưu
          </button>
        </div>
      </div>

      {isTicketDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h4 className="text-lg font-bold text-black dark:text-white mb-4">Quản lý loại vé</h4>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên loại vé"
                value={ticketData.name}
                onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
              <input
                type="number"
                placeholder="Giá vé (ETH)"
                value={ticketData.price}
                onChange={(e) => setTicketData({ ...ticketData, price: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
              <input
                type="number"
                placeholder="Số lượng vé"
                value={ticketData.quantity}
                onChange={(e) => setTicketData({ ...ticketData, quantity: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
              <div className="flex flex-col space-y-1">
                <label className="text-black dark:text-white text-sm sm:text-base">Hình ảnh vé</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTicketImageUpload}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {ticketData.image ? ticketData.image.name : 'Chưa chọn file'}
                </p>
                {ticketData.image && (
                  <img
                    src={URL.createObjectURL(ticketData.image)}
                    alt="Ticket preview"
                    className="w-24 h-24 object-cover mt-2"
                  />
                )}
              </div>
              <div>
                <h5 className="text-md font-semibold text-black dark:text-white mb-1">Lợi ích</h5>
                {ticketData.benefits.map((benefit, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...ticketData.benefits];
                        newBenefits[index] = e.target.value;
                        setTicketData({ ...ticketData, benefits: newBenefits });
                      }}
                      className="w-full sm:w-auto flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                    />
                    <button
                      onClick={() => {
                        const newBenefits = ticketData.benefits.filter((_, i) => i !== index);
                        setTicketData({ ...ticketData, benefits: newBenefits.length ? newBenefits : [''] });
                      }}
                      className="w-full sm:w-auto px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setTicketData({ ...ticketData, benefits: [...ticketData.benefits, ''] })}
                  className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
                >
                  Thêm lợi ích
                </button>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setIsTicketDialogOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 text-sm sm:text-base"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddTicketFromDialog}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base"
                >
                  Thêm vé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEventDialog;