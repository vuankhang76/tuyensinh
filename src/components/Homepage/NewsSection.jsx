import React from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Eye } from 'lucide-react'

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
            <Button>
              Xem tất cả tin tức
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main News */}
          <div className="space-y-5">
            {news.slice(0, 2).map((article) => (
              <Card
                key={article.id}
                className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle>
                  <div className="flex items-center gap-3 mb-1">
                    <Badge
                      variant={article.urgent ? 'destructive' : 'default'}
                      className="rounded-full px-3 py-1"
                    >
                      {article.urgent ? 'KHẨN CẤP' : article.category}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="mr-1.5 h-3 w-3" />
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 cursor-pointer">
                    Đọc thêm →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Side News */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Lịch thi đánh giá tư duy các trường năm 2025
            </h3>
            <div className="space-y-4">
              {news.slice(2).map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="mr-1.5 h-3 w-3" />
                        {article.date}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 leading-snug">
                      {article.title}
                    </h4>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between items-center">
                      <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 cursor-pointer">
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardFooter>
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