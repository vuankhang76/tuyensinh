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
    <div className="space-y-4">
        {admissionMethods.map((method, index) => (
          <Card key={method.id || index} className="transition-shadow hover:shadow-md">
            <CardContent>
              <div className="space-y-4">
                <CardTitle className="flex items-start justify-between">
                  <span>{method.name}</span>
                  <Badge variant="outline">{method.year}</Badge>
                </CardTitle>
                <p className="text-gray-700">{method.description}</p>
                <div className="gap-4 text-sm">
                  {method.criteria && (
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-500" />
                      <span>Tiêu chí: {method.criteria}</span>
                    </div>
                  )}
                  {method.language && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>Ngôn ngữ: {method.language}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
  )
}

export default AdmissionTab 