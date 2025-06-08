import React, { useState } from 'react'
import SearchSection from '../components/Homepage/SearchSection'
import UniversityCard from '../components/Homepage/UniversityCard'
import FilterSection from '../components/Homepage/FilterSection'
import FeaturedUniversities from '../components/Homepage/FeaturedUniversities'
import NewsSection from '../components/Homepage/NewsSection'
import { Select, Button, Card, Statistic } from 'antd'

const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('')
    const [selectedType, setSelectedType] = useState('')

    // Mock data cho các trường đại học
    const universities = [
        {
            id: 1,
            name: "Đại học Bách khoa Hà Nội",
            code: "HUST",
            slug: "dai-hoc-bach-khoa-ha-noi",
            image: "/images/hust.jpg",
            location: "Hà Nội",
            type: "Công lập",
            minScore: 27.5,
            majors: ["Công nghệ thông tin", "Kỹ thuật điện", "Cơ khí"],
            tuition: "24-30 triệu VNĐ/năm",
            ranking: 2,
            featured: true,
            description: "Trường đại học kỹ thuật hàng đầu Việt Nam",
            quota: 9680,
            students: 35000
        },
        {
            id: 2,
            name: "Đại học Quốc gia TP.HCM",
            code: "VNU-HCM",
            slug: "dai-hoc-quoc-gia-tp-hcm",
            image: "/images/vnu-hcm.jpg",
            location: "TP. Hồ Chí Minh",
            type: "Công lập",
            minScore: 26.0,
            majors: ["Kinh tế", "Luật", "Khoa học tự nhiên"],
            tuition: "18-25 triệu VNĐ/năm",
            ranking: 1,
            featured: true,
            description: "Đại học đa ngành hàng đầu miền Nam",
            quota: 8500,
            students: 40000
        },
        {
            id: 3,
            name: "Đại học FPT",
            code: "FPU",
            slug: "dai-hoc-fpt",
            image: "/images/fpu.jpg",
            location: "Hà Nội",
            type: "Tư thục",
            minScore: 22.0,
            majors: ["Công nghệ thông tin", "Kinh doanh", "Thiết kế đồ họa"],
            tuition: "65-70 triệu VNĐ/năm",
            ranking: 15,
            featured: false,
            description: "Trường tư thục mạnh về CNTT và Kinh doanh",
            quota: 5000,
            students: 15000
        },
        {
            id: 4,
            name: "Đại học Kinh tế Quốc dân",
            code: "NEU",
            slug: "dai-hoc-kinh-te-quoc-dan",
            image: "/images/neu.jpg",
            location: "Hà Nội",
            type: "Công lập",
            minScore: 26.5,
            majors: ["Kinh tế", "Tài chính", "Quản trị kinh doanh"],
            tuition: "20-28 triệu VNĐ/năm",
            ranking: 5,
            featured: true,
            description: "Trường kinh tế hàng đầu Việt Nam",
            quota: 6000,
            students: 25000
        },
        {
            id: 5,
            name: "Đại học Y Hà Nội",
            code: "HMU",
            slug: "dai-hoc-y-ha-noi",
            image: "/images/hmu.jpg",
            location: "Hà Nội",
            type: "Công lập",
            minScore: 28.0,
            majors: ["Y khoa", "Răng hàm mặt", "Dược học"],
            tuition: "25-35 triệu VNĐ/năm",
            ranking: 3,
            featured: true,
            description: "Trường y khoa hàng đầu Việt Nam",
            quota: 1500,
            students: 8000
        },
        {
            id: 6,
            name: "Đại học Ngoại thương",
            code: "FTU",
            slug: "dai-hoc-ngoai-thuong",
            image: "/images/ftu.jpg",
            location: "Hà Nội",
            type: "Công lập",
            minScore: 27.0,
            majors: ["Kinh tế đối ngoại", "Ngoại ngữ", "Luật"],
            tuition: "22-30 triệu VNĐ/năm",
            ranking: 6,
            featured: false,
            description: "Trường chuyên về kinh tế đối ngoại",
            quota: 4500,
            students: 18000
        }
    ]

    const filteredUniversities = universities.filter(uni => {
        return (
            uni.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedRegion === '' || uni.location.includes(selectedRegion)) &&
            (selectedType === '' || uni.type === selectedType)
        )
    })

    const featuredUniversities = universities.filter(uni => uni.featured)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r text-white py-15">
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

            {/* Featured Universities */}
            <FeaturedUniversities universities={featuredUniversities} />

            {/* Filter and Results Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:w-1/4">
                        <FilterSection
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                        />
                    </div>

                    {/* University List */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Danh sách trường đại học
                                </h2>
                                <p className="text-gray-600">
                                    Tìm thấy {filteredUniversities.length} trường đại học
                                </p>
                            </div>

                            <Select
                                placeholder="Sắp xếp theo"
                                style={{ width: 200 }}
                                options={[
                                    { value: 'name', label: 'Tên trường' },
                                    { value: 'score', label: 'Điểm chuẩn' },
                                    { value: 'ranking', label: 'Xếp hạng' },
                                    { value: 'tuition', label: 'Học phí' }
                                ]}
                            />
                        </div>

                        <div className="!space-y-3">
                            {filteredUniversities.map(university => (
                                <UniversityCard
                                    key={university.id}
                                    university={university}
                                />
                            ))}
                        </div>

                        {filteredUniversities.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🏫</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    Không tìm thấy trường đại học
                                </h3>
                                <p className="text-gray-500">
                                    Hãy thử điều chỉnh bộ lọc tìm kiếm
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <NewsSection />
        </div>
    )
}

export default Homepage