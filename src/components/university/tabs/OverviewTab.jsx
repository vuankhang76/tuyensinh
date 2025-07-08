import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator' // Import Separator
import {
  Building2,
  Info,
  Award,
  Link as LinkIcon,
  Globe,
  Phone
} from 'lucide-react' // Import thêm icons

// Component nhỏ để hiển thị một dòng thông tin
const InfoRow = ({ icon, label, value, isLink = false }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <span className="text-gray-600">{label}:</span>
        {isLink ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <span className="ml-2 font-medium text-gray-800">{value}</span>
        )}
      </div>
    </div>
  );
};


const OverviewTab = ({ university }) => {
    // Để tránh lỗi nếu university là null hoặc undefined
    if (!university) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Giới thiệu chung
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Đang tải thông tin trường...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="h-6 w-6 text-primary" />
                        Giới thiệu chung
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-700 leading-relaxed text-justify">
                        {university.introduction || 'Thông tin chi tiết về trường đại học sẽ được cập nhật sớm.'}
                    </p>
                    <Separator />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6">
                        <div className="space-y-4 lg:col-span-2">
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                <Info className="h-5 w-5 text-gray-700" />
                                Thông tin cơ bản
                            </h4>
                            <div className="space-y-3 text-sm">
                                <InfoRow label="Mã trường" value={university.shortName} />
                                <InfoRow label="Loại hình" value={university.type} />
                            </div>
                        </div>

                        {/* --- CỘT 2: TỔNG QUAN XẾP HẠNG (CHIẾM 3/5 KHÔNG GIAN) --- */}
                        <div className="space-y-4 lg:col-span-6">
                             <h4 className="font-semibold text-lg flex items-center gap-2">
                                <Award className="h-5 w-5 text-gray-700" />
                                Tổng quan xếp hạng
                            </h4>
                             <div className="space-y-3 text-sm">
                                <InfoRow label="Xếp hạng" value={university.ranking || 'Chưa có'} />
                                <InfoRow label="Tiêu chí" value={university.rankingCriteria} />
                            </div>
                        </div>

                        <div className="space-y-4 lg:col-span-4">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                                <LinkIcon className="h-5 w-5 text-gray-700" />
                                Thông tin liên hệ
                            </h4>
                             <div className="space-y-3 text-sm">
                                <InfoRow
                                  label="Website tuyển sinh"
                                  value={university.admissionWebsite}
                                  isLink
                                />
                                <InfoRow
                                  label="Website chính thức"
                                  value={university.officialWebsite}
                                  isLink
                                />
                             </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default OverviewTab;