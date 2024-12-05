"use client"

import { useState, useEffect, useMemo } from "react"
import { format, addDays, startOfWeek, setDay } from "date-fns"
import { es } from 'date-fns/locale'
import { components } from "~/sdk"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "~/util/format/formatCurrency"
import { useTranslation } from "react-i18next"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type CourtRateDto = components["schemas"]["CourtRateDto"]

export default function TimeSchedule({ courtRates }: { courtRates: CourtRateDto[] }) {
  const { t, i18n } = useTranslation("common")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const generateWeekDays = () => {
    const weekStart = setDay(startOfWeek(currentTime), 1) // Set to Monday
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  }

  const weekDays = generateWeekDays()

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

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

  const getSlotRate = (day: Date, time: string): CourtRateDto | undefined => {
    const dayOfWeek = day.getDay() 
    return ratesByDayAndTime.get(dayOfWeek)?.get(`${time}:00`)
  }

  return (
    <div className="container  py-3 px-1 xl:px-4 text-sm">
      <div className=" responsive-container border rounded-lg shadow-lg  " style={{ height: '600px' }}>
        <table className="border-collapse ">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              <th className="border p-2 w-20 text-left">Hora</th>
              {weekDays.map((day, index) => (
                <th key={index} className="border p-2 text-center first-letter:uppercase">
                  {format(day, "EEEE", { locale: es })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIndex) => (
              <tr key={timeIndex} >
                <td className="border p-2">{time}</td>
                {weekDays.map((day, dayIndex) => {
                  const slotRate = getSlotRate(day, time)
                  return (
                    <td key={dayIndex} className="border p-2" >
                      <div className="text-xs flex flex-col items-center w-28 h-10">
                      {slotRate && (
                        <>
                          <div className="">
                            {formatCurrency(slotRate.rate, slotRate.currency, i18n.language)}
                          </div>
                          <Badge variant={slotRate.enabled ? "default" : "secondary"} className="mt-1">
                            {slotRate.enabled ? "Habilitado" : "Deshabilitado"}
                          </Badge>
                        </>
                      )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}