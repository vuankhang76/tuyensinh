import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertCircle,
  Home,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import {
  universityService,
  academicProgramService,
  majorService,
  admissionNewsService,
  admissionMethodService,
  admissionScoreService,
  scholarshipService
} from '@/services'

import Loading from '@/components/common/Loading/LoadingSkeleton'
import UniversityHero from '@/components/university/UniversityHero'
import UniversityStats from '@/components/university/UniversityStats'
import OverviewTab from '@/components/university/tabs/OverviewTab'
import ProgramsTab from '@/components/university/tabs/ProgramsTab'
import MajorsTab from '@/components/university/tabs/MajorsTab'
import AdmissionTab from '@/components/university/tabs/AdmissionTab'
import ScholarshipsTab from '@/components/university/tabs/ScholarshipsTab'
import NewsTab from '@/components/university/tabs/NewsTab'

const UniversityDetail = () => {
  const { id } = useParams()
  const [university, setUniversity] = useState(null)
  const [programs, setPrograms] = useState([])
  const [majors, setMajors] = useState([])
  const [admissionNews, setAdmissionNews] = useState([])
  const [admissionMethods, setAdmissionMethods] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [admissionScores, setAdmissionScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingStates, setLoadingStates] = useState({
    university: true,
    programs: true,
    majors: true,
    news: true,
    methods: true,
    scholarships: true,
    scores: true
  })

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!id) return
      try {
        setLoading(true)
        setError(null)
        const [
          universityResult,
          programsResult,
          majorsResult,
          newsResult,
          methodsResult,
          scholarshipsResult
        ] = await Promise.all([
          universityService.getUniversityById(id),
          academicProgramService.getProgramsByUniversity(id),
          majorService.getMajorsByUniversity(id),
          admissionNewsService.getAdmissionNewsByUniversity(id),
          admissionMethodService.getAdmissionMethodsByUniversity(id),
          scholarshipService.getScholarshipsByUniversity(id)
        ])

        setUniversity(universityResult)
        setLoadingStates(prev => ({ ...prev, university: false }))

        setPrograms(programsResult)
        setLoadingStates(prev => ({ ...prev, programs: false }))

        setMajors(majorsResult)
        setLoadingStates(prev => ({ ...prev, majors: false }))

        if (majorsResult.length > 0) {
          const scoresPromises = majorsResult.map(major =>
            admissionScoreService.getAdmissionScoresByMajor(major.id).catch(err => {
              return []
            })
          )

          try {
            const scoresResults = await Promise.allSettled(scoresPromises)
            const allScores = scoresResults
              .filter(result => result.status === 'fulfilled')
              .map(result => result.value)
              .flat()
            setAdmissionScores(allScores)
          } catch (err) {
            setAdmissionScores([])
          }
        } else {
          setAdmissionScores([])
        }
        setLoadingStates(prev => ({ ...prev, scores: false }))

        setAdmissionNews(newsResult)
        setLoadingStates(prev => ({ ...prev, news: false }))

        setAdmissionMethods(methodsResult)
        setLoadingStates(prev => ({ ...prev, methods: false }))

        setScholarships(scholarshipsResult)
        setLoadingStates(prev => ({ ...prev, scholarships: false }))

      } catch (error) {
        setError('Có lỗi xảy ra khi tải dữ liệu')
        toast.error('Không thể tải thông tin trường đại học')
      } finally {
        setLoading(false)
      }
    }

    fetchUniversityData()
  }, [id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: university?.name,
        text: `Xem thông tin ${university?.name}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép link chia sẻ!')
    }
  }

  const isDataLoading = Object.values(loadingStates).some(loading => loading)

  if (loading && isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading
          type="spinner"
          size="large"
          tip="Đang tải thông tin trường đại học..."
          className="py-8"
        />
      </div>
    )
  }

  if (error || !university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Không tìm thấy trường đại học'}
          </h2>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center">
                    <Home className="h-4 w-4" />
                    <span className="ml-1">Trang chủ</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/danh-sach-truong-dai-hoc">Danh sách trường</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{university.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <UniversityHero
        university={university}
        onShare={handleShare}
      />

      <UniversityStats
        programs={programs}
        majors={majors}
        scholarships={scholarships}
        admissionNews={admissionNews}
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="programs">Chương trình</TabsTrigger>
            <TabsTrigger value="majors">Ngành học</TabsTrigger>
            <TabsTrigger value="admission">Tuyển sinh</TabsTrigger>
            <TabsTrigger value="scholarships">Học bổng</TabsTrigger>
            <TabsTrigger value="news">Tin tức</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab university={university} />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsTab programs={programs} loading={loadingStates.programs} />
          </TabsContent>

          <TabsContent value="majors">
            <MajorsTab majors={majors} admissionScores={admissionScores} loading={loadingStates.majors} />
          </TabsContent>

          <TabsContent value="admission">
            <AdmissionTab admissionMethods={admissionMethods} loading={loadingStates.methods} />
          </TabsContent>

          <TabsContent value="scholarships">
            <ScholarshipsTab scholarships={scholarships} loading={loadingStates.scholarships} />
          </TabsContent>

          <TabsContent value="news">
            <NewsTab admissionNews={admissionNews} loading={loadingStates.news} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UniversityDetail