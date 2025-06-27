import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Info,
  Users
} from 'lucide-react'

const AdmissionTab = ({ admissionMethods, loading }) => {
  if (loading) {
  }

  const methodsArray = Array.isArray(admissionMethods) ? admissionMethods : []

  if (methodsArray.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có phương thức tuyển sinh</h3>
          <p className="text-gray-500 text-center">Thông tin về các phương thức tuyển sinh sẽ được cập nhật sớm.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phương thức xét tuyển</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {methodsArray.map((method) => (
              <div key={method.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{method.name}</h4>
                  {method.quota && (
                    <Badge>{method.quota}%</Badge>
                  )}
                </div>
                {method.description && (
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {method.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Bắt đầu: {new Date(method.startDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  {method.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>Kết thúc: {new Date(method.endDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  {method.requirements && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-green-500" />
                      <span>Yêu cầu: {method.requirements}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdmissionTab 