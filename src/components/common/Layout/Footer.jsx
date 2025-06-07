import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import {
  FacebookOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import logo from '../../../assets/images/logo/logo_full.png'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto p-12">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 ">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="w-10 h-10" />
              </div>
              <div>
                <div className="font-bold text-xl">TuyenSinh.edu</div>
                <div className="text-sm text-gray-400">Thông tin tuyển sinh đại học</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Nền tảng cung cấp thông tin tuyển sinh đại học chính xác và cập nhật nhất tại Việt Nam.
            </p>
            <div className="flex space-x-3">
              <Button type="text" icon={<FacebookOutlined />} className="text-white hover:text-blue-500" />
              <Button type="text" icon={<YoutubeOutlined />} className="text-white hover:text-red-500" />
              <Button type="text" icon={<MailOutlined />} className="text-white hover:text-green-500" />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <EnvironmentOutlined className="mr-2" />
                Hà Nội, Việt Nam
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <PhoneOutlined className="mr-2" />
                1900 xxxx
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <MailOutlined className="mr-2" />
                contact@tuyensinh.edu.vn
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-6">
            <h4 className="font-medium mb-2">Đăng ký nhận tin</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-blue-500"
                size="large"
              />
              <Button type="primary" className="!rounded-l-none" size="large">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="text-sm text-gray-400">
              © 2025 TuyenSinh.edu. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer