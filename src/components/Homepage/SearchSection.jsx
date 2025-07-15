import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash.debounce'

const SearchSection = ({ searchTerm, setSearchTerm, selectedRegion, setSelectedRegion }) => {
  const navigate = useNavigate()
  const [selectedMajor, setSelectedMajor] = useState('')

  const quickSearches = [
    'Đại học Bách khoa Hà Nội',
    'Đại học FPT',
    'Đại học Kinh tế Quốc dân',
    'Công nghệ thông tin',
    'Y khoa',
    'Kinh doanh'
  ]

  const debouncedSearch = useCallback(
    debounce((searchValue, region, major) => {
      const params = new URLSearchParams()
      if (searchValue?.trim()) params.set('q', searchValue.trim())
      
      if (region && region !== 'all') {
        const regionMap = {
          'Hà Nội': 'Hà Nội',
          'TP. Hồ Chí Minh': 'TP. Hồ Chí Minh',
          'Đà Nẵng': 'Đà Nẵng',
          'Cần Thơ': 'Cần Thơ',
          'Hải Phòng': 'Hải Phòng'
        }
        params.set('region', regionMap[region] || region)
      }
      
      if (major && major !== 'all') params.set('major', major)

      if (params.toString()) {
        navigate(`/search?${params.toString()}`)
      }
    }, 1000),
    [navigate]
  )

  useEffect(() => {
    debouncedSearch(searchTerm, selectedRegion, selectedMajor)

    return () => {
      debouncedSearch.cancel()
    }
  }, [searchTerm, selectedRegion, selectedMajor, debouncedSearch])

  const handleQuickSearch = (search) => {
    setSearchTerm(search)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl">
        <div className="space-y-6">
          {/* Main Search */}
          <div>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Nhập tên trường đại học, ngành học... (tự động tìm kiếm)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 pr-10 shadow-sm border-gray-200 rounded-full text-base bg-white placeholder-gray-400 text-gray-900"
              />
              {searchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse text-foreground text-sm">
                      Đang tìm kiếm...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Searches */}
          <div>
            <div className="text-sm text-muted-foreground mb-3 text-center">
              Tìm kiếm phổ biến:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {quickSearches.map((search, index) => (
                <button
                  key={`quick-search-${index}-${search.replace(/\s+/g, '-')}`}
                  onClick={() => handleQuickSearch(search)}
                  className="px-3 py-1.5 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full text-sm transition-all duration-200 border border-border hover:border-primary/20"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground bg-muted rounded-lg px-4 py-2 inline-block">
              💡 Mẹo: Bạn có thể tìm kiếm theo tên trường, mã trường, hoặc ngành học
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchSection