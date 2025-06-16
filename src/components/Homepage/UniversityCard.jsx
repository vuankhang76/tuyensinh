import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Trophy, 
  Users,
  DollarSign,
  Heart,
  BookOpen
} from 'lucide-react'

const UniversityCard = ({ university }) => {
  const [isFavorited, setIsFavorited] = useState(false)

  const getTypeVariant = (type) => {
    switch (type) {
      case 'Công lập': return 'default'
      case 'Tư thục': return 'secondary'
      case 'Dân lập': return 'outline'
      default: return 'default'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Logo Section */}
          <div className="mr-6 w-full md:w-auto flex justify-center md:justify-start mb-4 md:mb-0">
            <div className="w-24 h-24 bg-muted border-2 border-border rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={university.logo || `/api/placeholder/80/80`} 
                alt={`${university.name} logo`}
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center hidden">
                <span className="text-primary font-bold text-lg">{university.code}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* University Info */}
              <div className="flex-1 lg:pr-6">
                {/* Header */}
                <div className="mb-3">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground truncate mr-1">
                      {university.name} ({university.code})
                    </h3>
                    <Badge variant={getTypeVariant(university.type)}>{university.type}</Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="text-primary h-4 w-4 mr-1" />
                    <span>{university.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="text-yellow-500 h-4 w-4 mr-1" />
                    <span>Điểm chuẩn: {university.minScore}+</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-green-500 h-4 w-4 mr-1" />
                    <span>{university.students?.toLocaleString()} sinh viên</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-purple-500 h-4 w-4 mr-1" />
                    <span>{university.tuition?.split(' ')[0]}tr/năm</span>
                  </div>
                </div>

                {/* Major Tags */}
                <div className="flex items-center gap-2 mb-2 lg:mb-0">
                  <BookOpen className="text-primary h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {university.majors.slice(0, 3).map((major, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                      >
                        {major}
                      </span>
                    ))}
                    {university.majors.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                        +{university.majors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 lg:mt-0 w-full md:w-auto">
                {/* Compare Button */}
                <Button variant="outline" size="default" className="px-4">
                  So sánh
                </Button>
                
                {/* View Details Button */}
                <Link to={`/university/${university.slug}`}>
                  <Button 
                    size="default"
                    className="px-6 font-medium w-full"
                  >
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UniversityCard