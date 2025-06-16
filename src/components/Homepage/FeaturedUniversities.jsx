import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import UniversityCard from './UniversityCard'

const FeaturedUniversities = ({ universities }) => {
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
          {universities.map((university) => (
            <UniversityCard 
              key={university.id}
              university={university}
            />
          ))}
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