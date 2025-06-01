import 'react-toastify/dist/ReactToastify.css';
const AdminPage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 transition-all duration-300 rounded-lg shadow-md p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Chào mừng đến với Trang Quản trị
      </h2>
      <p className="text-gray-700 dark:text-gray-300 ">
        Chọn một mục từ sidebar để bắt đầu quản lý.
      </p>
    </div>
  );
};

export default AdminPage;