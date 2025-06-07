import React, { useState, useEffect, useCallback } from 'react'
import { Input, Select } from 'antd'
import { SearchOutlined, EnvironmentOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash.debounce'

const { Option } = Select

const SearchSection = ({ searchTerm, setSearchTerm, selectedRegion, setSelectedRegion }) => {
  const navigate = useNavigate()
  const [selectedMajor, setSelectedMajor] = useState('')

  const regions = [
    { value: '', label: 'Tất cả khu vực' },
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Cần Thơ', label: 'Cần Thơ' },
    { value: 'Hải Phòng', label: 'Hải Phòng' }
  ]

  const popularMajors = [
    { value: '', label: 'Tất cả ngành' },
    { value: 'Công nghệ thông tin', label: 'Công nghệ thông tin' },
    { value: 'Kinh tế', label: 'Kinh tế' },
    { value: 'Y khoa', label: 'Y khoa' },
    { value: 'Kỹ thuật', label: 'Kỹ thuật' },
    { value: 'Ngoại ngữ', label: 'Ngoại ngữ' }
  ]

  const quickSearches = [
    'Đại học Bách khoa Hà Nội',
    'Đại học FPT',
    'Đại học Kinh tế Quốc dân',
    'Công nghệ thông tin',
    'Y khoa',
    'Kinh doanh'
  ]

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue, region, major) => {
      const params = new URLSearchParams()
      if (searchValue?.trim()) params.set('q', searchValue.trim())
      if (region) params.set('region', region)
      if (major) params.set('major', major)
      
      // Only navigate if we have search parameters
      if (params.toString()) {
        navigate(`/search?${params.toString()}`)
      }
    }, 1000), // 1000ms delay
    [navigate]
  )

  // Effect to trigger debounced search when inputs change
  useEffect(() => {
    debouncedSearch(searchTerm, selectedRegion, selectedMajor)
    
    // Cleanup function to cancel the debounced call
    return () => {
      debouncedSearch.cancel()
    }
  }, [searchTerm, selectedRegion, selectedMajor, debouncedSearch])

  const handleQuickSearch = (search) => {
    setSearchTerm(search)
    // The useEffect will trigger the debounced search automatically
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border-0" style={{ borderRadius: '16px' }}>
        <div className="space-y-6">
          {/* Main Search */}
          <div>
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative sticky">
                <Input
                  size="large"
                  placeholder="Nhập tên trường đại học, ngành học... (tự động tìm kiếm)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="h-12 shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  style={{ borderRadius: '24px', fontSize: '16px' }}
                />
                {searchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse text-blue-500 text-xs">
                        Đang tìm kiếm...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-2 gap-4 px-10">
                <Select
                  size="large"
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  placeholder="Chọn khu vực"
                  suffixIcon={<EnvironmentOutlined />}
                  className='h-12 shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  style={{ borderRadius: '8px' }}
                >
                  {regions.map(region => (
                    <Option key={region.value} value={region.value}>
                      {region.label}
                    </Option>
                  ))}
                </Select>

                <Select
                  size="large"
                  value={selectedMajor}
                  onChange={setSelectedMajor}
                  placeholder="Chọn ngành học"
                  suffixIcon={<BookOutlined />}
                  style={{ borderRadius: '8px' }}
                  className='h-12 shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                >
                  {popularMajors.map(major => (
                    <Option key={major.value} value={major.value}>
                      {major.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Quick Searches */}
          <div>
            <div className="text-sm text-gray-600 mb-3 text-center">
              Tìm kiếm phổ biến:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {quickSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-full text-sm transition-all duration-200 border border-gray-200 hover:border-blue-200"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="text-center">
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2 inline-block">
              💡 Mẹo: Bạn có thể tìm kiếm theo tên trường, mã trường, hoặc ngành học
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchSection