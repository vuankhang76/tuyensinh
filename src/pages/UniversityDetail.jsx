import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Tag, Button, Table, Statistic, Row, Col, Timeline, Alert, Tabs } from 'antd'
import { 
  GlobalOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined,
  TrophyOutlined,
  BookOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

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
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Đang tải thông tin...</p>
      </div>
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

  const tabItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      children: <OverviewTab university={university} />
    },
    {
      key: 'admission',
      label: 'Thông tin tuyển sinh', 
      children: <AdmissionTab university={university} />
    },
    {
      key: 'programs',
      label: 'Chương trình đào tạo',
      children: <ProgramsTab university={university} />
    },
    {
      key: 'majors',
      label: 'Ngành học & Điểm chuẩn',
      children: <MajorsTab university={university} />
    },
    {
      key: 'news',
      label: 'Tin tức mới nhất',
      children: <NewsTab university={university} />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{university.name}</span>
          </div>
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
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{university.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{university.shortName}</p>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <EnvironmentOutlined className="text-gray-400" />
                  <span>{university.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-gray-400" />
                  <span>{university.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GlobalOutlined className="text-gray-400" />
                  <a href={university.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-700">
                    {university.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-col gap-3">
              <Button type="primary" size="large" icon={<HeartOutlined />} className="min-w-[120px]">
                Yêu thích
              </Button>
              <Button size="large" icon={<ShareAltOutlined />} className="min-w-[120px]">
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
            {/* Xếp hạng quốc gia */}
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <TrophyOutlined className="text-2xl text-orange-500 mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">#{university.ranking.national}</div>
              <div className="text-sm text-gray-600">Xếp hạng quốc gia</div>
            </div>

            {/* Xếp hạng quốc tế */}
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <GlobalOutlined className="text-2xl text-blue-500 mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">#{university.ranking.international}</div>
              <div className="text-sm text-gray-600">Xếp hạng quốc tế</div>
            </div>

            {/* Chỉ tiêu */}
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <BookOutlined className="text-2xl text-green-500 mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{university.admissionInfo.totalQuota.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Chỉ tiêu 2025</div>
            </div>

            {/* Thành lập */}
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-sm transition-shadow">
              <div className="text-2xl text-purple-500 mb-3 font-bold">EST</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{university.establishedYear}</div>
              <div className="text-sm text-gray-600">Năm thành lập</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <Tabs 
          items={tabItems}
          size="large"
          className=""
        />
      </div>
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ university }) => (
  <div className="!space-y-4">
    <Card title="Giới thiệu" className="shadow-sm">
      <p className="text-gray-700 leading-relaxed mb-4">{university.description}</p>
      <h4 className="font-semibold mb-3">Điểm nổi bật:</h4>
      <ul className="space-y-2">
        {university.highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">{highlight}</span>
          </li>
        ))}
      </ul>
    </Card>

    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Xếp hạng theo ngành" className="shadow-sm">
        <div className="space-y-3">
          {university.ranking.subjects.map((subject, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">{subject.name}</span>
              <Tag color="blue">#{subject.rank}</Tag>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Thông tin liên hệ" className="shadow-sm">
        <div className="space-y-4">
          <div>
            <div className="font-medium text-gray-800">Website chính thức</div>
            <a href={university.website} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
              {university.website}
            </a>
          </div>
          <div>
            <div className="font-medium text-gray-800">Website tuyển sinh</div>
            <a href={university.admissionWebsite} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
              {university.admissionWebsite}
            </a>
          </div>
          <div>
            <div className="font-medium text-gray-800">Email</div>
            <div className="text-gray-600">{university.email}</div>
          </div>
          <div>
            <div className="font-medium text-gray-800">Điện thoại</div>
            <div className="text-gray-600">{university.phone}</div>
          </div>
        </div>
      </Card>
    </div>
  </div>
)

// Admission Tab Component  
const AdmissionTab = ({ university }) => (
  <div className="!space-y-4">
    <Alert
      message="Thông tin tuyển sinh năm 2025"
      description="Thông tin được cập nhật thường xuyên từ nguồn chính thức của trường"
      type="info"
      showIcon
    />

    <Card title="Chỉ tiêu và phương thức tuyển sinh" className="shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Tổng chỉ tiêu: <span className="text-blue-600">{university.admissionInfo.totalQuota.toLocaleString()} sinh viên</span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {university.admissionInfo.methods.map((method, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="font-semibold text-gray-800 mb-2">{method.name}</div>
              <div className="text-2xl font-bold text-blue-600 mb-2">{method.quota}</div>
              <div className="text-sm text-gray-600">{method.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">1. Xét tuyển tài năng (20% chỉ tiêu)</h4>
          <div className="ml-4 space-y-2 text-sm text-gray-700">
            <p><strong>Điều kiện:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Đoạt giải trong các kỳ thi học sinh giỏi quốc gia</li>
              <li>• Có chứng chỉ quốc tế (SAT, ACT,...)</li>
              <li>• Điểm TB học tập lớp 10, 11, 12 từ 8.0 trở lên</li>
              <li>• Được chọn tham dự kỳ thi học sinh giỏi cấp tỉnh/quốc gia</li>
              <li>• Học sinh hệ chuyên của các trường THPT chuyên</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">2. Xét tuyển theo điểm thi Đánh giá tư duy (40% chỉ tiêu)</h4>
          <div className="ml-4 space-y-2 text-sm text-gray-700">
            <p>• Hình thức: Trắc nghiệm khách quan trên máy tính</p>
            <p>• Nội dung: Đánh giá 3 năng lực - Toán học, Đọc hiểu, Khoa học/Giải quyết vấn đề</p>
            <p>• Thời gian: 3 đợt (18-19/1, 8-9/3, 26-27/4)</p>
            <p>• Địa điểm: 13 tỉnh/thành phố</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">3. Xét tuyển theo điểm thi tốt nghiệp THPT (40% chỉ tiêu)</h4>
          <div className="ml-4 space-y-2 text-sm text-gray-700">
            <p><strong>Tổ hợp xét tuyển:</strong></p>
            <p>• 10 tổ hợp cũ: A00, A01, A02, B00, D01, D04, D07, D26, D28, D29</p>
            <p>• Tổ hợp mới K01: Toán x 3 + Ngữ văn x 1 + Lý/Hóa/Sinh/Tin x 2</p>
            <p><strong>Lưu ý:</strong> Thí sinh có chứng chỉ tiếng Anh quốc tế được quy đổi điểm và cộng điểm thưởng</p>
          </div>
        </div>
      </div>
    </Card>

    <Card title="Lịch thi và sự kiện quan trọng" className="shadow-sm">
      <Timeline
        items={university.admissionInfo.examSchedule.map(item => ({
          children: (
            <div>
              <div className="font-medium">{item.event}</div>
              <div className="text-sm text-gray-600">{item.date}</div>
            </div>
          )
        }))}
      />
    </Card>
  </div>
)

// Programs Tab Component
const ProgramsTab = ({ university }) => (
  <div className="!space-y-4">
    <div className="grid gap-4">
      {university.programs.map((program, index) => (
        <Card key={index} className="shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{program.type}</h3>
              <p className="text-gray-600 mt-2">{program.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{program.tuition}</div>
              <Tag color={program.language === 'Tiếng Anh' ? 'green' : 'blue'} className="!mt-3"> 
                {program.language}
              </Tag>
            </div>
          </div>
        </Card>
      ))}
    </div>

    <Card title="Học bổng" className="shadow-sm">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Học bổng Khuyến khích học tập</h4>
          <p className="text-sm text-yellow-700">70-80 tỷ đồng/năm cho sinh viên có kết quả học tập tốt</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Học bổng Trần Đại Nghĩa</h4>
          <p className="text-sm text-green-700">Dành cho sinh viên có hoàn cảnh khó khăn</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Học bổng doanh nghiệp</h4>
          <p className="text-sm text-blue-700">5-7 tỷ đồng/năm từ các đối tác của trường</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Học bổng trao đổi quốc tế</h4>
          <p className="text-sm text-purple-700">5 tỷ đồng cho sinh viên đi học tập ngắn hạn ở nước ngoài</p>
        </div>
      </div>
    </Card>
  </div>
)

// Majors Tab Component
const MajorsTab = ({ university }) => {
  const columns = [
    {
      title: 'Tên ngành',
      dataIndex: 'name',
      key: 'name',
      width: '40%'
    },
    {
      title: 'Mã ngành', 
      dataIndex: 'code',
      key: 'code',
      width: '15%'
    },
    {
      title: 'Điểm chuẩn 2024',
      dataIndex: 'cutoffScore',
      key: 'cutoffScore',
      width: '20%',
      render: (score) => (
        <Tag color={score >= 28 ? 'red' : score >= 26 ? 'orange' : 'green'}>
          {score}
        </Tag>
      )
    },
    {
      title: 'Chỉ tiêu 2025',
      dataIndex: 'quota', 
      key: 'quota',
      width: '15%',
      render: (quota) => <span className="font-medium">{quota}</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '10%',
      render: () => (
        <Button type="link" size="small">
          Chi tiết
        </Button>
      )
    }
  ]

  return (
    <div className="!space-y-4">
      <Alert
        message="Điểm chuẩn năm 2024 (tham khảo)"
        description="Điểm chuẩn năm 2025 sẽ được công bố sau khi kết thúc quá trình xét tuyển"
        type="warning"
        showIcon
      />

      <Card title="Điểm chuẩn các ngành">
        <Table 
          columns={columns}
          dataSource={university.majors}
          rowKey="code"
          pagination={false}
          size="middle"
        />
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Nhóm ngành CNTT" size="small">
          <ul className="space-y-2 text-sm">
            <li>• Khoa học máy tính: <strong>28.53</strong></li>
            <li>• Kỹ thuật máy tính: <strong>28.48</strong></li>
            <li>• Khoa học dữ liệu & AI: <strong>28.22</strong></li>
          </ul>
        </Card>
        
        <Card title="Nhóm ngành Điện - Điện tử" size="small">
          <ul className="space-y-2 text-sm">
            <li>• KT điện tử viễn thông: <strong>27.12</strong></li>
            <li>• KT điều khiển tự động: <strong>27.45</strong></li>
            <li>• Kỹ thuật điện: <strong>25.85</strong></li>
          </ul>
        </Card>

        <Card title="Nhóm ngành Cơ khí" size="small">
          <ul className="space-y-2 text-sm">
            <li>• Kỹ thuật cơ khí: <strong>25.75</strong></li>
            <li>• Kỹ thuật cơ điện tử: <strong>26.55</strong></li>
            <li>• Kỹ thuật ô tô: <strong>26.25</strong></li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

// News Tab Component
const NewsTab = ({ university }) => (
  <div className="!space-y-4">
    {university.news.map((news, index) => (
      <Card key={index} className="shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{news.title}</h3>
          <span className="text-sm text-gray-500">{news.date}</span>
        </div>
        <p className="text-gray-700">{news.content}</p>
        <Button type="link" className="p-0 mt-2">
          Đọc thêm →
        </Button>
      </Card>
    ))}

    <Card title="Thay đổi chính năm 2025" className="shadow-sm">
      <Timeline
        items={[
          {
            children: (
              <div>
                <div className="font-medium">Chỉ tiêu tuyển sinh tăng</div>
                <div className="text-sm text-gray-600">9.680 sinh viên, tăng nhẹ so với năm 2024</div>
              </div>
            )
          },
          {
            children: (
              <div>
                <div className="font-medium">Bổ sung tổ hợp xét tuyển K01</div>
                <div className="text-sm text-gray-600">Toán x3 + Ngữ văn x1 + Lý/Hóa/Sinh/Tin x2</div>
              </div>
            )
          },
          {
            children: (
              <div>
                <div className="font-medium">Mở ngành mới: Tiếng Trung KH&KT</div>
                <div className="text-sm text-gray-600">Chỉ tiêu dự kiến: 40 sinh viên</div>
              </div>
            )
          },
          {
            children: (
              <div>
                <div className="font-medium">Kỳ thi Đánh giá tư duy 2025</div>
                <div className="text-sm text-gray-600">Thi trắc nghiệm trên máy tính, 3 đợt từ 1-4/2025</div>
              </div>
            )
          }
        ]}
      />
    </Card>
  </div>
)

export default UniversityDetail