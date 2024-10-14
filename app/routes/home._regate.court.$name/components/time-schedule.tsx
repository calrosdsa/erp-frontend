
import React, { useState, useEffect } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { format, addDays, startOfWeek, isSameDay, setDay } from "date-fns"

export default function TimeSchedule() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const generateWeekDays = () => {
    const weekStart = setDay(startOfWeek(currentTime), 1) // Set to Monday
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  }

  const weekDays = generateWeekDays()

  const generateTimeSlots = (day: Date) => {
    const slots = []
    const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate())
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(startOfDay.getTime() + (hour * 60 + minute) * 60000)
        slots.push(time)
      }
    }
    return slots
  }

  const isCurrentTimeSlot = (slot: Date) => {
    return isSameDay(slot, currentTime) &&
           slot.getHours() === currentTime.getHours() &&
           Math.floor(slot.getMinutes() / 30) === Math.floor(currentTime.getMinutes() / 30)
  }

  const isPastTimeSlot = (slot: Date) => {
    return slot.getTime() < currentTime.getTime()
  }

  const isSelectedSlot = (slot: Date) => {
    return selectedSlots.some(selectedSlot => 
      selectedSlot.getTime() === slot.getTime()
    )
  }

  const handleSlotClick = (slot: Date) => {
    setSelectedSlots(prevSelectedSlots => {
      const isAlreadySelected = isSelectedSlot(slot)
      if (isAlreadySelected) {
        return prevSelectedSlots.filter(selectedSlot => selectedSlot.getTime() !== slot.getTime())
      } else {
        return [...prevSelectedSlots, slot]
      }
    })
  }

 

  const AllDaysSchedule = () => {
    return (
      <ScrollArea className="w-full border rounded-lg shadow-lg">
        <div className="flex overflow-auto">
          <div className="sticky left-0 z-10 bg-background">
            <div className="w-16 h-10 border-b" /> {/* Empty top-left cell */}
            {Array.from({ length: 24 * 2 }).map((_, index) => (
              <div key={index} className="w-16 h-8 flex items-center justify-end pr-2 text-xs">
                {index % 2 === 0 && `${Math.floor(index / 2)}:00`}
              </div>
            ))}
          </div>

          <div className=" grid grid-cols-7 min-w-[850px] w-full ">
          {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="flex-none ">
              <div className="h-10 border-b sticky top-0 z-10 bg-background flex items-center justify-center font-semibold">
                {format(day, "EEEE")}
              </div>
              {generateTimeSlots(day).map((slot, slotIndex) => {
                  const isPast = isPastTimeSlot(slot)
                  const isCurrent = isCurrentTimeSlot(slot)
                  const isSelected = isSelectedSlot(slot)
                  return (
                      <div
                      key={slotIndex}
                      onClick={() => handleSlotClick(slot)}
                      className={`h-8 border-b border-r transition-all duration-200 ease-in-out cursor-pointer ${
                          isCurrent
                          ? "bg-primary"
                          : isSelected
                          ? "bg-secondary"
                          : isPast
                          ? "bg-muted/20"
                          : "hover:bg-muted/30"
                        }`}
                        >
                        </div>
                    )
                })}
            </div>
          ))}
          </div>

        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
        <AllDaysSchedule />
    </div>
  )
}