import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaSpotify } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#2b2f42] text-white text-sm px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Contact */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-2">Hotline</h4>
          <p>Thứ 2 - Chủ Nhật (8:30 - 23:00)</p>
          <p className="text-green-400 font-bold mb-4">1900.6408</p>

          <h4 className="font-semibold">Email</h4>
          <p className="mb-4">support@NFTTicket.vn</p>

          <h4 className="font-semibold">Văn phòng</h4>
          <p> Số 22, 232 Cao Lỗ phường 4 quận 8 TP.HCM </p>
        </div>

        {/* Links */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-2">Dành cho Khách hàng</h4>
          <p className="mb-2">Điều khoản sử dụng</p>

          <h4 className="font-semibold mt-4 mb-2">Dành cho Ban Tổ chức</h4>
          <p>Điều khoản sử dụng</p>
        </div>

        {/* Social */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-2">Follow us</h4>
          <div className="flex justify-center md:justify-start gap-4 text-lg mb-4">
            <FaFacebookF />
            <FaInstagram />
            <FaTiktok />
            <FaSpotify />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-xs text-gray-300">
        <p>© 2025 NFTTicket</p>
      </div>
    </footer>
  );
};

export default Footer;
