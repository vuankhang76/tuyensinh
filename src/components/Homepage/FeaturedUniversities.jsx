import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import UniversityCard from './UniversityCard'

const FeaturedUniversities = ({ universities }) => {
  // Lấy top 5 trường có ranking cao nhất (số thấp = ranking cao)
  const topUniversities = universities
    .filter(uni => uni.ranking && uni.ranking > 0) // Chỉ lấy trường có ranking
    .sort((a, b) => a.ranking - b.ranking) // Sắp xếp tăng dần (1, 2, 3...)
    .slice(0, 5); // Chỉ lấy 5 trường đầu

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trường đại học nổi bật
          </h2>
          <p className="text-muted-foreground text-lg">
            Những trường đại học hàng đầu Việt Nam được quan tâm nhiều nhất
          </p>
        </div>

        <div className="space-y-3">
          {topUniversities.length > 0 ? (
            topUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🏫</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có dữ liệu xếp hạng
              </h3>
              <p className="text-gray-500">
                Hệ thống đang cập nhật thông tin xếp hạng các trường đại học
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/search">
            <Button 
              size="lg"
              className="h-12 px-8 font-medium"
            >
              Khám phá tất cả trường đại học →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedUniversities