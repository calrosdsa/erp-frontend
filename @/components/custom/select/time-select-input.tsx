
import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TimeSelectInputProps {
  label?: string
  onChange?: (time: string) => void
  className?: string
  defaultValue?: string
}

export default function TimeSelectInput({
  label = "Select Time",
  onChange,
  className,
  defaultValue,
}: TimeSelectInputProps) {
  const [selectedHour, setSelectedHour] = useState<string>(defaultValue?.split(":")[0] || "12")
  const [selectedMinute, setSelectedMinute] = useState<string>(defaultValue?.split(":")[1]?.split(" ")[0] || "00")
  const [selectedPeriod, setSelectedPeriod] = useState<string>(defaultValue?.split(" ")[1] || "AM")

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minutes = ["00", "30"]
  const periods = ["AM", "PM"]

  useEffect(() => {
    const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`
    onChange?.(formattedTime)
  }, [selectedHour, selectedMinute, selectedPeriod, onChange])

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex space-x-2">
        <Select value={selectedHour} onValueChange={setSelectedHour}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMinute} onValueChange={setSelectedMinute}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}