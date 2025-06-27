import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  DollarSign,
  Calendar,
  Clock,
  Globe
} from 'lucide-react'

// Utility function for currency formatting
const formatCurrency = (amount, unit) => {
  if (typeof amount != 'number') return amount;
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);
  return `${formattedAmount} ${unit}`;
}

const ProgramsTab = ({ programs, loading }) => {
  if (loading) {
  }

  if (!programs || programs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có chương trình đào tạo</h3>
          <p className="text-gray-500 text-center">Thông tin về các chương trình đào tạo sẽ được cập nhật sớm.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {programs.map((program, index) => (
          <Card key={program.id || index} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span>{program.name}</span>
                <Badge variant="secondary">{program.level || 'Đại học'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {program.description && (
                  <p className="text-gray-700">{program.description}</p>
                )}
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  {/* Cải tiến: Hiển thị học phí đã định dạng */}
                  {program.tuition && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Học phí: {formatCurrency(program.tuition, program.tuitionUnit)}</span>
                    </div>
                  )}
                  {/* Mới: Hiển thị năm áp dụng */}
                  {program.year && (
                     <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-purple-500" />
                       <span>Năm áp dụng: {program.year}</span>
                     </div>
                  )}
                   {/* Giữ lại các trường cũ phòng trường hợp dữ liệu có chúng */}
                  {program.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Thời gian: {program.duration}</span>
                    </div>
                  )}
                  {program.language && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>Ngôn ngữ: {program.language}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramsTab 