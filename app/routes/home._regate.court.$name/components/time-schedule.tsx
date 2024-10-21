import { useState, useEffect, useMemo } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { format, addDays, startOfWeek, isSameDay, setDay, parse, isWithinInterval } from "date-fns"
import { components } from "~/sdk"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "~/util/format/formatCurrency"
import { useTranslation } from "react-i18next"

type CourtRateDto = components["schemas"]["CourtRateDto"]

export default function TimeSchedule({ courtRates }: { courtRates: CourtRateDto[] }) {
  const {t,i18n} = useTranslation("common")
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

  const ratesByDayAndTime = useMemo(() => {
    const rateMap = new Map<number, Map<string, CourtRateDto>>()
    courtRates.forEach(rate => {
      if (!rateMap.has(rate.day_week)) {
        rateMap.set(rate.day_week, new Map())
      }
      rateMap.get(rate.day_week)?.set(rate.time, rate)
    })
    return rateMap
  }, [courtRates])

  const getSlotRate = (day: Date, slot: Date): CourtRateDto | undefined => {
    const dayOfWeek = day.getDay() || 6 // Convert Sunday (0) to 7
    const slotTime = format(slot, "HH:mm:ss")
    return ratesByDayAndTime.get(dayOfWeek)?.get(slotTime)
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

          <div className="grid grid-cols-7 min-w-[850px] w-full">
          {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="flex-none">
              <div className="h-10 border-b sticky top-0 z-10 bg-background flex items-center justify-center font-semibold">
                {format(day, "EEEE")}
              </div>
              {generateTimeSlots(day).map((slot, slotIndex) => {
                  // const isPast = isPastTimeSlot(slot)
                  // const isCurrent = isCurrentTimeSlot(slot)
                  // const isSelected = isSelectedSlot(slot)
                  const slotRate = getSlotRate(day, slot)
                  return (
                      <div
                      key={slotIndex}
                      // onClick={() => !isPast && slotRate?.enabled && handleSlotClick(slot)}
                      // onClick={()=>handleSlotClick(slot)}
                      // ${
                      //   isCurrent
                      //   ? "bg-primary"
                      //   : isSelected
                      //   ? "bg-secondary"
                      //   : isPast
                      //   ? "bg-muted/20"
                      //   : slotRate?.enabled
                      //   ? "hover:bg-muted/30 cursor-pointer"
                      //   : "bg-muted/10 cursor-not-allowed"
                      // }
                      className={`h-8 border-b border-r transition-all duration-200 ease-in-out 
                        `}
                        >
                          {slotRate && (
                            <div className="text-xs p-1 truncate flex items-center space-x-2">
                              <span>
                                {formatCurrency(slotRate.rate,slotRate.currency,i18n.language)}
                              </span>
                              <Badge variant={"outline"}>
                                {slotRate.enabled ? "Habilitado": "Deshabilidato"}
                              </Badge>
                              
                            </div>
                          )}
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