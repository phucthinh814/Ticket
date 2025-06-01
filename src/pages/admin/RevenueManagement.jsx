import React, { useState } from 'react';
import { revenueData } from '../../data/eventsData';
import { featuredEvents } from '../../data/eventsData';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueManagement = () => {
  const [selectedEvent, setSelectedEvent] = useState('all'); // 'all' or eventId
  const [timePeriod, setTimePeriod] = useState('daily'); // 'daily', 'monthly', 'yearly'

  // Aggregate revenue data
  const aggregateRevenue = () => {
    const filteredData = selectedEvent === 'all'
      ? revenueData
      : revenueData.filter(order => order.eventId === parseInt(selectedEvent));

    const groupedData = filteredData.reduce((acc, order) => {
      const date = new Date(order.purchaseDate);
      let key;
      if (timePeriod === 'daily') {
        key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } else if (timePeriod === 'monthly') {
        key = date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
      } else {
        key = date.getFullYear().toString();
      }

      acc[key] = (acc[key] || 0) + order.totalRevenue;
      return acc;
    }, {});

    const labels = Object.keys(groupedData).sort((a, b) => {
      if (timePeriod === 'daily') {
        return new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'));
      } else if (timePeriod === 'monthly') {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        return new Date(`${yearA}-${monthA}-01`) - new Date(`${yearB}-${monthB}-01`);
      }
      return a - b;
    });

    const data = labels.map(label => groupedData[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu (VND)',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Doanh thu ${selectedEvent === 'all' ? 'tất cả sự kiện' : featuredEvents.find(e => e.id === parseInt(selectedEvent))?.name} - ${timePeriod === 'daily' ? 'Theo ngày' : timePeriod === 'monthly' ? 'Theo tháng' : 'Theo năm'}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString('vi-VN')} VND`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString('vi-VN')} VND`,
        },
      },
    },
  };

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Quản lý doanh thu
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="text-black dark:text-white font-semibold mr-2">Sự kiện:</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="all">Tất cả sự kiện</option>
            {featuredEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-black dark:text-white font-semibold mr-2">Thời gian:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="daily">Theo ngày</option>
            <option value="monthly">Theo tháng</option>
            <option value="yearly">Theo năm</option>
          </select>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <Bar data={aggregateRevenue()} options={chartOptions} />
      </div>

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

export default RevenueManagement;