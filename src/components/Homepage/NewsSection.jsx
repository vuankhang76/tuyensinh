import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Building2, ExternalLink } from 'lucide-react'
import { admissionNewsService } from '@/services/admissionNewsService'
import { NewsSkeleton } from '@/components/common/Loading/LoadingSkeleton'
const NewsSection = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const newsData = await admissionNewsService.getLatestAdmissionNews(4)
        
        const newsArray = Array.isArray(newsData) ? newsData : []
        
        const sortedNews = newsArray.sort((a, b) => 
          new Date(b.publishDate) - new Date(a.publishDate)
        )
        
        setNews(sortedNews)
      } catch (err) {
        setError('Không thể tải tin tức')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <NewsSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">Chưa có tin tức nào</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Tin tức tuyển sinh
            </h2>
            <p className="text-gray-600">
              Tin tức tuyển sinh mới nhất được cập nhật
            </p>
          </div>
          <Link to="/tin-tuc">
            <Button variant="outline">
              Xem tất cả tin tức
            </Button>
          </Link>
        </div>

        <div className="">
          <Accordion type="single" collapsible className="w-full">
            {news.map((article, index) => (
              <AccordionItem 
                key={article.id} 
                value={`item-${index}`}
                className="border-b border-gray-300 last:border-b"
              >
                <AccordionTrigger className="hover:no-underline px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-start gap-3 text-left w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      {article.universityName && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <span className="font-medium">{article.universityName}</span>
                        </div>
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
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default NewsSection