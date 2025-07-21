import React, { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


function formatDateToString(date) {
  if (!date || isNaN(date.getTime())) return ""
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseStringToDate(dateString) {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null
  const date = new Date(`${dateString}T00:00:00.000Z`)
  return isNaN(date.getTime()) ? null : date
}
export function DatePicker({ id = "date", value, onChange, placeholder = "Chọn ngày" }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(parseStringToDate(value))
  const [month, setMonth] = useState(date || new Date())
  const [inputValue, setInputValue] = useState(value || "")
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setDate(parseStringToDate(value))
    setInputValue(value || "")
    setHasError(false)
  }, [value])

  const handleDateChange = (newDate) => {
    setDate(newDate)
    const dateString = newDate ? formatDateToString(newDate) : ""
    setInputValue(dateString)
    setHasError(false)
    onChange && onChange(dateString)
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    
    if (val === '') {
      // Người dùng xóa input
      handleDateChange(null)
      setHasError(false)
      return
    }

    const parsed = parseStringToDate(val)
    if (parsed) {
      handleDateChange(parsed)
      setMonth(parsed)
      setHasError(false)
    } else {
      setHasError(true)
      onChange && onChange(val)
    }
  }

  const handleInputBlur = () => {
    if (hasError) {
      const currentValidValue = date ? formatDateToString(date) : ""
      setInputValue(currentValidValue)
      setHasError(false)
      onChange && onChange(currentValidValue)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={inputValue}
          placeholder={placeholder}
          className={`bg-background pr-10 ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown-buttons"
              fromYear={1990}
              toYear={new Date().getFullYear() + 5}
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                handleDateChange(selectedDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {hasError && (
        <p className="text-sm text-red-500">
          Định dạng ngày phải là YYYY-MM-DD (ví dụ: 2024-12-25)
        </p>
      )}
    </div>
  )
}

export default DatePicker