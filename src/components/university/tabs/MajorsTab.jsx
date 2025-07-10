import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GraduationCap } from 'lucide-react'

const MajorsTab = ({ majors, admissionScores, loading }) => {
  if (loading) {
  }

  if (!majors || majors.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có ngành học</h3>
          <p className="text-gray-500 text-center">Thông tin về các ngành học sẽ được cập nhật sớm.</p>
        </CardContent>
      </Card>
    )
  }

  const getMajorScore = (majorId) => {
    const score = admissionScores.find(s => s.majorId === majorId)
    return score?.score || 'Chưa có'
  }

  const getMajorSubjectCombination = (majorId) => {
    const score = admissionScores.find(s => s.majorId === majorId)
    return score?.subjectCombination || ''
  }

  const getMajorYear = (majorId) => {
    const score = admissionScores.find(s => s.majorId === majorId)
    return score?.year || 'Chưa có'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ngành học</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên ngành</TableHead>
                <TableHead className="text-center">Mã ngành</TableHead>
                <TableHead className="text-center">Điểm chuẩn</TableHead>
                <TableHead className="text-center">Năm</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Tổ hợp môn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {majors.map((major, index) => (
                <TableRow key={major.id || index}>
                  <TableCell className="font-medium">{major.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{major.code || `M${major.id}`}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-blue-600">
                    {getMajorScore(major.id)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getMajorYear(major.id)}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-xs truncate">
                    {major.description || 'Chưa có mô tả'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-end">
                      {getMajorSubjectCombination(major.id).split(',').map((combo, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {combo.trim()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default MajorsTab 