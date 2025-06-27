import React from 'react'
import {
  BookOpen,
  GraduationCap,
  Award,
  Info
} from 'lucide-react'

const UniversityStats = ({ programs, majors, scholarships, admissionNews }) => {
  const stats = [
    {
      value: programs.length,
      label: 'Chương trình đào tạo',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      value: majors.length,
      label: 'Ngành học',
      icon: GraduationCap,
      color: 'text-green-600'
    },
    {
      value: scholarships.length,
      label: 'Học bổng',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      value: admissionNews.length,
      label: 'Tin tức tuyển sinh',
      icon: Info,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg text-center border transition-shadow"
              >
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Icon className="h-4 w-4" />
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UniversityStats 