import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Loading from '@/components/common/Loading/LoadingSkeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import {
  ArrowUpDown,
  Home,
  MapPin,
  X,
  ChevronDown,
  School,
  Search
} from 'lucide-react'
import UniversityCard from '../components/Homepage/UniversityCard'
import { useDebounce } from '@/hooks/useDebounce'
import universityService from '../services/universityService'

const AllUniversities = React.memo(() => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalResults, setTotalResults] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const region = searchParams.get('region')
  const type = searchParams.get('type')

  const debouncedSearchInput = useDebounce(searchInput, 500)

  useEffect(() => {
    if (debouncedSearchInput.trim()) {
      setIsSearching(false)
      navigate(`/search?q=${encodeURIComponent(debouncedSearchInput.trim())}`)
    }
  }, [debouncedSearchInput, navigate])

  useEffect(() => {
    const fetchAllUniversities = async () => {
      try {
        setLoading(true)

        const data = await universityService.searchUniversities('', {
          type: type,
          region: region
        })

        const transformedData = data.map(uni => ({
          id: uni.id,
          name: uni.name,
          code: uni.shortName || uni.name.split(' ').map(w => w[0]).join(''),
          logo: uni.logo,
          location: Array.isArray(uni.locations) ? uni.locations[0] : uni.locations || 'Chưa cập nhật',
          type: uni.type || 'Chưa phân loại',
          majors: [],
          tuition: 'Liên hệ nhà trường',
          ranking: uni.ranking || 0,
          featured: uni.ranking <= 10,
          description: uni.introduction || 'Chưa có mô tả',
          quota: 0,
          students: 0,
          website: uni.officialWebsite,
          admissionWebsite: uni.admissionWebsite
        }))

        let filtered = [...transformedData]

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
            filtered.sort((a, b) => a.name.localeCompare(b.name))
            break
          default:
            filtered.sort((a, b) => {
              if (a.featured && !b.featured) return -1
              if (!a.featured && b.featured) return 1
              return a.ranking - b.ranking
            })
        }

        setUniversities(transformedData)
        setFilteredUniversities(filtered)
        setTotalResults(filtered.length)
      } catch (error) {
        setUniversities([])
        setFilteredUniversities([])
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    }

    fetchAllUniversities()
  }, [region, type, sortBy])

  const handleRegionChange = useCallback((value) => {
    const regionValue = value === 'clear' ? '' : value
    if (regionValue) {
      navigate(`/search?region=${encodeURIComponent(regionValue)}`)
    } else if (type) {
      navigate(`/search?type=${encodeURIComponent(type)}`)
    } else {
      setCurrentPage(1)
    }
  }, [navigate, type])

  const handleTypeChange = useCallback((value) => {
    const typeValue = value === 'clear' ? '' : value
    if (typeValue) {
      navigate(`/search?type=${encodeURIComponent(typeValue)}`)
    } else if (region) {
      navigate(`/search?region=${encodeURIComponent(region)}`)
    } else {
      setCurrentPage(1)
    }
  }, [navigate, region])

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams()
    setSearchParams(params)
    setCurrentPage(1)
  }, [setSearchParams])

  const handleSearch = useCallback(() => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }, [searchInput, navigate])

  const handleSearchInputChange = useCallback((e) => {
    setSearchInput(e.target.value)
    if (e.target.value.trim()) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  const paginatedResults = filteredUniversities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalPages = Math.ceil(totalResults / pageSize)
  const startResult = (currentPage - 1) * pageSize + 1
  const endResult = Math.min(currentPage * pageSize, totalResults)

  const RegionOptions = [
    { value: 'clear', label: 'Tất cả khu vực' },
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'An Giang', label: 'An Giang' },
    { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
    { value: 'Bắc Giang', label: 'Bắc Giang' },
    { value: 'Bắc Kạn', label: 'Bắc Kạn' },
    { value: 'Bạc Liêu', label: 'Bạc Liêu' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' },
    { value: 'Bến Tre', label: 'Bến Tre' },
    { value: 'Bình Định', label: 'Bình Định' },
    { value: 'Bình Dương', label: 'Bình Dương' },
    { value: 'Bình Phước', label: 'Bình Phước' },
    { value: 'Bình Thuận', label: 'Bình Thuận' },
    { value: 'Cà Mau', label: 'Cà Mau' },
    { value: 'Cần Thơ', label: 'Cần Thơ' },
    { value: 'Cao Bằng', label: 'Cao Bằng' },
    { value: 'Đắk Lắk', label: 'Đắk Lắk' },
    { value: 'Đắk Nông', label: 'Đắk Nông' },
    { value: 'Điện Biên', label: 'Điện Biên' },
    { value: 'Đồng Nai', label: 'Đồng Nai' },
    { value: 'Đồng Tháp', label: 'Đồng Tháp' },
    { value: 'Gia Lai', label: 'Gia Lai' },
    { value: 'Hà Giang', label: 'Hà Giang' },
    { value: 'Hà Nam', label: 'Hà Nam' },
    { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
    { value: 'Hải Dương', label: 'Hải Dương' },
    { value: 'Hải Phòng', label: 'Hải Phòng' },
    { value: 'Hậu Giang', label: 'Hậu Giang' },
    { value: 'Hòa Bình', label: 'Hòa Bình' },
    { value: 'Hưng Yên', label: 'Hưng Yên' },
    { value: 'Khánh Hòa', label: 'Khánh Hòa' },
    { value: 'Kiên Giang', label: 'Kiên Giang' },
    { value: 'Kon Tum', label: 'Kon Tum' },
    { value: 'Lai Châu', label: 'Lai Châu' },
    { value: 'Lâm Đồng', label: 'Lâm Đồng' },
    { value: 'Lạng Sơn', label: 'Lạng Sơn' },
    { value: 'Lào Cai', label: 'Lào Cai' },
    { value: 'Long An', label: 'Long An' },
    { value: 'Nam Định', label: 'Nam Định' },
    { value: 'Nghệ An', label: 'Nghệ An' },
    { value: 'Ninh Bình', label: 'Ninh Bình' },
    { value: 'Ninh Thuận', label: 'Ninh Thuận' },
    { value: 'Phú Thọ', label: 'Phú Thọ' },
    { value: 'Phú Yên', label: 'Phú Yên' },
    { value: 'Quảng Bình', label: 'Quảng Bình' },
    { value: 'Quảng Nam', label: 'Quảng Nam' },
    { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
    { value: 'Quảng Ninh', label: 'Quảng Ninh' },
    { value: 'Quảng Trị', label: 'Quảng Trị' },
    { value: 'Sóc Trăng', label: 'Sóc Trăng' },
    { value: 'Sơn La', label: 'Sơn La' },
    { value: 'Tây Ninh', label: 'Tây Ninh' },
    { value: 'Thái Bình', label: 'Thái Bình' },
    { value: 'Thái Nguyên', label: 'Thái Nguyên' },
    { value: 'Thanh Hóa', label: 'Thanh Hóa' },
    { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
    { value: 'Tiền Giang', label: 'Tiền Giang' },
    { value: 'Trà Vinh', label: 'Trà Vinh' },
    { value: 'Tuyên Quang', label: 'Tuyên Quang' },
    { value: 'Vĩnh Long', label: 'Vĩnh Long' },
    { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
    { value: 'Yên Bái', label: 'Yên Bái' },
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center">
                    <Home className="h-4 w-4" />
                    <span className="ml-1">Trang chủ</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Danh sách trường</BreadcrumbPage>
              </BreadcrumbItem>
              {region && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{region}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              {type && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{type}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white">
        <div className="container mx-auto p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  placeholder="Tìm kiếm trường đại học, ngành học..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  type="text"
                />
                {isSearching && searchInput.trim() && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    Đang tìm...
                  </div>
                )}
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  variant="ghost"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-between">
                      {region || "Tất cả khu vực"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[150px]">
                    <ScrollArea className="h-[200px]">
                      {RegionOptions.map((option, index) => (
                        <DropdownMenuItem key={`region-${option.value}-${index}`} onClick={() => handleRegionChange(option.value)}>
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-between">
                      {type || "Tất cả loại hình"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[120px]">
                    <DropdownMenuItem onClick={() => handleTypeChange('clear')}>
                      Tất cả loại
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeChange('Công lập')}>
                      Công lập
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeChange('Tư thục')}>
                      Tư thục
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeChange('Dân lập')}>
                      Dân lập
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {(region || type) && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto p-4">
        <div className="flex gap-8">
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6 md:flex-row flex-col gap-4">
              <div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-slate-300 rounded w-24"></div>
                    </div>
                  ) : (
                    <span>Tìm thấy {totalResults} trường đại học</span>
                  )}
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
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Nổi bật nhất</SelectItem>
                    <SelectItem value="name">Tên trường</SelectItem>
                    <SelectItem value="ranking">Xếp hạng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {loading && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Loading key={i} type="university" />
                ))}
              </div>
            )}
            {!loading && totalResults === 0 && (
              <div className="text-center py-12">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Không tìm thấy trường đại học nào
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Hãy thử điều chỉnh bộ lọc để xem kết quả khác
                    </p>
                  </div>
              </div>
            )}
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

                <div className="flex flex-col items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Hiển thị {startResult}-{endResult} của {totalResults} trường
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
})

export default AllUniversities 