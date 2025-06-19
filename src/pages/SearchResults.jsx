import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Command, CommandInput } from '@/components/ui/command'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import {
  Filter,
  ArrowUpDown,
  Home,
  MapPin,
  X,
  ChevronDown
} from 'lucide-react'
import UniversityCard from '../components/Homepage/UniversityCard'
import FilterSection from '../components/Homepage/FilterSection'
import Loading from '../components/common/Loading/LoadingSkeleton'
import { Link } from 'react-router-dom'
import { useDebounce } from '@/hooks/useDebounce'
import universityService from '../services/universityService'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
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

  // Debounced search value
  const debouncedSearchInput = useDebounce(searchInput, 500)

  // Update URL when debounced search value changes
  useEffect(() => {
    if (debouncedSearchInput !== query) {
      updateSearchParams({ q: debouncedSearchInput })
    }
  }, [debouncedSearchInput])

  // Sync search input with URL params when navigating
  useEffect(() => {
    if (query !== searchInput) {
      setSearchInput(query)
    }
  }, [query, searchInput])

  // Fetch and filter universities from API
  useEffect(() => {
    const fetchAndFilterUniversities = async () => {
      try {
        setLoading(true)

        const data = await universityService.searchUniversities(query, {
          type: type,
          region: region
        })

        // Transform API data to match component expectations
        const transformedData = data.map(uni => ({
          id: uni.id,
          name: uni.name,
          code: uni.shortName || uni.name.split(' ').map(w => w[0]).join(''),
          slug: uni.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
          image: `/images/${uni.shortName?.toLowerCase() || 'default'}.jpg`,
          location: Array.isArray(uni.locations) ? uni.locations[0] : uni.locations || 'Chưa cập nhật',
          type: uni.type || 'Chưa phân loại',
          minScore: 0, // API không có thông tin này
          majors: [], // API không có thông tin này
          tuition: 'Liên hệ nhà trường',
          ranking: uni.ranking || 0,
          featured: uni.ranking <= 10,
          description: uni.introduction || 'Chưa có mô tả',
          quota: 0,
          students: 0,
          establishedYear: 1900,
          website: uni.officialWebsite,
          admissionWebsite: uni.admissionWebsite
        }))

        let filtered = [...transformedData]

        // Apply additional filters
        if (major) {
          filtered = filtered.filter(uni =>
            uni.majors.some(m => m.toLowerCase().includes(major.toLowerCase()))
          )
        }

        // Apply sorting
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
            // Since we don't have actual tuition data, sort by name as fallback
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
        console.error('Error fetching universities:', error)
        // Set empty results on error
        setUniversities([])
        setFilteredUniversities([])
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    }

    fetchAndFilterUniversities()
  }, [query, region, type, major, sortBy])

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

  const handleRegionChange = (value) => {
    updateSearchParams({ region: value === 'clear' ? '' : value })
    setCurrentPage(1)
  }

  const handleTypeChange = (value) => {
    updateSearchParams({ type: value === 'clear' ? '' : value })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchInput('')
    updateSearchParams({ q: '', region: '', type: '', major: '' })
    setCurrentPage(1)
  }

  const handleSuggestionClick = (suggestion) => {
    const params = new URLSearchParams(searchParams)
    params.set('q', suggestion)
    setSearchParams(params)
    setSearchInput(suggestion)
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
                <BreadcrumbLink href="/" className="flex items-center">
                  <Home className="h-4 w-4" />
                  <span className="ml-1 font-normal text-foreground">Trang chủ</span>
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
              <Command className="rounded-lg border border-gray-200 focus:border-gray-500">
                <CommandInput
                  placeholder="Tìm kiếm trường đại học, ngành học..."
                  value={searchInput}
                  onValueChange={setSearchInput}
                />
                {searchInput !== query && (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    Đang tìm...
                  </div>
                )}
              </Command>
            </div>

            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[150px] justify-between">
                    {region || "Khu vực"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                  <DropdownMenuItem onClick={() => handleRegionChange('clear')}>
                    Tất cả khu vực
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegionChange('Hà Nội')}>
                    Hà Nội
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegionChange('TP. Hồ Chí Minh')}>
                    TP.HCM
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegionChange('Đà Nẵng')}>
                    Đà Nẵng
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRegionChange('Khác')}>
                    Khác
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[120px] justify-between">
                    {type || "Loại hình"}
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

              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>

              {(query || region || type) && (
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
                  <SelectTrigger className="w-[180px]">
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
                            onClick={() => handleSuggestionClick(suggestion)}
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