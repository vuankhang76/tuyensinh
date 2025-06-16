import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { 
  Home,
  Plus,
  Trash2,
  Search,
  Trophy,
  MapPin,
  DollarSign,
  User,
  Book,
  Globe,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react'

const CompareUniversities = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedUniversities, setSelectedUniversities] = useState([])
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchSuggestions, setSuggestions] = useState([])

  // Mock data - trong thực tế sẽ fetch từ API
  const allUniversities = [
    {
      id: 1,
      name: "Đại học Bách khoa Hà Nội",
      code: "HUST",
      slug: "dai-hoc-bach-khoa-ha-noi",
      location: "Hà Nội",
      type: "Công lập",
      minScore: 27.5,
      maxScore: 29.8,
      majors: ["Công nghệ thông tin", "Kỹ thuật điện", "Cơ khí", "Hóa học"],
      tuitionRange: "24-30 triệu VNĐ/năm",
      tuitionMin: 24,
      tuitionMax: 30,
      ranking: 2,
      internationalRanking: 360,
      quota: 9680,
      students: 35000,
      establishedYear: 1956,
      website: "https://hust.edu.vn",
      admissionMethods: ["Thi THPT", "Đánh giá tư duy", "Xét tuyển tài năng"],
      programs: ["Chuẩn", "Elitech", "Quốc tế"],
      scholarships: ["Khuyến khích học tập", "Trần Đại Nghĩa", "Doanh nghiệp"],
      facilities: {
        library: true,
        dormitory: true,
        gym: true,
        lab: true,
        hospital: false
      },
      accreditation: ["AUN-QA", "ABET"],
      employmentRate: 95,
      averageSalary: 12,
      topEmployers: ["FPT", "Viettel", "VNPT", "Samsung"],
      strengths: ["Công nghệ", "Kỹ thuật", "Nghiên cứu"],
      weaknesses: ["Áp lực học tập cao", "Cạnh tranh khốc liệt"]
    },
    {
      id: 2,
      name: "Đại học FPT",
      code: "FPU", 
      slug: "dai-hoc-fpt",
      location: "Hà Nội",
      type: "Tư thục",
      minScore: 22.0,
      maxScore: 26.5,
      majors: ["Công nghệ thông tin", "Kinh doanh", "Thiết kế đồ họa", "Marketing"],
      tuitionRange: "65-70 triệu VNĐ/năm",
      tuitionMin: 65,
      tuitionMax: 70,
      ranking: 15,
      internationalRanking: null,
      quota: 5000,
      students: 15000,
      establishedYear: 2006,
      website: "https://fpt.edu.vn",
      admissionMethods: ["Thi THPT", "Xét học bả", "Thi riêng"],
      programs: ["Chuẩn", "Quốc tế"],
      scholarships: ["Học bổng tài năng", "Học bổng doanh nghiệp"],
      facilities: {
        library: true,
        dormitory: true,
        gym: true,
        lab: true,
        hospital: false
      },
      accreditation: ["Kiểm định chất lượng"],
      employmentRate: 98,
      averageSalary: 15,
      topEmployers: ["FPT", "Microsoft", "Google", "Amazon"],
      strengths: ["Thực hành", "Kết nối doanh nghiệp", "Cơ sở vật chất"],
      weaknesses: ["Học phí cao", "Chưa có uy tín lâu dài"]
    },
    {
      id: 3,
      name: "Đại học Kinh tế Quốc dân",
      code: "NEU",
      slug: "dai-hoc-kinh-te-quoc-dan", 
      location: "Hà Nội",
      type: "Công lập",
      minScore: 26.5,
      maxScore: 28.9,
      majors: ["Kinh tế", "Tài chính", "Quản trị kinh doanh", "Kế toán"],
      tuitionRange: "20-28 triệu VNĐ/năm",
      tuitionMin: 20,
      tuitionMax: 28,
      ranking: 5,
      internationalRanking: 800,
      quota: 7200,
      students: 28000,
      establishedYear: 1956,
      website: "https://neu.edu.vn",
      admissionMethods: ["Thi THPT", "Xét tuyển tài năng", "Thi riêng"],
      programs: ["Chuẩn", "Chất lượng cao", "Quốc tế"],
      scholarships: ["Khuyến khích học tập", "Doanh nghiệp", "Chính phủ"],
      facilities: {
        library: true,
        dormitory: true,
        gym: false,
        lab: true,
        hospital: false
      },
      accreditation: ["AUN-QA", "FIBAA"],
      employmentRate: 92,
      averageSalary: 10,
      topEmployers: ["Vietcombank", "BIDV", "Deloitte", "PwC"],
      strengths: ["Kinh tế", "Tài chính", "Mạng lưới cựu sinh viên"],
      weaknesses: ["Cơ sở vật chất cũ", "Ít thực hành"]
    }
  ]

  // Load universities from URL params
  useEffect(() => {
    const universityIds = searchParams.get('universities')?.split(',').map(Number) || []
    if (universityIds.length > 0) {
      const universities = allUniversities.filter(u => universityIds.includes(u.id))
      setSelectedUniversities(universities)
    }
  }, [searchParams])

  // Update URL when universities change
  useEffect(() => {
    if (selectedUniversities.length > 0) {
      const universityIds = selectedUniversities.map(u => u.id).join(',')
      setSearchParams({ universities: universityIds })
    } else {
      setSearchParams({})
    }
  }, [selectedUniversities, setSearchParams])

  const handleSearch = (value) => {
    if (value) {
      const filtered = allUniversities
        .filter(uni => 
          uni.name.toLowerCase().includes(value.toLowerCase()) ||
          uni.code.toLowerCase().includes(value.toLowerCase())
        )
        .filter(uni => !selectedUniversities.find(selected => selected.id === uni.id))
        .map(uni => ({ 
          value: uni.id, 
          label: `${uni.name} (${uni.code})`,
          university: uni
        }))
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const addUniversity = (universityId) => {
    if (selectedUniversities.length >= 4) {
      alert('Bạn chỉ có thể so sánh tối đa 4 trường cùng lúc.')
      return
    }

    const university = allUniversities.find(u => u.id === universityId)
    if (university && !selectedUniversities.find(u => u.id === universityId)) {
      setSelectedUniversities([...selectedUniversities, university])
      setSearchTerm('')
      setSuggestions([])
      setIsAddModalVisible(false)
    }
  }

  const removeUniversity = (universityId) => {
    setSelectedUniversities(selectedUniversities.filter(u => u.id !== universityId))
  }

  const compareData = [
    {
      key: 'basic',
      category: 'Thông tin cơ bản',
      items: [
        { label: 'Tên trường', field: 'name' },
        { label: 'Mã trường', field: 'code' },
        { label: 'Loại hình', field: 'type' },
        { label: 'Địa điểm', field: 'location' },
        { label: 'Năm thành lập', field: 'establishedYear' },
        { label: 'Website', field: 'website' }
      ]
    },
    {
      key: 'ranking',
      category: 'Xếp hạng',
      items: [
        { label: 'Xếp hạng trong nước', field: 'ranking' },
        { label: 'Xếp hạng quốc tế', field: 'internationalRanking' }
      ]
    },
    {
      key: 'admission',
      category: 'Tuyển sinh',
      items: [
        { label: 'Điểm chuẩn thấp nhất', field: 'minScore' },
        { label: 'Điểm chuẩn cao nhất', field: 'maxScore' },
        { label: 'Chỉ tiêu', field: 'quota' },
        { label: 'Phương thức xét tuyển', field: 'admissionMethods' }
      ]
    },
    {
      key: 'cost',
      category: 'Chi phí',
      items: [
        { label: 'Học phí/năm', field: 'tuitionRange' }
      ]
    },
    {
      key: 'programs',
      category: 'Chương trình đào tạo',
      items: [
        { label: 'Số sinh viên', field: 'students' },
        { label: 'Các chương trình', field: 'programs' },
        { label: 'Học bổng', field: 'scholarships' }
      ]
    },
    {
      key: 'employment',
      category: 'Việc làm sau tốt nghiệp',
      items: [
        { label: 'Tỷ lệ có việc làm', field: 'employmentRate' },
        { label: 'Mức lương TB (triệu/tháng)', field: 'averageSalary' },
        { label: 'Nhà tuyển dụng hàng đầu', field: 'topEmployers' }
      ]
    }
  ]

  const renderCellValue = (university, field) => {
    const value = university[field]
    
    switch (field) {
      case 'ranking':
        return <Badge variant="default">#{value}</Badge>
      case 'internationalRanking':
        return value ? <Badge variant="secondary">#{value}</Badge> : <Badge variant="outline">Chưa có</Badge>
      case 'type':
        return <Badge variant={value === 'Công lập' ? 'default' : 'secondary'}>{value}</Badge>
      case 'website':
        return (
          <Button 
            variant="link" 
            size="sm"
            onClick={() => window.open(value, '_blank')}
            className="p-0 h-auto"
          >
            <Globe className="h-4 w-4 mr-1" />
            Truy cập
          </Button>
        )
      case 'admissionMethods':
      case 'programs':
      case 'scholarships':
      case 'topEmployers':
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        )
      case 'employmentRate':
        return (
          <div className="space-y-1">
            <Progress 
              value={value} 
              className="h-2"
            />
            <span className="text-sm font-medium">{value}%</span>
          </div>
        )
      case 'quota':
      case 'students':
        return value?.toLocaleString()
      case 'averageSalary':
        return `${value} triệu VNĐ`
      default:
        return value
    }
  }

  const filteredUniversities = allUniversities.filter(uni => 
    !selectedUniversities.find(selected => selected.id === uni.id)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>So sánh trường đại học</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            So sánh trường đại học
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            So sánh chi tiết thông tin tuyển sinh, chương trình đào tạo và cơ hội việc làm 
            giữa các trường đại học để đưa ra quyết định tốt nhất
          </p>
        </div>

        {/* Instructions */}
        {selectedUniversities.length === 0 && (
          <Alert variant="info" className="mb-6">
            <AlertDescription>
              <strong>Hướng dẫn sử dụng:</strong> Chọn ít nhất 2 trường đại học để bắt đầu so sánh. 
              Bạn có thể so sánh tối đa 4 trường cùng lúc.
            </AlertDescription>
          </Alert>
        )}

        {/* University Selection */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4">
              <CardTitle className="text-lg">Trường đại học đã chọn:</CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsAddModalVisible(true)}
                disabled={selectedUniversities.length >= 4}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm trường
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedUniversities.map((university) => (
                <Card key={university.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center -mx-6 -mt-6 mb-4">
                      <span className="text-white font-bold text-lg">{university.code}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUniversity(university.id)}
                      className="absolute top-2 right-2 h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-2">
                      {university.name}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>{university.location}</span>
                      <Badge variant="default" className="text-xs">#{university.ranking}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add University Placeholder */}
              {selectedUniversities.length < 4 && (
                <Card 
                  className="border-dashed cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => setIsAddModalVisible(true)}
                >
                  <CardContent className="h-32 flex flex-col items-center justify-center text-gray-400">
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="text-sm">Thêm trường</span>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedUniversities.length >= 2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bảng so sánh chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-3 bg-gray-50 text-left min-w-48">
                        Tiêu chí
                      </th>
                      {selectedUniversities.map((university) => (
                        <th 
                          key={university.id}
                          className="border border-gray-300 p-3 bg-gray-50 text-center min-w-64"
                        >
                          <div>
                            <div className="font-bold text-lg">{university.code}</div>
                            <div className="font-normal text-sm text-gray-600 line-clamp-2">
                              {university.name}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareData.map((category) => (
                      <React.Fragment key={category.key}>
                        <tr>
                          <td 
                            colSpan={selectedUniversities.length + 1}
                            className="border border-gray-300 p-3 bg-blue-50 font-semibold text-blue-800"
                          >
                            {category.category}
                          </td>
                        </tr>
                        {category.items.map((item) => (
                          <tr key={item.field}>
                            <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                              {item.label}
                            </td>
                            {selectedUniversities.map((university) => (
                              <td 
                                key={university.id}
                                className="border border-gray-300 p-3 text-center"
                              >
                                {renderCellValue(university, item.field)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Comparison */}
        {selectedUniversities.length >= 2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>So sánh nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedUniversities.map((university) => (
                  <Card key={university.id} className="text-center">
                    <CardHeader className="pb-2">
                      <div className="text-lg font-bold">{university.code}</div>
                      <div className="text-xs text-gray-600 line-clamp-1">
                        {university.name}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">Xếp hạng</div>
                        <div className="text-xl font-bold">#{university.ranking}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Điểm chuẩn</div>
                        <div className="text-xl font-bold text-blue-600">{university.minScore}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Tỷ lệ có việc</div>
                        <div className="text-xl font-bold text-green-600">{university.employmentRate}%</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facilities Comparison */}
        {selectedUniversities.length >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle>So sánh cơ sở vật chất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-semibold">Cơ sở vật chất</th>
                      {selectedUniversities.map(uni => (
                        <th key={uni.id} className="text-center p-3 font-semibold">{uni.code}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(selectedUniversities[0]?.facilities || {}).map(facility => (
                      <tr key={facility} className="border-t">
                        <td className="p-3 font-medium">
                          {facility === 'library' ? 'Thư viện' :
                           facility === 'dormitory' ? 'Ký túc xá' :
                           facility === 'gym' ? 'Phòng gym' :
                           facility === 'lab' ? 'Phòng thí nghiệm' :
                           facility === 'hospital' ? 'Bệnh viện' : facility}
                        </td>
                        {selectedUniversities.map(uni => (
                          <td key={uni.id} className="text-center p-3">
                            {uni.facilities[facility] ? 
                              <CheckCircle className="h-6 w-6 text-green-500 mx-auto" /> :
                              <XCircle className="h-6 w-6 text-red-500 mx-auto" />
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add University Modal */}
      <Dialog open={isAddModalVisible} onOpenChange={setIsAddModalVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm trường đại học</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên trường hoặc mã trường..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="pl-9"
              />
            </div>

            <div className="text-sm text-gray-600">
              Gợi ý: Hãy thử tìm "Bách khoa", "FPT", "Kinh tế"...
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
              {filteredUniversities.map(university => (
                <Card 
                  key={university.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addUniversity(university.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{university.name}</div>
                        <div className="text-sm text-gray-600">
                          {university.location} • {university.type} • #{university.ranking}
                        </div>
                      </div>
                      <Button size="sm">
                        Chọn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CompareUniversities