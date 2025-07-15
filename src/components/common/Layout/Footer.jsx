import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import {
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
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
                <div className="text-sm text-muted-foreground">Thông tin tuyển sinh đại học</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Nền tảng cung cấp thông tin tuyển sinh đại học chính xác và cập nhật nhất tại Việt Nam.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                Hà Nội, Việt Nam
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                1900 xxxx
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                contact@tuyensinh.edu.vn
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-6">
            <h4 className="font-medium mb-2">Đăng ký nhận tin</h4>
            <div className="flex">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 bg-gray-800 border-gray-700 rounded-r-none"
              />
              <Button className="rounded-l-none h-10">
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
            <div className="text-sm text-muted-foreground">
              © 2025 TuyenSinh.edu. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer