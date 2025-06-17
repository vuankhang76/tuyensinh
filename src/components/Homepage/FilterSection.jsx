import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

const FilterSection = ({ selectedRegion, setSelectedRegion, selectedType, setSelectedType }) => {
  const regions = [
    'Hà Nội',
    'TP. Hồ Chí Minh', 
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Huế',
    'Nha Trang'
  ]

  const types = ['Công lập', 'Tư thục', 'Dân lập']

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc tìm kiếm</h3>
             {/* Region Filter */}
       <Select value={selectedRegion || "all"} onValueChange={(value) => setSelectedRegion(value === "all" ? "" : value)}>
         <SelectTrigger className="w-[270px]">
           <SelectValue placeholder="Khu vực" />
         </SelectTrigger>
         <SelectContent>
           <SelectItem value="all">Tất cả khu vực</SelectItem>
           {regions.map(region => (
             <SelectItem key={region} value={region}>{region}</SelectItem>
           ))}
         </SelectContent>
       </Select>

             {/* Type Filter */}
       <Select value={selectedType || "all"} onValueChange={(value) => setSelectedType(value === "all" ? "" : value)}>
         <SelectTrigger className="w-[270px]">
           <SelectValue placeholder="Loại trường" />
         </SelectTrigger>
         <SelectContent>
           <SelectItem value="all">Tất cả loại trường</SelectItem>
           {types.map(type => (
             <SelectItem key={type} value={type}>{type}</SelectItem>
           ))}
         </SelectContent>
       </Select>
    </div>
  )
}

export default FilterSection 