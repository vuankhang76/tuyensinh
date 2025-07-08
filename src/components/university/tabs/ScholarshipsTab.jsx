import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Award,
  DollarSign
} from 'lucide-react'

const ScholarshipsTab = ({ scholarships, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin học bổng...</p>
        </CardContent>
      </Card>
    )
  }

  const scholarshipsArray = Array.isArray(scholarships) ? scholarships : []

  if (scholarshipsArray.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Award className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có học bổng</h3>
          <p className="text-gray-500 text-center">Thông tin về các chương trình học bổng sẽ được cập nhật sớm.</p>
        </CardContent>
      </Card>
    )
  }

  const formatScholarshipValue = (value, valueType) => {
    if (valueType === 'Percentage') {
      return `${value}%`
    } else if (valueType === 'Fixed') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    }
    return value
  }

  const getValueBadgeColor = (value, valueType) => {
    if (valueType === 'Percentage' && value === 100) {
      return 'bg-green-100 text-green-800'
    } else if (valueType === 'Percentage' && value >= 50) {
      return 'bg-blue-100 text-blue-800'
    } else if (valueType === 'Fixed') {
      return 'bg-purple-100 text-purple-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {scholarshipsArray.map((scholarship, index) => (
          <Card key={scholarship.id || index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="text-lg font-bold text-gray-800">{scholarship.name}</span>
                  <Badge variant="default" className={getValueBadgeColor(scholarship.value, scholarship.valueType)}>
                    {formatScholarshipValue(scholarship.value, scholarship.valueType) || 'Chưa rõ giá trị cụ thể'}
                  </Badge>
                </div>
                <Badge variant="outline">{scholarship.year}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 text-base leading-relaxed">{scholarship.description}</p>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  {scholarship.criteria && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-500" />
                        Điều kiện nhận học bổng:
                      </span>
                      <p className="text-gray-600 mt-2 leading-relaxed font-medium">{scholarship.criteria}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ScholarshipsTab 