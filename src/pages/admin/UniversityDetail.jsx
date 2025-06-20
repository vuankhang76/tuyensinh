import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe, 
  MapPin, 
  Phone,
  Trophy,
  BookOpen,
  Heart,
  Share,
  Info,
  AlertCircle,
  Home
} from 'lucide-react'
import Loading from '../../components/common/Loading/LoadingSkeleton'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'

const UniversityDetail = () => {
  const { slug } = useParams()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const mockUniversity = {
      id: 1,
      name: "Đại học Bách khoa Hà Nội",
      shortName: "HUST",
      code: "HUST",
      slug: "dai-hoc-bach-khoa-ha-noi",
      type: "Công lập",
      location: "Hà Nội",
      address: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
      phone: "024-38681122",
      email: "info@hust.edu.vn",
      website: "https://hust.edu.vn",
      admissionWebsite: "https://ts.hust.edu.vn",
      establishedYear: 1956,
      ranking: {
        national: 2,
        international: 360,
        subjects: [
          { name: "Khoa học máy tính", rank: "451-500" },
          { name: "Kỹ thuật Điện - Điện tử", rank: "351-400" },
          { name: "Kỹ thuật Cơ khí", rank: "401-450" }
        ]
      },
      description: "Đại học Bách khoa Hà Nội (HUST) là một trong những trường đại học kỹ thuật hàng đầu của Việt Nam, nổi tiếng về đào tạo các ngành kỹ thuật và công nghệ. HUST đặc biệt mạnh về các lĩnh vực Công nghệ thông tin, Điện - Điện tử và Cơ khí.",
      highlights: [
        "Top 2 trường đại học kỹ thuật Việt Nam",
        "Xếp hạng 360 thế giới về Kỹ thuật và Công nghệ", 
        "Hơn 65 chương trình đào tạo",
        "Hợp tác với 200+ trường đại học quốc tế"
      ],
      admissionInfo: {
        totalQuota: 9680,
        methods: [
          { name: "Xét tuyển tài năng", quota: "20%", description: "Dành cho học sinh giỏi" },
          { name: "Xét tuyển theo điểm thi ĐGTD", quota: "40%", description: "Thi đánh giá tư duy" },
          { name: "Xét tuyển theo điểm thi THPT", quota: "40%", description: "Theo điểm thi tốt nghiệp" }
        ],
        examSchedule: [
          { date: "18-19/1/2025", event: "Kỳ thi Đánh giá tư duy đợt 1" },
          { date: "8-9/3/2025", event: "Kỳ thi Đánh giá tư duy đợt 2" },
          { date: "26-27/4/2025", event: "Kỳ thi Đánh giá tư duy đợt 3" }
        ]
      },
      programs: [
        {
          type: "Chương trình chuẩn",
          tuition: "24-30 triệu đồng/năm",
          language: "Tiếng Việt",
          description: "Đào tạo bằng tiếng Việt theo chương trình chuẩn"
        },
        {
          type: "Chương trình ELITECH",
          tuition: "33-42 triệu đồng/năm", 
          language: "Tiếng Anh/Tiếng Việt",
          description: "Chương trình chất lượng cao với nhiều môn học bằng tiếng Anh"
        },
        {
          type: "Khoa học dữ liệu & AI",
          tuition: "64-67 triệu đồng/năm",
          language: "Tiếng Anh",
          description: "Đào tạo hoàn toàn bằng tiếng Anh về AI và Data Science"
        }
      ],
      majors: [
        { name: "Khoa học máy tính", code: "IT1", cutoffScore: 28.53, quota: 200 },
        { name: "Kỹ thuật máy tính", code: "IT2", cutoffScore: 28.48, quota: 150 },
        { name: "Kỹ thuật điện tử viễn thông", code: "ET1", cutoffScore: 27.12, quota: 180 },
        { name: "Kỹ thuật cơ khí", code: "ME1", cutoffScore: 25.75, quota: 250 }
      ],
      news: [
        {
          date: "2025-01-15",
          title: "HUST công bố phương án tuyển sinh 2025",
          content: "Trường giữ nguyên 3 phương thức xét tuyển, bổ sung tổ hợp K01 mới"
        },
        {
          date: "2025-01-10", 
          title: "Mở thêm ngành Tiếng Trung KH&KT",
          content: "Chỉ tiêu dự kiến 40 sinh viên cho năm 2025"
        }
      ],
      tags: [
        "Công lập", "Hà Nội", "Kỹ thuật", "Công nghệ thông tin", 
        "Cơ khí", "Điện tử", "AI", "Top đầu"
      ]
    }

    setTimeout(() => {
      setUniversity(mockUniversity)
      setLoading(false)
    }, 1000)
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <Loading 
        type="spinner" 
        size="large" 
        tip="Đang tải thông tin..."
        className="py-8"
      />
    </div>
  }

  if (!university) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy trường đại học</h2>
        <Button type="primary" onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/" className="flex items-center">
                    <Home className="h-4 w-4" />
                    <span className="ml-1">Trang chủ</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{university.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      < div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* University Logo */}
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">{university.code}</span>
            </div>

            {/* University Info */}
            <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                {university.tags.slice(0, 4).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{university.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{university.shortName}</p>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{university.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{university.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {university.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button>
                <Heart className="h-4 w-4 mr-2" />
                Yêu thích
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <div className="text-2xl font-bold text-gray-900 mb-1">#{university.ranking.national}</div>
              <div className="text-sm text-gray-600">Xếp hạng quốc gia</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <div className="text-2xl font-bold text-gray-900 mb-1">#{university.ranking.international}</div>
              <div className="text-sm text-gray-600">Xếp hạng quốc tế</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <div className="text-2xl font-bold text-gray-900 mb-1">{university.admissionInfo.totalQuota.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Chỉ tiêu 2025</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <div className="text-2xl font-bold text-gray-900 mb-1">{university.establishedYear}</div>
              <div className="text-sm text-gray-600">Năm thành lập</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="admission">Tuyển sinh</TabsTrigger>
            <TabsTrigger value="programs">Chương trình</TabsTrigger>
            <TabsTrigger value="majors">Ngành học</TabsTrigger>
            <TabsTrigger value="news">Tin tức</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab university={university} />
          </TabsContent>

          <TabsContent value="admission">
            <AdmissionTab university={university} />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsTab university={university} />
          </TabsContent>

          <TabsContent value="majors">
            <MajorsTab university={university} />
          </TabsContent>

          <TabsContent value="news">
            <NewsTab university={university} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ university }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Giới thiệu chung</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed mb-6">{university.description}</p>
        
        <h4 className="font-semibold text-gray-800 mb-3">Điểm nổi bật:</h4>
        <ul className="space-y-2">
          {university.highlights.map((highlight, index) => (
            <li key={index} className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng theo ngành</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {university.ranking.subjects.map((subject, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-800">{subject.name}</span>
              <Badge variant="outline">#{subject.rank}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

// Admission Tab Component  
const AdmissionTab = ({ university }) => (
  <div className="space-y-6">
    <Alert>
      <AlertDescription>
        <strong>Chỉ tiêu tuyển sinh 2025:</strong> {university.admissionInfo.totalQuota.toLocaleString()} sinh viên
      </AlertDescription>
    </Alert>

    <Card>
      <CardHeader>
        <CardTitle>Phương thức xét tuyển</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {university.admissionInfo.methods.map((method, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{method.name}</h4>
                <Badge>{method.quota}</Badge>
              </div>
              <p className="text-gray-600 text-sm">{method.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Lịch thi 2025</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {university.admissionInfo.examSchedule.map((exam, index) => (
            <div key={index} className="flex items-center gap-4 p-3 border-l-4 border-blue-500 bg-blue-50">
              <div className="text-sm font-medium text-blue-600">{exam.date}</div>
              <div className="text-gray-800">{exam.event}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

// Programs Tab Component
const ProgramsTab = ({ university }) => (
  <div className="space-y-6">
    <div className="grid gap-6">
      {university.programs.map((program, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {program.type}
              <Badge variant="secondary">{program.language}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">{program.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="font-semibold text-green-600">Học phí: {program.tuition}</div>
                <div className="text-gray-600">Ngôn ngữ: {program.language}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

// Majors Tab Component
const MajorsTab = ({ university }) => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Điểm chuẩn 2024 (tham khảo). Điểm chuẩn 2025 sẽ được công bố sau khi kết thúc xét tuyển.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Điểm chuẩn 2024 & Chỉ tiêu 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngành học</TableHead>
                <TableHead>Mã ngành</TableHead>
                <TableHead className="text-right">Điểm chuẩn 2024</TableHead>
                <TableHead className="text-right">Chỉ tiêu 2025</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {university.majors.map((major, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{major.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{major.code}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-blue-600">
                    {major.cutoffScore}
                  </TableCell>
                  <TableCell className="text-right">{major.quota}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// News Tab Component
const NewsTab = ({ university }) => (
  <div className="space-y-6">
    {university.news.map((newsItem, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="text-sm text-gray-500 min-w-fit">
              {new Date(newsItem.date).toLocaleDateString('vi-VN')}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">{newsItem.title}</h3>
              <p className="text-gray-600 text-sm">{newsItem.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export default UniversityDetail