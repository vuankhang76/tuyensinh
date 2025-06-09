import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Tag, Button } from 'antd'
import { 
  EnvironmentOutlined, 
  TrophyOutlined, 
  UserOutlined,
  DollarCircleOutlined,
  HeartOutlined,
  BookOutlined
} from '@ant-design/icons'

const UniversityCard = ({ university }) => {
  const [isFavorited, setIsFavorited] = useState(false)

  const getTypeColor = (type) => {
    switch (type) {
      case 'Công lập': return 'blue'
      case 'Tư thục': return 'orange'
      case 'Dân lập': return 'green'
      default: return 'default'
    }
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 mb-4"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
        {/* Logo Section */}
        <div className="mr-6 w-full md:w-auto flex justify-center md:justify-start mb-4 md:mb-0">
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
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* University Info */}
            <div className="flex-1 lg:pr-6">
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800 truncate mr-1">
                    {university.name} ({university.code})
                  </h3>
                  <Tag color={getTypeColor(university.type)}>{university.type}</Tag>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 lg:mt-0 w-full md:w-auto">
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
  )
}

export default UniversityCard