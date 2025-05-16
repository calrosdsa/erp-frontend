"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus } from "lucide-react";
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
import { useFetcher, useNavigate, useSearchParams } from "@remix-run/react";
import { route } from "~/util/route";
import { components, operations } from "~/sdk";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "~/util/format/formatCurrency";
import { es } from "date-fns/locale";
import { action } from "~/routes/home._regate.court_/route";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNewBooking } from "~/routes/home._regate.booking/store/use-new-booking";

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
  // const [courtFetcher, onCourtNameChange] = useCourtDebounceFetcher();
  const courtsFetcher = useFetcher<typeof action>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const courtID = searchParams.get("court_id");
  const viewMode: "day" | "week" | string = searchParams.get("view") || "week";
  const newBooking = useNewBooking();
  const {selectedSlots, setSelectedSlots} = newBooking
  const navigate = useNavigate();
  const r = route;
  const { i18n } = useTranslation("common");

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const initData = () => {
    const query: operations["courts"]["parameters"]["query"] = {
      size: "100",
      column: "name",
      orientation: "asc",
    };
    courtsFetcher.submit(
      {
        action: "get",
        query: query,
      },
      {
        action: route.to(route.court),
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    initData();
  }, []);

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
      return schedule?.enabled;
    },
    [getDaySchedule]
  );

  useEffect(() => {
    newBooking.onPayload({
      court: Number(searchParams.get("court_id")),
      courtName: searchParams.get("court_name") || "",
      slots: Array.from(selectedSlots),
    });
  }, [selectedSlots, courtID]);

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
        // <TooltipProvider key={`${date} ${time}`}>
        //   <Tooltip>
        //     <TooltipTrigger asChild>
        <td
          className={`border text-center cursor-pointer transition-colors duration-200 ${
            isSelected ? "bg-primary/20" : ""
          } ${isSelectable ? "" : "opacity-50 cursor-not-allowed"}`}
          style={{
            backgroundColor: reservation
              ? colorHash(reservation.booking_id)
              : undefined,
            height: "50px",
          }}
          onClick={() => {
            if (reservation) {
              searchParams.set(
                route.booking,
                reservation.booking_id.toString()
              );
              setSearchParams(searchParams, {
                preventScrollReset: true,
              });
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
              {formatCurrency(schedule.rate, schedule.currency, i18n.language)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">No disponible</span>
          )}
        </td>
        //   </TooltipTrigger>
        //   <TooltipContent>
        //     {reservation
        //       ? `Reserva ${reservation.party_name}`
        //       : isSelectable
        //       ? "Haz clic aquí para seleccionar"
        //       : "No disponible"}
        //   </TooltipContent>
        // </Tooltip>
        // </TooltipProvider>
      );
    },
    [
      viewMode,
      selectedSlots,
      getReservationForSlot,
      getDaySchedule,
      isSlotSelectable,
      handleSlotClick,
      navigate,
      r,
      i18n.language,
    ]
  );

  const renderDayView = useCallback(
    (date: Date) => (
      <table className="w-full border-collapse">
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time}>
              <td className="border p-2 text-sm text-right w-20">
                {time.substring(0, 5)}
              </td>
              {renderTimeSlot(date, time)}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    [timeSlots, renderTimeSlot]
  );

  const renderWeekView = useCallback(() => {
    const weekStart = startOfWeek(selectedDate);
    return (
      <div
        className="   border rounded-lg shadow-lg responsive-container"
        style={{ height: "600px" }}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-background z-10">
            <tr>
              <th className="border p-2"></th>
              {Array.from({ length: 7 }).map((_, index) => {
                const date = addDays(weekStart, index);
                return (
                  <th
                    key={index}
                    className="border p-2 text-center font-semibold first-letter:uppercase "
                  >
                    <div className="w-24 h-10">
                      {format(date, "EEE dd", { locale: es })}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, idx) => (
              <tr key={idx}>
                <td className="border p-2 text-sm text-right sticky left-0 bg-background z-10">
                  {time.substring(0, 5)}
                </td>
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = addDays(weekStart, index);
                  return renderTimeSlot(date, time);
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [selectedDate, timeSlots, renderTimeSlot]);

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between  gap-2 responsive-container">
        <div className="flex items-center gap-2">
          {/* <AutocompleteSearch
              data={courtFetcher.data?.courts || []}
              nameK={"name"}
              queryName="court_name"
              queryValue="court_id"
              valueK={"id"}
              onValueChange={onCourtNameChange}
            /> */}
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
          {/* <Button
            variant="default"
            size="sm"
            onClick={() => {
              newBooking.onPayload({
                court: Number(searchParams.get("court_id")),
                courtName: searchParams.get("court_name") || "",
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
          </Button> */}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            className="px-4"
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
            className="px-4"
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

      <div className="flex space-x-3  responsive-container">
        <ToggleGroup
          variant={"outline"}
          type="single"
          value={courtID || ""}
          onValueChange={(e) => {
            const court = courtsFetcher.data?.courts.find(
              (item) => item.id.toString() === e
            );
            if (court) {
              searchParams.set("court_name", court.name);
              searchParams.set("court_id", e);
              setSearchParams(searchParams, {
                preventScrollReset: true,
              });
            }
          }}
        >
          {courtsFetcher.data?.courts.map((item) => {
            return (
              <ToggleGroupItem
                key={item.id}
                value={item.id.toString()}
                className=" whitespace-nowrap"
              >
                {item.name}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <div className="w-full mx-auto py-2">
        {viewMode === "day" ? renderDayView(selectedDate) : renderWeekView()}
      </div>
    </div>
  );
}
