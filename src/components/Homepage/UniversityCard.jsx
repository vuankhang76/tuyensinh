import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Trophy,
  Building2,
  Globe
} from 'lucide-react'

const UniversityCard = ({ university }) => {

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="mr-6 w-full md:w-auto flex justify-center md:justify-start mb-4 md:mb-0">
            <div className="h-16 w-16 flex-shrink-0 rounded-md flex items-center justify-center border-none">
              {university.logo ? (
                <img
                  src={university.logo}
                  alt={`Logo ${university.name}`}
                  className="h-full w-full object-contain mix-blend-multiply"
                  loading="lazy"
                />
              ) : (
                <Building2 className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 items-center lg:pr-6">
                <div className="mb-3">
                  <div className="flex items-center flex-wrap ">
                    <h3 className="text-xl font-bold text-foreground truncate mr-1">
                      {university.name} ({university.code})
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <MapPin className="text-primary h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{university.location || 'Chưa cập nhật'}</span>
                  </div>
                    <div className="flex items-center">
                      <Trophy className="text-yellow-500 h-4 w-4 mr-1" />
                      <span>Xếp hạng: {university.ranking || 'Không có'}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={(university.type)}>{university.type}</Badge>
                    </div>
                </div>

                  <div className="flex items-center flex-wrap ">
                    <Globe className="text-muted-foreground h-4 w-4 mr-1" />
                    <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground truncate mr-1 hover:underline hover:text-primary">
                      {university.website}
                    </a>
                  </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 lg:mt-0 w-full md:w-auto">
                <Link to={`/danh-sach-truong-dai-hoc/${university.id}`}>
                  <Button
                    size="default"
                    variant="secondary"
                    className="px-6 font-medium w-full cursor-pointer hover:bg-zinc-200"
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