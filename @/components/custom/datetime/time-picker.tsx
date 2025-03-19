"use client"

import * as React from "react"
import { set } from "date-fns"
import { Clock } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"

interface TimePickerProps {
  date: Date | null
  setDate: (date: Date) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const { t } = useTranslation("common")
  
  const [selectedTime, setSelectedTime] = React.useState<{
    hours: string
    minutes: string
    seconds: string
  } | undefined>(undefined)

  // Update time when date changes
  React.useEffect(() => {
    if (date) {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()
      
      setSelectedTime({
        hours: hours < 10 ? `0${hours}` : String(hours),
        minutes: minutes < 10 ? `0${minutes}` : String(minutes),
        seconds: seconds < 10 ? `0${seconds}` : String(seconds),
      })
    }
  }, [])

  // Update date when time changes
  const handleTimeChange = () => {
    if (!date) return

    const newDate = set(date, {
      hours: parseInt(selectedTime?.hours || "0"),
      minutes: parseInt(selectedTime?.minutes || "0"),
      seconds: parseInt(selectedTime?.seconds|| "0"),
    })
    setDate(newDate)
  }

  React.useEffect(() => {
    if (selectedTime) {
      handleTimeChange()
    }
  }, [selectedTime])

  const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : String(i)))
  const minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : String(i)))
  const seconds = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : String(i)))

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 opacity-50" />
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={selectedTime?.hours || "00"}
          onValueChange={(value) => selectedTime && setSelectedTime({ ...selectedTime, hours: value })}
        >
          <SelectTrigger className="h-8">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-[200px]">
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedTime?.minutes || "00"}
          onValueChange={(value) => selectedTime && setSelectedTime({ ...selectedTime, minutes: value })}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-[200px]">
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedTime?.seconds || "00"}
          onValueChange={(value) => selectedTime && setSelectedTime({ ...selectedTime, seconds: value })}
        >
          <SelectTrigger className="h-8">
            <SelectValue  />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-[200px]">
            {seconds.map((second) => (
              <SelectItem key={second} value={second}>
                {second}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
