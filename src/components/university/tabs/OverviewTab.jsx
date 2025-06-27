import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

const OverviewTab = ({ university }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Giới thiệu chung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {university.introduction || 'Thông tin chi tiết về trường đại học sẽ được cập nhật sớm.'}
          </p>

          <div className="grid grid-cols-1 gap-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Tổng quan xếp hạng</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-600">Xếp hạng:</span>
                  <span className="font-medium">{university.ranking || 'Chưa có'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Tiêu chí xếp hạng:</span>
                  <span className="font-medium">{university.rankingCriteria}</span>
                </div>
              </div>
            </div>
          </div> 

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Thông tin cơ bản</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-600">Mã trường:</span>
                  <span className="font-medium">{university.shortName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Loại hình:</span>
                  <span className="font-medium">{university.type}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Liên hệ</h4>
              <div className="space-y-2 text-sm">
                {university.admissionWebsite && (
                  <div>
                    <span className="text-gray-600">Website tuyển sinh:</span>
                    <a
                      href={university.admissionWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      {university.admissionWebsite}
                    </a>
                  </div>
                )}
                {university.officialWebsite && (
                  <div>
                    <span className="text-gray-600">Website chính thức:</span>
                    <a
                      href={university.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      {university.officialWebsite}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default OverviewTab 