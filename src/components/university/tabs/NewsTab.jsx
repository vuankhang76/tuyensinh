import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Info,
  Calendar,
  Building2
} from 'lucide-react'

const NewsTab = ({ admissionNews, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Đang tải tin tức tuyển sinh...</p>
        </CardContent>
      </Card>
    )
  }

  const newsArray = Array.isArray(admissionNews) ? admissionNews : []
  
  if (newsArray.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Info className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có tin tức</h3>
          <p className="text-gray-500 text-center">Tin tức tuyển sinh sẽ được cập nhật sớm.</p>
        </CardContent>
      </Card>
    )
  }

  const formatContent = (content) => {
    if (!content) return ''
    
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null
      
      if (paragraph.trim().match(/^[-•]\s/)) {
        return (
          <li key={index} className="ml-4 text-gray-700 leading-relaxed">
            {paragraph.trim().replace(/^[-•]\s/, '')}
          </li>
        )
      }
      
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-2">
          {paragraph.trim()}
        </p>
      )
    }).filter(Boolean)
  }

  return (
    <div className="space-y-6">
      {newsArray.map((newsItem, index) => (
        <Card key={newsItem.id || index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between items-start gap-4">
              <h3 className="text-lg font-bold text-gray-800 leading-tight">
                {newsItem.title}
              </h3>
              <div className="flex flex-col gap-2 items-end min-w-fit">
                <Badge variant="outline" className="whitespace-nowrap">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(newsItem.publishDate).toLocaleDateString('vi-VN')}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {formatContent(newsItem.content)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default NewsTab 