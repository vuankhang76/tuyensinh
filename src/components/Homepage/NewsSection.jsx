import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Tag, Button } from 'antd'
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons'

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: "Thông báo điều chỉnh phương án tuyển sinh 2025",
      excerpt: "Bộ GD&ĐT vừa có thông báo chính thức về việc điều chỉnh phương án tuyển sinh đại học năm 2025...",
      date: "2025-01-15",
      category: "Chính sách",
      views: 15420,
      image: "/images/news1.jpg",
      urgent: true
    },
    {
      id: 2,
      title: "HUST công bố thêm tổ hợp xét tuyển K01 mới",
      excerpt: "Đại học Bách khoa Hà Nội vừa công bố bổ sung tổ hợp K01 với công thức tính điểm mới...",
      date: "2025-01-12",
      category: "Trường đại học",
      views: 8940,
      image: "/images/news2.jpg",
      urgent: false
    },
    {
      id: 3,
      title: "Lịch thi đánh giá tư duy các trường năm 2025",
      excerpt: "Tổng hợp lịch thi đánh giá tư duy của các trường đại học hàng đầu trong năm 2025...",
      date: "2025-01-10",
      category: "Lịch thi",
      views: 12350,
      image: "/images/news3.jpg",
      urgent: false
    },
    {
      id: 4,
      title: "Học bổng du học 2025: Cơ hội và thách thức",
      excerpt: "Những chương trình học bổng du học mới nhất năm 2025 dành cho sinh viên Việt Nam...",
      date: "2025-01-08",
      category: "Học bổng",
      views: 6780,
      image: "/images/news4.jpg",
      urgent: false
    }
  ]

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Tin tức tuyển sinh
            </h2>
            <p className="text-gray-600">
              Cập nhật thông tin mới nhất về tuyển sinh đại học
            </p>
          </div>
          <Link to="/news">
            <Button type="primary">
              Xem tất cả tin tức
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main News */}
          <div className="space-y-5">
            {news.slice(0, 2).map((article) => (
              <div 
                key={article.id}
                className="bg-white rounded-lg p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Tag 
                    color={article.urgent ? 'red' : 'blue'}
                    className="rounded-full px-3 py-1"
                  >
                    {article.urgent ? 'KHẨN CẤP' : article.category}
                  </Tag>
                  <span className="text-sm text-gray-500 flex items-center">
                    <CalendarOutlined className="mr-1.5" />
                    {article.date}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center ml-auto">
                    <EyeOutlined className="mr-1.5" />
                    {article.views.toLocaleString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="mt-4 pt-3 border-t border-gray-50">
                  <span className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                    Đọc thêm →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Side News */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Tin tức khác
            </h3>
            <div className="!space-y-4">
              {news.slice(2).map((article) => (
                <Card key={article.id} size="small" className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <Tag color="blue" size="small">{article.category}</Tag>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {article.views.toLocaleString()} lượt xem
                    </span>
                    <Button type="link" size="small">
                      Xem
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsSection