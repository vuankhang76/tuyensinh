import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { 
  Search, 
  Filter,
  ArrowUpDown,
  Home,
  MapPin,
  X
} from 'lucide-react'
import UniversityCard from '../components/Homepage/UniversityCard'
import FilterSection from '../components/Homepage/FilterSection'
import Loading from '../components/common/Loading/LoadingSkeleton'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalResults, setTotalResults] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)

  // Get search parameters
  const query = searchParams.get('q') || ''
  const region = searchParams.get('region') || ''
  const type = searchParams.get('type') || ''
  const major = searchParams.get('major') || ''

  // Mock data - trong thực tế sẽ fetch từ API
  const mockUniversities = [
    {
      id: 1,
      name: "Đại học Bách khoa Hà Nội",
      code: "HUST",
      slug: "dai-hoc-bach-khoa-ha-noi",
      image: "/images/hust.jpg",
      location: "Hà Nội",
      type: "Công lập",
      minScore: 27.5,
      majors: ["Công nghệ thông tin", "Kỹ thuật điện", "Cơ khí", "Hóa học"],
      tuition: "24-30 triệu VNĐ/năm",
      ranking: 2,
      featured: true,
      description: "Trường đại học kỹ thuật hàng đầu Việt Nam",
      quota: 9680,
      students: 35000,
      establishedYear: 1956,
      website: "https://hust.edu.vn"
    },
    {
      id: 2,
      name: "Đại học FPT",
      code: "FPU",
      slug: "dai-hoc-fpt",
      image: "/images/fpu.jpg",
      location: "Hà Nội",
      type: "Tư thục",
      minScore: 22.0,
      majors: ["Công nghệ thông tin", "Kinh doanh", "Thiết kế đồ họa", "Marketing"],
      tuition: "65-70 triệu VNĐ/năm",
      ranking: 15,
      featured: false,
      description: "Trường tư thục mạnh về CNTT và Kinh doanh",
      quota: 5000,
      students: 15000,
      establishedYear: 2006,
      website: "https://fpt.edu.vn"
    },
    {
      id: 3,
      name: "Đại học Kinh tế Quốc dân",
      code: "NEU",
      slug: "dai-hoc-kinh-te-quoc-dan",
      image: "/images/neu.jpg",
      location: "Hà Nội",
      type: "Công lập",
      minScore: 26.5,
      majors: ["Kinh tế", "Tài chính", "Quản trị kinh doanh", "Kế toán"],
      tuition: "20-28 triệu VNĐ/năm",
      ranking: 5,
      featured: true,
      description: "Trường kinh tế hàng đầu Việt Nam",
      quota: 7200,
      students: 28000,
      establishedYear: 1956,
      website: "https://neu.edu.vn"
    },
    {
      id: 4,
      name: "Đại học Y Hà Nội",
      code: "HMU",
      slug: "dai-hoc-y-ha-noi",
      image: "/images/hmu.jpg",
      location: "Hà Nội",
      type: "Công lập",
      minScore: 28.0,
      majors: ["Y khoa", "Răng hàm mặt", "Dược học", "Y tế công cộng"],
      tuition: "25-35 triệu VNĐ/năm",
      ranking: 1,
      featured: true,
      description: "Trường y hàng đầu Việt Nam",
      quota: 2500,
      students: 12000,
      establishedYear: 1902,
      website: "https://hmu.edu.vn"
    },
    {
      id: 5,
      name: "Đại học Quốc gia TP.HCM",
      code: "VNU-HCM",
      slug: "dai-hoc-quoc-gia-tp-hcm",
      image: "/images/vnu-hcm.jpg",
      location: "TP. Hồ Chí Minh",
      type: "Công lập",
      minScore: 26.0,
      majors: ["Kinh tế", "Luật", "Khoa học tự nhiên", "Công nghệ thông tin"],
      tuition: "18-25 triệu VNĐ/năm",
      ranking: 1,
      featured: true,
      description: "Đại học đa ngành hàng đầu miền Nam",
      quota: 8500,
      students: 40000,
      establishedYear: 1995,
      website: "https://vnuhcm.edu.vn"
    }
  ]

  // Simulate API call
  useEffect(() => {
    setLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      let filtered = [...mockUniversities]
      
      // Filter by search query
      if (query) {
        filtered = filtered.filter(uni => 
          uni.name.toLowerCase().includes(query.toLowerCase()) ||
          uni.majors.some(major => major.toLowerCase().includes(query.toLowerCase()))
        )
      }
      
      // Filter by region
      if (region) {
        filtered = filtered.filter(uni => uni.location === region)
      }
      
      // Filter by type
      if (type) {
        filtered = filtered.filter(uni => uni.type === type)
      }
      
      // Filter by major
      if (major) {
        filtered = filtered.filter(uni => 
          uni.majors.some(m => m.toLowerCase().includes(major.toLowerCase()))
        )
      }
      
      // Sort results
      switch (sortBy) {
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'score':
          filtered.sort((a, b) => b.minScore - a.minScore)
          break
        case 'ranking':
          filtered.sort((a, b) => a.ranking - b.ranking)
          break
        case 'tuition':
          filtered.sort((a, b) => {
            const aTuition = parseInt(a.tuition.split('-')[0])
            const bTuition = parseInt(b.tuition.split('-')[0])
            return aTuition - bTuition
          })
          break
        default:
          // Relevance - featured first, then by ranking
          filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return a.ranking - b.ranking
          })
      }
      
      setUniversities(mockUniversities)
      setFilteredUniversities(filtered)
      setTotalResults(filtered.length)
      setLoading(false)
    }, 500)
  }, [query, region, type, major, sortBy])

  // Update URL when search changes
  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    setSearchParams(params)
  }

  // Handle filter changes
  const handleRegionChange = (value) => {
    updateSearchParams({ region: value })
    setCurrentPage(1)
  }

  const handleTypeChange = (value) => {
    updateSearchParams({ type: value })
    setCurrentPage(1)
  }

  // Paginated results
  const paginatedResults = filteredUniversities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Calculate pagination
  const totalPages = Math.ceil(totalResults / pageSize)
  const startResult = (currentPage - 1) * pageSize + 1
  const endResult = Math.min(currentPage * pageSize, totalResults)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                  <span className="ml-1">Trang chủ</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tìm kiếm</BreadcrumbPage>
              </BreadcrumbItem>
              {query && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{query}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm trường đại học, ngành học... (tự động tìm kiếm)"
                value={query}
                onChange={(e) => {
                  const newQuery = e.target.value
                  updateSearchParams({ q: newQuery })
                }}
                className="pl-10 h-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={region || undefined} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Tất cả khu vực</SelectItem>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="TP. Hồ Chí Minh">TP.HCM</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={type || undefined} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Tất cả loại</SelectItem>
                  <SelectItem value="Công lập">Công lập</SelectItem>
                  <SelectItem value="Tư thục">Tư thục</SelectItem>
                  <SelectItem value="Dân lập">Dân lập</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto p-4">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterSection 
                selectedRegion={region}
                setSelectedRegion={handleRegionChange}
                selectedType={type}
                setSelectedType={handleTypeChange}
              />
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6 md:flex-row flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Kết quả tìm kiếm
                  {query && (
                    <span className="ml-2 text-blue-600">"{query}"</span>
                  )}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Tìm thấy {totalResults} kết quả</span>
                  {(region || type) && (
                    <div className="flex items-center gap-2">
                      <span>Bộ lọc:</span>
                      {region && (
                        <Badge variant="secondary" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {region}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1 hover:bg-transparent"
                            onClick={() => handleRegionChange('clear')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      {type && (
                        <Badge variant="secondary" className="gap-1">
                          {type}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1 hover:bg-transparent"
                            onClick={() => handleTypeChange('clear')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Liên quan nhất</SelectItem>
                    <SelectItem value="name">Tên trường</SelectItem>
                    <SelectItem value="ranking">Xếp hạng</SelectItem>
                    <SelectItem value="score">Điểm chuẩn</SelectItem>
                    <SelectItem value="tuition">Học phí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                <Loading type="university" />
                <Loading type="university" />
                <Loading type="university" />
                <Loading type="university" />
                <Loading type="university" />
              </div>
            )}

            {/* No Results */}
            {!loading && totalResults === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Gợi ý:</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['Đại học Bách khoa', 'Công nghệ thông tin', 'Y khoa', 'Kinh tế'].map(suggestion => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => updateSearchParams({ q: suggestion })}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results List */}
            {!loading && totalResults > 0 && (
              <>
                <div className="space-y-4 mb-8">
                  {paginatedResults.map((university) => (
                    <UniversityCard 
                      key={university.id} 
                      university={university}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Hiển thị {startResult}-{endResult} của {totalResults} kết quả
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={currentPage === pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults