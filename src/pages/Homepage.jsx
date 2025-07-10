import React, { useState, useEffect } from 'react'
import SearchSection from '../components/Homepage/SearchSection'
import FeaturedUniversities from '../components/Homepage/FeaturedUniversities'
import NewsSection from '../components/Homepage/NewsSection'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import universityService from '../services/universityService'

const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [universities, setUniversities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch universities from API
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setLoading(true)
                const data = await universityService.getAllUniversities()
                
                const transformedData = data.map(uni => ({
                    id: uni.id,
                    name: uni.name,
                    code: uni.shortName || uni.name.split(' ').map(w => w[0]).join(''),
                    slug: uni.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                    logo: uni.logo,
                    location: Array.isArray(uni.locations) ? uni.locations[0] : uni.locations || 'Chưa cập nhật',
                    type: uni.type || 'Chưa phân loại',
                    minScore: 0,
                    majors: [],
                    tuition: 'Liên hệ nhà trường',
                    ranking: uni.ranking || 0,
                    featured: uni.ranking <= 10,
                    description: uni.introduction || 'Chưa có mô tả',
                    quota: 0,
                    students: 0,
                    website: uni.officialWebsite,
                    admissionWebsite: uni.admissionWebsite
                }))
                
                setUniversities(transformedData)
            } catch (err) {
                setError('Không thể tải dữ liệu trường đại học')
                setUniversities([])
            } finally {
                setLoading(false)
            }
        }

        fetchUniversities()
    }, [])

    if (sortBy) {
        switch (sortBy) {
            case 'name':
                filteredUniversities.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'score':
                filteredUniversities.sort((a, b) => b.minScore - a.minScore)
                break
            case 'ranking':
                filteredUniversities.sort((a, b) => a.ranking - b.ranking)
                break
            case 'tuition':
                filteredUniversities.sort((a, b) => {
                    const aTuition = parseInt(a.tuition.split('-')[0])
                    const bTuition = parseInt(b.tuition.split('-')[0])
                    return aTuition - bTuition
                })
                break
            default:
                break
        }
    }

    return (
        
        <div className="min-h-screen bg-gray-50">
            <section className="bg-gradient-to-r text-white py-18">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl text-black font-bold mb-6">
                        Thông tin tuyển sinh
                    </h1>
                    <p className="text-xl text-black mb-8 opacity-90">
                        Tìm thông tin trường đại học Việt Nam dễ dàng
                    </p>
                    <SearchSection
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-black">200+</div>
                            <div className="text-sm md:text-base opacity-80 text-black">Trường đại học</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-black">500+</div>
                            <div className="text-sm md:text-base opacity-80 text-black">Ngành nghề</div>
                        </div>
                        <div className="text-center col-span-2 md:col-span-1 flex flex-col items-center">
                            <div className="text-3xl md:text-4xl font-bold text-black">1M+</div>
                            <div className="text-sm md:text-base opacity-80 text-black">Chỉ tiêu</div>
                        </div>
                    </div>
                </div>
            </section>
            <FeaturedUniversities universities={universities} />
            <NewsSection />
        </div>
    )
}

export default Homepage