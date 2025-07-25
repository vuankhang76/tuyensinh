import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Search, Filter, Clock, ExternalLink } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { admissionNewsService } from '@/services/admissionNewsService'
import { useDebounce } from '@/hooks/useDebounce'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import Loading from '@/components/common/Loading/LoadingSkeleton'
import { Home } from 'lucide-react'

const AllNews = () => {
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const newsPerPage = 10

  const debouncedSearchTerm = useDebounce(searchInput, 500)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const newsData = await admissionNewsService.getAllAdmissionNews()
        const newsArray = Array.isArray(newsData) ? newsData : []
        const sortedNews = newsArray.sort((a, b) =>
          new Date(b.publishDate) - new Date(a.publishDate)
        )
        setNews(sortedNews)
        setFilteredNews(sortedNews)
      } catch (err) {
        setError('Không thể tải tin tức')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  useEffect(() => {
    const filterAndSort = () => {
      setIsFiltering(true)
      setTimeout(() => {
        let filtered = news.filter(article =>
          article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          article.universityName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )

        switch (sortBy) {
          case 'newest':
            filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            break
          case 'oldest':
            filtered.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
            break
          case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title))
            break
          default:
            break
        }

        setFilteredNews(filtered)
        setCurrentPage(1)
        setIsFiltering(false)
        setIsSearching(false)
      }, 300)
    }

    if (news.length > 0) {
      filterAndSort()
    }
  }, [debouncedSearchTerm, sortBy, news])

  const indexOfLastNews = currentPage * newsPerPage
  const indexOfFirstNews = indexOfLastNews - newsPerPage
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews)
  const totalPages = Math.ceil(filteredNews.length / newsPerPage)

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <BreadcrumbPage>Tin tức tuyển sinh</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Tất cả tin tức tuyển sinh
              </h1>
              <p className="text-gray-600 text-lg">
                Cập nhật thông tin tuyển sinh mới nhất từ các trường đại học
              </p>
            </div>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-slate-300 rounded w-24"></div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Tổng cộng {filteredNews.length} tin tức</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm tin tức theo tiêu đề, nội dung hoặc trường đại học..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  if (e.target.value.trim() !== searchInput.trim()) {
                    setIsSearching(true)
                  }
                }}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={(value) => {
                if (value !== sortBy) {
                  setIsFiltering(true)
                }
                setSortBy(value)
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="title">Theo tiêu đề</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      {(loading || isSearching || isFiltering) && (
        <div className="space-y-4 container mx-auto py-4">
          {[...Array(5)].map((_, i) => (
            <Loading key={i} type="news" />
          ))}
        </div>
      )}
      {!loading && !isSearching && !isFiltering && (
        <div className="container mx-auto px-4 py-4">
          {filteredNews.length === 0 ? (
            <Card className='mb-4'>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    {debouncedSearchTerm ? 'Không tìm thấy tin tức phù hợp' : 'Chưa có tin tức nào'}
                  </p>
                  {debouncedSearchTerm && (
                    <Button onClick={() => setSearchInput('')} variant="outline">
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className='mb-8'>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {currentNews.map((article, index) => (
                      <AccordionItem
                        key={article.id}
                        value={`item-${index}`}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <AccordionTrigger className="hover:no-underline px-6 py-5 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col items-start gap-3 text-left w-full">
                            <div className="flex items-center gap-3 flex-wrap">
                              {article.universityName && (
                                <span className="text-sm text-blue-600 flex items-center">
                                  {article.universityName}
                                </span>
                              )}
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="mr-1.5 h-3 w-3" />
                                {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                              {article.title}
                            </h3>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-4">
                            <div className="prose prose-gray max-w-none">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {article.content}
                              </p>
                            </div>

                            {article.externalLink && (
                              <div className="pt-4 border-t border-gray-100">
                                <a
                                  href={article.externalLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <span>Xem chi tiết</span>
                                  <ExternalLink className="w-4 h-4 ml-1" />
                                </a>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <div className="flex flex-col items-center mb-4">
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
      )}
    </div>
  )
}

export default AllNews 