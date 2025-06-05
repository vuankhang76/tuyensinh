import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Tag, Button } from 'antd'
import { 
  EnvironmentOutlined, 
  TrophyOutlined, 
  UserOutlined,
  DollarCircleOutlined,
  BookOutlined,
  HeartOutlined
} from '@ant-design/icons'

const FeaturedUniversities = ({ universities }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Trường đại học nổi bật
          </h2>
          <p className="text-gray-600 text-lg">
            Những trường đại học hàng đầu Việt Nam được quan tâm nhiều nhất
          </p>
        </div>

        <div className="!space-y-3">
          {universities.map((university, index) => (
            <Card 
              key={university.id}
              className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-center p-2">
                {/* Logo Section */}
                <div className="mr-6">
                  <div className="w-24 h-24 bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={university.logo || `/api/placeholder/80/80`} 
                      alt={`${university.name} logo`}
                      className="w-24 h-24 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-24 h-24 bg-blue-50 rounded-lg flex items-center justify-center hidden">
                      <span className="text-blue-600 font-bold text-lg">{university.code}</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* University Info */}
                    <div className="flex-1 lg:pr-6">
                      {/* Header */}
                      <div className="mb-3">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-800 truncate mr-1">
                            {university.name} ({university.code})
                          </h3>
                          <Tag color="blue">{university.type}</Tag>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-1 mb-2">
                          {university.description}
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex flex-wrap gap-8 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <EnvironmentOutlined className="text-blue-500 mr-1" />
                          <span>{university.location}</span>
                        </div>
                        <div className="flex items-center">
                          <TrophyOutlined className="text-yellow-500 mr-1" />
                          <span>Điểm chuẩn: {university.minScore}+</span>
                        </div>
                        <div className="flex items-center">
                          <UserOutlined className="text-green-500 mr-1" />
                          <span>{university.students?.toLocaleString()} sinh viên</span>
                        </div>
                        <div className="flex items-center">
                          <DollarCircleOutlined className="text-purple-500 mr-1" />
                          <span>{university.tuition?.split(' ')[0]}tr/năm</span>
                        </div>
                      </div>

                      {/* Major Tags */}
                      <div className="flex items-center gap-2 mb-2 lg:mb-0">
                        <BookOutlined className="text-blue-500 text-sm" />
                        <div className="flex flex-wrap gap-1">
                          {university.majors.slice(0, 3).map((major, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                            >
                              {major}
                            </span>
                          ))}
                          {university.majors.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                              +{university.majors.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="flex-shrink-0 flex items-center gap-3 mt-4 lg:mt-0">
                      {/* Interest Button */}
                      <button className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-red-500 transition-colors">
                        <HeartOutlined />
                        <span className="text-sm">{Math.floor(Math.random() * 999) + 100}</span>
                      </button>
                      
                      {/* Compare Button */}
                      <Button size="middle" className="px-4">
                        So sánh
                      </Button>
                      
                      {/* View Details Button */}
                      <Link to={`/university/${university.slug}`}>
                        <Button 
                          type="primary" 
                          size="middle"
                          className="px-6 font-medium"
                        >
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/search">
            <Button 
              type="primary" 
              size="large"
              className="h-12 px-8 font-medium"
            >
              Khám phá tất cả trường đại học →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedUniversities