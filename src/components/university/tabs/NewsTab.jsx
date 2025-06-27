import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Info,
  ExternalLink
} from 'lucide-react'

const NewsTab = ({ admissionNews, loading }) => {
  if (loading) {
    return <Loading type="skeleton" className="h-32" />
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

  return (
    <div className="space-y-6">
      {newsArray.map((newsItem, index) => (
        <Card key={newsItem.id || index} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="text-sm text-blue-600 min-w-fit bg-blue-50 px-3 py-1 rounded-full">
                {new Date(newsItem.publishedDate || newsItem.createdAt).toLocaleDateString('vi-VN')}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                  {newsItem.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {newsItem.content || newsItem.description}
                </p>
                {newsItem.url && (
                  <a
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                  >
                    Xem chi tiết
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default NewsTab 