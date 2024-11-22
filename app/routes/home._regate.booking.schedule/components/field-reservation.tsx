"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, RefreshCw, Settings } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  addDays,
  startOfWeek,
  addMinutes,
  isSameDay,
  parseISO,
} from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { useCourtDebounceFetcher } from "~/util/hooks/fetchers/regate/useCourtDebounceFetcher";
import { useNewBooking } from "~/routes/home._regate.booking.new/use-new-booking";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { routes } from "~/util/route";
import { components } from "~/sdk";

interface FieldReservationProps {
  schedules: components["schemas"]["CourtRateDto"][];
  reservations: components["schemas"]["BookingSlotDto"][];
}

const generateTimeSlots = () => {
  const slots = [];
  let currentTime = new Date(2024, 0, 1);
  const endTime = new Date(2024, 0, 2);

  while (currentTime < endTime) {
    slots.push(format(currentTime, "HH:mm:ss"));
    currentTime = addMinutes(currentTime, 30);
  }

  return slots;
};

const colorHash = (id: number) => {
  const hue = (id * 137.508) % 360;
  return `hsl(${hue}, 50%, 75%)`;
};

export default function FieldReservation({
  schedules,
  reservations,
}: FieldReservationProps) {
  const [courtFetcher, onCourtNameChange] = useCourtDebounceFetcher();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode: "day" | "week" | string = searchParams.get("view") || "day";
  //   const [viewMode, setViewMode] = useState<"day" | "week" | string>(searchParams.get("view") || "day");
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const newBooking = useNewBooking();
  const navigate = useNavigate();
  const r = routes;

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const getDaySchedule = useCallback(
    (date: Date) => {
      const dayOfWeek = date.getDay();
      return schedules.filter((schedule) => schedule.day_week === dayOfWeek);
    },
    [schedules]
  );

  const getReservationForSlot = useCallback(
    (date: Date, time: string) => {
      return reservations.find((reservation) => {
        const reservationDate = parseISO(reservation.datetime);
        return (
          isSameDay(reservationDate, date) &&
          format(reservationDate, "HH:mm:ss") === time
        );
      });
    },
    [reservations]
  );

  const isSlotSelectable = useCallback(
    (date: Date, time: string) => {
      const schedule = getDaySchedule(date).find((s) => s.time === time);
      //   return schedule?.enabled && !getReservationForSlot(date, time);
      return schedule?.enabled;
    },
    [getDaySchedule]
  );

  const handleSlotClick = useCallback(
    (date: Date, time: string) => {
      const slotKey = `${format(date, "yyyy-MM-dd")} ${time}`;

      if (!isSlotSelectable(date, time)) {
        return;
      }

      const newSelectedSlots = new Set(selectedSlots);
      if (newSelectedSlots.has(slotKey)) {
        newSelectedSlots.delete(slotKey);
      } else {
        newSelectedSlots.add(slotKey);
      }
      setSelectedSlots(newSelectedSlots);
    },
    [selectedSlots, isSlotSelectable]
  );

  const renderTimeSlot = useCallback(
    (date: Date, time: string) => {
      const reservation = getReservationForSlot(date, time);
      const schedule = getDaySchedule(date).find((s) => s.time === time);
      const isSelected = selectedSlots.has(
        `${format(date, "yyyy-MM-dd")} ${time}`
      );
      const isSelectable = isSlotSelectable(date, time);

      return (
        <TooltipProvider key={`${date} ${time}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`border text-center cursor-pointer transition-colors duration-200 ${
                  isSelected ? "bg-primary/20" : ""
                } ${isSelectable ? "" : "opacity-50 cursor-not-allowed"}`}
                style={{
                  backgroundColor: reservation
                    ? colorHash(reservation.booking_id)
                    : undefined,
                  height: "50px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  if (reservation) {
                    navigate(
                      r.toRoute({
                        main: r.bookingM,
                        routeSufix: [reservation.booking_code],
                        q: {
                          tab: "info",
                        },
                      })
                    );
                    // fetchBookingDetail(reservation.booking_id);
                  } else {
                    handleSlotClick(date, time);
                  }
                }}
              >
                {reservation ? (
                  <Badge variant="secondary" className="text-xs">
                    {reservation.party_name}
                    <br />
                    {format(parseISO(reservation.datetime), "HH:mm")}
                  </Badge>
                ) : schedule?.enabled ? (
                  <span className="text-xs">
                    {schedule.rate} {schedule.currency}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No disponible
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {reservation
                ? `Booking #${reservation.booking_id}`
                : isSelectable
                ? "Click to select"
                : "Not available"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    [
      viewMode,
      selectedSlots,
      getReservationForSlot,
      getDaySchedule,
      isSlotSelectable,
      handleSlotClick,
    ]
  );

  const renderDayView = useCallback(
    (date: Date) => (
      <div className="grid grid-cols-[80px_1fr] gap-1">
        <div className="space-y-1">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-[50px] flex items-center justify-end pr-2 text-sm"
            >
              {time.substring(0, 5)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-1">
          {timeSlots.map((time) => renderTimeSlot(date, time))}
        </div>
      </div>
    ),
    [timeSlots, renderTimeSlot]
  );

  const renderWeekView = useCallback(() => {
    const weekStart = startOfWeek(selectedDate);
    return (
      <div className="grid grid-cols-8 gap-1 overflow-auto ">
        <div className="sticky left-0 bg-background z-10">
          <div className="h-8  "></div>
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-[50px] flex items-center justify-end pr-2 text-sm"
            >
              {time.substring(0, 5)}
            </div>
          ))}
        </div>
        <ScrollArea className="col-span-7 overflow-x-auto  min-w-[700px]">
          <div className="grid grid-cols-7 gap-1 min-w-[700px]">
            {Array.from({ length: 7 }).map((_, index) => {
              const date = addDays(weekStart, index);
              return (
                <div key={index}>
                  <div className="sticky top-0 bg-background z-10 h-8 flex items-center justify-center font-semibold">
                    {format(date, "EEE dd")}
                  </div>
                  {timeSlots.map((time) => renderTimeSlot(date, time))}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }, [selectedDate, timeSlots, renderTimeSlot]);

  return (
    <div className="flex flex-col">
      {/* {JSON.stringify()} */}
      <div className="w-full p-4">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <AutocompleteSearch
              data={courtFetcher.data?.courts || []}
              nameK={"name"}
              queryName="courtName"
              queryValue="court"
              valueK={"id"}
              onValueChange={onCourtNameChange}
            />
            {/* <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button> */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  {format(selectedDate, "dd MMMM").toUpperCase()}
                  <CalendarIcon className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      searchParams.set("date", date.toJSON());
                      setSearchParams(searchParams, {
                        preventScrollReset: true,
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                newBooking.onPayload({
                  court: Number(searchParams.get("court")),
                  courtName: searchParams.get("courtName") || "",
                  selectedSlots: Array.from(selectedSlots),
                });
                navigate(
                  r.toRoute({
                    main: r.bookingM,
                    routeSufix: ["new"],
                  })
                );
              }}
            >
              CREAR RESERVA <Plus className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                searchParams.set("view", "day");
                setSearchParams(searchParams, {
                  preventScrollReset: true,
                });
              }}
            >
              Día
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                searchParams.set("view", "week");
                setSearchParams(searchParams, {
                  preventScrollReset: true,
                });
              }}
            >
              Semana
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="w-full mx-auto">
            {viewMode === "day"
              ? renderDayView(selectedDate)
              : renderWeekView()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
