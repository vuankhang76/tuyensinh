import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Globe,
  MapPin,
  Phone,
  Heart,
  Share,
  ExternalLink,
  Mail,
  Building2,
  Shield,
  ShieldCheck
} from 'lucide-react'

const UniversityHero = ({ university, onShare }) => {
  const getLocationString = (locations) => {
    if (!locations) return 'Chưa có thông tin'
    if (typeof locations === 'string') return locations
    if (Array.isArray(locations)) return locations.join(', ')
    return 'Chưa có thông tin'
  }

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="h-20 w-20 flex-shrink-0 rounded-md flex items-center justify-center border-none">
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

          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default" className="text-xs">
                {university.type}
              </Badge>
              {university.isVerified ? (
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Đã xác thực
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Chưa xác thực
                </Badge>
              )}
              {getLocationString(university.locations).split(',').filter(loc => loc !== '').map((location, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {location}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {university.name}
            </h1>
            <p className="text-lg text-gray-600">
              {university.shortName || university.code}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {university.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{university.address}</span>
                </div>
              )}
              {university.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{university.phone}</span>
                </div>
              )}
              {university.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${university.email}`} className="text-blue-600 hover:text-blue-800">
                    {university.email}
                  </a>
                </div>
              )}
              {university.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Website chính thức
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniversityHero 