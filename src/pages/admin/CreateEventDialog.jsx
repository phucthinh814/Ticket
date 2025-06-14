import React, { useState, useEffect, useRef } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import SimpleMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import debounce from 'lodash/debounce';

const CreateEventDialog = ({ isOpen, onClose, onEventCreated }) => {
  const [eventData, setEventData] = useState({
    organizer: { name: '', logo: null, description: '' },
    event: {
      name: '',
      location: '',
      description: '',
      image_url: null,
      dateStart: null,
      dateEnd: null,
    },
    ticketTypes: [],
  });
  const [ticketData, setTicketData] = useState({
    name: '',
    price: '',
    amount: '',
    metadataURI: '',
    image: null,
    benefits: [''],
  });
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState('');
  const [isCreatingNewOrganizer, setIsCreatingNewOrganizer] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [eventImagePreview, setEventImagePreview] = useState('');
  const [ticketImagePreview, setTicketImagePreview] = useState('');

  const simpleMdeRef = useRef(null);
  const textareaRef = useRef(null);

  // Get Pinata JWT from environment
  const pinataJwt = import.meta.env.VITE_PINATA_JWT;
  useEffect(() => {
    if (!pinataJwt) {
      console.error('Lỗi: VITE_PINATA_JWT không được định nghĩa trong .env.');
      setError('Cấu hình Pinata không hợp lệ. Vui lòng kiểm tra file .env.');
    }
  }, []);

  // Fetch organizers from API
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/organizers/list');
        setOrganizers(response.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách nhà tổ chức:', err);
        setError('Không thể lấy danh sách nhà tổ chức');
      }
    };
    fetchOrganizers();
  }, []);

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return moment.tz(date, 'Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ssZ');
  };

  // Handle file selection for logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Kích thước logo không được vượt quá 10MB');
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Chỉ hỗ trợ định dạng PNG, JPEG, hoặc JPG');
        return;
      }
      setEventData((prev) => ({
        ...prev,
        organizer: { ...prev.organizer, logo: file },
      }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle file selection for event image
  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Kích thước ảnh sự kiện không được vượt quá 10MB');
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Chỉ hỗ trợ định dạng PNG, JPEG, hoặc JPG');
        return;
      }
      setEventData((prev) => ({
        ...prev,
        event: { ...prev.event, image_url: file },
      }));
      setEventImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle file selection for event ticket
  const handleTicketImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Kích thước ảnh vé không được vượt quá 10MB');
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Chỉ hỗ trợ định dạng PNG, JPEG, hoặc JPG');
        return;
      }
      setTicketData({ ...ticketData, image: file });
      setTicketImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle organizer selection from combobox
  const handleOrganizerSelect = (e) => {
    const organizerId = e.target.value;
    setSelectedOrganizerId(organizerId);
    setIsCreatingNewOrganizer(false);
    if (organizerId) {
      const selectedOrg = organizers.find((org) => org.organizerId === parseInt(organizerId));
      if (selectedOrg) {
        setEventData((prev) => ({
          ...prev,
          organizer: {
            name: selectedOrg.name,
            logo: selectedOrg.logo, // Store URL instead of file
            description: selectedOrg.description,
          },
        }));
        setLogoPreview(selectedOrg.logo);
      }
    } else {
      setEventData((prev) => ({
        ...prev,
        organizer: { name: '', logo: null, description: '' },
      }));
      setLogoPreview('');
    }
  };

  // Handle "Create New Organizer" button click
  const handleCreateNewOrganizerClick = () => {
    setIsCreatingNewOrganizer(true);
    setSelectedOrganizerId('');
    setEventData((prev) => ({
      ...prev,
      organizer: { name: '', logo: null, description: '' },
    }));
    setLogoPreview('');
  };

  // Upload file and metadata to Pinata
  const uploadToPinata = async (file, metadata = {}) => {
    if (!file) return '';
    if (!pinataJwt) {
      throw new Error('VITE_PINATA_JWT không được định nghĩa');
    }
    try {
      console.log('Đang tải file lên Pinata:', {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      });

      const formData = new FormData();
      formData.append('file', file);
      const imageRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
      });
      const imageUrl = `https://blush-permanent-marten-312.mypinata.cloud/ipfs/${imageRes.data.IpfsHash}`;
      console.log('Tải file lên Pinata thành công:', imageUrl);

      if (Object.keys(metadata).length > 0) {
        metadata.image = imageUrl;
        const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
          },
        });
        const metadataUrl = `https://blush-permanent-marten-312.mypinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;
        console.log('Tải metadata lên Pinata thành công:', metadataUrl);
        return metadataUrl;
      }
      return imageUrl;
    } catch (error) {
      console.error('Lỗi tải lên Pinata:', error);
      throw new Error(`Tải lên Pinata thất bại: ${error.message}`);
    }
  };

  // Validate and add ticket
  const handleAddTicket = async () => {
    if (!ticketData.name || !ticketData.price || !ticketData.amount || !ticketData.image) {
      setError('Vui lòng điền đầy đủ thông tin vé và chọn hình ảnh');
      return;
    }

    const price = parseFloat(ticketData.price);
    const amount = parseInt(ticketData.amount, 10);

    if (isNaN(price) || price <= 0) {
      setError('Giá vé phải là số dương');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError('Số lượng vé phải là số nguyên dương');
      return;
    }

    try {
      const metadata = {
        name: ticketData.name,
        description: `Vé cho sự kiện ${eventData.event.name || 'Không xác định'}`,
        image: 'placeholder',
        attributes: ticketData.benefits
          .filter((benefit) => benefit.trim() !== '')
          .map((benefit, index) => ({
            trait_type: `Lợi ích ${index + 1}`,
            value: benefit,
          })),
      };

      const metadataURI = await uploadToPinata(ticketData.image, metadata);

      setEventData((prev) => ({
        ...prev,
        ticketTypes: [
          ...prev.ticketTypes,
          {
            name: ticketData.name,
            price: price.toString(),
            amount,
            metadataURI,
            image: ticketData.image,
            benefits: ticketData.benefits.filter((benefit) => benefit.trim() !== ''),
          },
        ],
      }));

      setTicketData({
        name: '',
        price: '',
        amount: '',
        metadataURI: '',
        image: null,
        benefits: [''],
      });
      setTicketImagePreview('');
      setIsTicketDialogOpen(false);
      setError('');
    } catch (error) {
      setError(`Lỗi khi thêm vé: ${error.message}`);
      toast.error(`Lỗi khi thêm vé: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle removing ticket
  const handleRemoveTicket = (index) => {
    setEventData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  // Handle updating benefit
  const handleUpdateBenefit = (index, benefitIndex, value) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[index].benefits[benefitIndex] = value;
    setEventData({ ...eventData, ticketTypes: updatedTickets });
  };

  const handleCancel = () => {
    setEventData({
      organizer: { name: '', logo: null, description: '' },
      event: {
        name: '',
        location: '',
        description: '',
        image_url: null,
        dateStart: null,
        dateEnd: null,
      },
      ticketTypes: [],
    });
    setTicketData({
      name: '',
      price: '',
      amount: '',
      metadataURI: '',
      image: null,
      benefits: [''],
    });
    setSelectedOrganizerId('');
    setIsCreatingNewOrganizer(false);
    setLogoPreview('');
    setEventImagePreview('');
    setTicketImagePreview('');
    setError('');
    if (simpleMdeRef.current) {
      simpleMdeRef.current.value('');
    }
    onClose();
  };

  // Handle saving event to API
  const handleSaveEvent = async () => {
    if (
      !eventData.organizer.name ||
      !eventData.event.name ||
      !eventData.event.location ||
      !eventData.event.dateStart ||
      !eventData.event.dateEnd ||
      !eventData.ticketTypes.length
    ) {
      setError('Vui lòng điền đầy đủ thông tin sự kiện và thêm ít nhất một loại vé');
      return;
    }

    const startDate = moment.tz(eventData.event.dateStart, 'Asia/Ho_Chi_Minh').toDate();
    const endDate = moment.tz(eventData.event.dateEnd, 'Asia/Ho_Chi_Minh').toDate();
    if (startDate > endDate) {
      setError('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc');
      toast.error('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      let logoUrl = '';
      let eventImageUrl = '';
      try {
        logoUrl = eventData.organizer.logo && typeof eventData.organizer.logo !== 'string'
          ? await uploadToPinata(eventData.organizer.logo)
          : eventData.organizer.logo || '';
        eventImageUrl = eventData.event.image_url ? await uploadToPinata(eventData.event.image_url) : '';
      } catch (uploadError) {
        console.warn('Tải ảnh lên Pinata thất bại, tiếp tục tạo sự kiện:', uploadError.message);
        toast.warn(`Tải ảnh thất bại: ${uploadError.message}. Sự kiện sẽ được tạo mà không có ảnh.`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }

      const payload = {
        organizer: {
          ...eventData.organizer,
          logo: logoUrl,
        },
        event: {
          ...eventData.event,
          image_url: eventImageUrl,
          dateStart: formatDate(eventData.event.dateStart),
          dateEnd: formatDate(eventData.event.dateEnd),
        },
        ticketTypes: eventData.ticketTypes.map((ticket) => ({
          name: ticket.name,
          price: ticket.price,
          amount: ticket.amount,
          metadataURI: ticket.metadataURI,
          benefits: ticket.benefits,
        })),
      };

      console.log('Payload gửi đến API:', JSON.stringify(payload, null, 2));
      await axios.post('http://localhost:8080/api/create_event', payload);

      toast.success('Sự kiện được tạo thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      onEventCreated(payload);
      handleCancel();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(`Không thể tạo sự kiện: ${errorMessage}`);
      toast.error(`Không thể tạo sự kiện: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateDates = (currentDate, isStartDate) => {
    const current = moment.tz(currentDate, 'Asia/Ho_Chi_Minh');
    if (isStartDate && eventData.event.dateEnd) {
      return true;
    }
    if (!isStartDate && eventData.event.dateStart) {
      const startDate = moment.tz(eventData.event.dateStart, 'Asia/Ho_Chi_Minh');
      return current.isSameOrAfter(startDate, 'day');
    }
    return true;
  };

  // Debounced update for SimpleMDE description
  const updateDescription = debounce((value) => {
    setEventData((prev) => ({
      ...prev,
      event: { ...prev.event, description: value },
    }));
  }, 300);

  // Initialize SimpleMDE for event description
  useEffect(() => {
    if (isOpen && textareaRef.current && !simpleMdeRef.current) {
      simpleMdeRef.current = new SimpleMDE({
        element: textareaRef.current,
        spellChecker: false,
        placeholder: 'Mô tả sự kiện (hỗ trợ Markdown)',
        status: false,
        toolbar: [
          'bold',
          'italic',
          'heading',
          '|',
          'quote',
          'unordered-list',
          'ordered-list',
          '|',
          'link',
          'image',
          '|',
          'preview',
          'side-by-side',
          'fullscreen',
        ],
      });

      simpleMdeRef.current.value(eventData.event.description || '');
      simpleMdeRef.current.codemirror.on('change', () => {
        updateDescription(simpleMdeRef.current.value());
      });
    }

    return () => {
      if (simpleMdeRef.current) {
        simpleMdeRef.current.toTextArea();
        simpleMdeRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <style>
        {`
          .editor-preview img,
          .CodeMirror-preview img {
            max-width: 100%;
            width: 500px;
            height: auto;
            display: block;
            margin: 0 auto;
          }
        `}
      </style>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Tạo sự kiện mới</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-2 text-black dark:text-white">Đang xử lý...</span>
          </div>
        )}
        <div className="space-y-4">
          {/* Organizer Information */}
          <h4 className="text-lg font-semibold text-black dark:text-white">Thông tin đơn vị tổ chức</h4>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <select
              value={selectedOrganizerId}
              onChange={handleOrganizerSelect}
              className="w-full sm:w-1/2 p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              disabled={isLoading}
            >
              <option value="">Chọn nhà tổ chức</option>
              {organizers.map((org) => (
                <option key={org.organizerId} value={org.organizerId}>
                  {org.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNewOrganizerClick}
              className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base disabled:opacity-50"
              disabled={isLoading}
            >
              Tạo nhà tổ chức mới
            </button>
          </div>
          {isCreatingNewOrganizer && (
            <>
              <input
                type="text"
                placeholder="Tên đơn vị tổ chức"
                value={eventData.organizer.name}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    organizer: { ...prev.organizer, name: e.target.value },
                  }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                disabled={isLoading}
              />
              <div className="flex flex-col space-y-2">
                <label className="text-black dark:text-white text-sm sm:text-base">Logo đơn vị tổ chức</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  disabled={isLoading}
                />
                {logoPreview && (
                  <img src={logoPreview} alt="Logo Preview" className="mt-2 h-24 w-24 object-cover rounded" />
                )}
              </div>
              <textarea
                placeholder="Mô tả đơn vị tổ chức"
                value={eventData.organizer.description}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    organizer: { ...prev.organizer, description: e.target.value },
                  }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                disabled={isLoading}
              />
            </>
          )}
          {selectedOrganizerId && !isCreatingNewOrganizer && (
            <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
              <h5 className="text-md font-semibold text-black dark:text-white">Thông tin nhà tổ chức đã chọn</h5>
              <p><strong>Tên:</strong> {eventData.organizer.name}</p>
              <p><strong>Mô tả:</strong> {eventData.organizer.description}</p>
              {logoPreview && (
                <img src={logoPreview} alt="Logo Preview" className="mt-2 h-24 w-24 object-cover rounded" />
              )}
            </div>
          )}

          {/* Event Information */}
          <h4 className="text-lg font-semibold text-black dark:text-white">Thông tin sự kiện</h4>
          <input
            type="text"
            placeholder="Tên sự kiện"
            value={eventData.event.name}
            onChange={(e) =>
              setEventData((prev) => ({
                ...prev,
                event: { ...prev.event, name: e.target.value },
              }))
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Địa điểm"
            value={eventData.event.location}
            onChange={(e) =>
              setEventData((prev) => ({
                ...prev,
                event: { ...prev.event, location: e.target.value },
              }))
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
            disabled={isLoading}
          />
          <div className="flex flex-col space-y-1">
            <label className="text-black dark:text-white text-sm sm:text-base">Mô tả sự kiện</label>
            <textarea
              ref={textareaRef}
              id="event-description"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              style={{ minHeight: '150px' }}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-black dark:text-white text-sm sm:text-base">Hình ảnh sự kiện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleEventImageChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              disabled={isLoading}
            />
            {eventImagePreview && (
              <img src={eventImagePreview} alt="Event Image Preview" className="mt-2 h-24 w-24 object-cover rounded" />
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-black dark:text-white text-sm sm:text-base">Thời gian bắt đầu</label>
            <Datetime
              value={eventData.event.dateStart ? moment.tz(eventData.event.dateStart, 'Asia/Ho_Chi_Minh').toDate() : null}
              onChange={(date) =>
                setEventData((prev) => ({
                  ...prev,
                  event: { ...prev.event, dateStart: moment.tz(date, 'Asia/Ho_Chi_Minh').toDate() },
                }))
              }
              isValidDate={(current) => validateDates(current, true)}
              dateFormat="DD/MM/YYYY"
              timeFormat="HH:mm"
              inputProps={{
                className: `w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                  eventData.event.dateStart &&
                  eventData.event.dateEnd &&
                  new Date(eventData.event.dateStart) > new Date(eventData.event.dateEnd)
                    ? 'border-red-500'
                    : ''
                }`,
                disabled: isLoading,
              }}
            />
            {eventData.event.dateStart &&
              eventData.event.dateEnd &&
              new Date(eventData.event.dateStart) > new Date(eventData.event.dateEnd) && (
                <p className="text-red-500 text-sm mt-1">Ngày bắt đầu phải trước hoặc bằng ngày kết thúc</p>
              )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-black dark:text-white text-sm sm:text-base">Thời gian kết thúc</label>
            <Datetime
              value={eventData.event.dateEnd ? moment.tz(eventData.event.dateEnd, 'Asia/Ho_Chi_Minh').toDate() : null}
              onChange={(date) =>
                setEventData((prev) => ({
                  ...prev,
                  event: { ...prev.event, dateEnd: moment.tz(date, 'Asia/Ho_Chi_Minh').toDate() },
                }))
              }
              isValidDate={(current) => validateDates(current, false)}
              dateFormat="DD/MM/YYYY"
              timeFormat="HH:mm"
              inputProps={{
                className: `w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                  eventData.event.dateStart &&
                  eventData.event.dateEnd &&
                  new Date(eventData.event.dateStart) > new Date(eventData.event.dateEnd)
                    ? 'border-red-500'
                    : ''
                }`,
                disabled: isLoading,
              }}
            />
            {eventData.event.dateStart &&
              eventData.event.dateEnd &&
              new Date(eventData.event.dateStart) > new Date(eventData.event.dateEnd) && (
                <p className="text-red-500 text-sm mt-1">Ngày kết thúc phải sau hoặc bằng ngày bắt đầu</p>
              )}
          </div>

          {/* Ticket Types */}
          <div>
            <h4 className="text-lg font-semibold text-black dark:text-white mb-2">Loại vé</h4>
            <button
              onClick={() => setIsTicketDialogOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 sm:text-base disabled:opacity-50"
              disabled={isLoading}
            >
              Thêm loại vé
            </button>
            {eventData.ticketTypes.length > 0 ? (
              eventData.ticketTypes.map((ticket, index) => (
                <div key={index} className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
                  <h5 className="text-md font-semibold text-black dark:text-white">Loại vé {index + 1}</h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Tên loại vé"
                      value={ticket.name}
                      onChange={(e) =>
                        setEventData((prev) => ({
                          ...prev,
                          ticketTypes: prev.ticketTypes.map((t, i) =>
                            i === index ? { ...t, name: e.target.value } : t
                          ),
                        }))
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Giá vé (ETH)"
                      value={ticket.price}
                      onChange={(e) =>
                        setEventData((prev) => ({
                          ...prev,
                          ticketTypes: prev.ticketTypes.map((t, i) =>
                            i === index ? { ...t, price: e.target.value } : t
                          ),
                        }))
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <input
                      type="number"
                      placeholder="Số lượng vé"
                      value={ticket.amount}
                      onChange={(e) =>
                        setEventData((prev) => ({
                          ...prev,
                          ticketTypes: prev.ticketTypes.map((t, i) =>
                            i === index ? { ...t, amount: parseInt(e.target.value) } : t
                          ),
                        }))
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col space-y-1">
                      <label className="text-black dark:text-white text-sm sm:text-base">Hình ảnh vé</label>
                      {ticket.image && (
                        <img
                          src={URL.createObjectURL(ticket.image)}
                          alt="Ticket Preview"
                          className="mt-2 h-24 w-24 object-cover rounded"
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="text-sm font-semibold text-black dark:text-white mb-1">Lợi ích</h6>
                      {ticket.benefits.map((benefit, benefitIndex) => (
                        <div
                          key={benefitIndex}
                          className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2"
                        >
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => handleUpdateBenefit(index, benefitIndex, e.target.value)}
                            className="w-full sm:w-auto flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                            disabled={isLoading}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRemoveTicket(index)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2 text-sm sm:text-base disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Xóa loại vé
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
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 text-sm sm:text-base disabled:opacity-50"
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            onClick={handleSaveEvent}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Đang Tạo...' : 'Tạo'}
          </button>
        </div>
      </div>

      {/* Ticket Dialog */}
      {isTicketDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h4 className="text-lg font-bold text-black dark:text-white mb-4">Thêm loại vé</h4>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên loại vé"
                value={ticketData.name}
                onChange={(e) => setTicketData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                disabled={isLoading}
              />
              <input
                type="number"
                step="0.001"
                placeholder="Giá vé (ETH)"
                value={ticketData.price}
                onChange={(e) => setTicketData((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                disabled={isLoading}
              />
              <input
                type="number"
                placeholder="Số lượng vé"
                value={ticketData.amount}
                onChange={(e) => setTicketData((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                disabled={isLoading}
              />
              <div className="flex flex-col space-y-1">
                <label className="text-black dark:text-white text-sm sm:text-base">Hình ảnh vé</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTicketImageChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  disabled={isLoading}
                />
                {ticketImagePreview && (
                  <img src={ticketImagePreview} alt="Ticket Image Preview" className="mt-2 h-24 w-24 object-cover rounded" />
                )}
              </div>
              <div>
                <h5 className="text-md font-semibold text-black dark:text-white mb-1">Lợi ích</h5>
                {ticketData.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2"
                  >
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...ticketData.benefits];
                        newBenefits[index] = e.target.value;
                        setTicketData((prev) => ({ ...prev, benefits: newBenefits }));
                      }}
                      className="w-full sm:w-auto flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => {
                        const newBenefits = ticketData.benefits.filter((_, i) => i !== index);
                        setTicketData((prev) => ({
                          ...prev,
                          benefits: newBenefits.length ? newBenefits : [''],
                        }));
                      }}
                      className="w-full sm:w-auto px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setTicketData((prev) => ({ ...prev, benefits: [...prev.benefits, ''] }))}
                  className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base disabled:opacity-50"
                  disabled={isLoading}
                >
                  Thêm lợi ích
                </button>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    setTicketData({
                      name: '',
                      price: '',
                      amount: '',
                      metadataURI: '',
                      image: null,
                      benefits: [''],
                    });
                    setTicketImagePreview('');
                    setError('');
                    setIsTicketDialogOpen(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 text-sm sm:text-base disabled:opacity-50"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddTicket}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base disabled:opacity-50"
                  disabled={isLoading}
                >
                  Tạo Loại Vé
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