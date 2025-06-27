import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Award
} from 'lucide-react'

const ScholarshipsTab = ({ scholarships, loading }) => {
  if (loading) {
  }

  // Đảm bảo scholarships là array
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {scholarshipsArray.map((scholarship, index) => (
          <Card key={scholarship.id || index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{scholarship.name}</span>
                {scholarship.amount && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {scholarship.amount}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scholarship.description && (
                  <p className="text-gray-700">{scholarship.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {scholarship.eligibility && (
                    <div>
                      <span className="font-medium text-gray-800">Điều kiện:</span>
                      <p className="text-gray-600 mt-1">{scholarship.eligibility}</p>
                    </div>
                  )}
                  {scholarship.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>Hạn nộp: {new Date(scholarship.deadline).toLocaleDateString('vi-VN')}</span>
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