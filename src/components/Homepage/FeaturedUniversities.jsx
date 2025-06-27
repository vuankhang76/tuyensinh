import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import UniversityCard from './UniversityCard'
import Loading from '@/components/common/Loading/LoadingSkeleton'

const FeaturedUniversities = ({ universities, loading = false }) => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (universities && universities.length > 0) {
      setIsLoading(false)
    }
  }, [universities])

  const topUniversities = universities
    .filter(uni => uni.ranking && uni.ranking > 0)
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, 5);

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
          {!loading && topUniversities.length > 0 ? (
            topUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
              />
            ))
          ) : (
            <div className="space-y-4">
              <Loading type="university" />
              <Loading type="university" />
              <Loading type="university" />
              <Loading type="university" />
              <Loading type="university" />
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/search">
            <Button 
              size="lg"
              variant="default"
              className="h-12 px-8 cursor-pointer"
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