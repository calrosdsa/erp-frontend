import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CalendarDays,
  Clock,
  DollarSign,
  MoreVertical,
  StoreIcon,
  TrashIcon,
} from "lucide-react";
import { components } from "~/sdk";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatCurrencyAmount } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import Typography, { subtitle } from "@/components/typography/Typography";
import { Link, useRevalidator } from "@remix-run/react";
import { routes } from "~/util/route";
import IconButton from "@/components/custom-ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatMediumDate } from "~/util/format/formatDate";
import MessageAlert from "@/components/custom-ui/message-alert";

const dayNames = [
  "Domingo",
  "Lunes",
  "Tuesday",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
interface BookingDisplayProps {
  bookings?: components["schemas"]["BookingData"][];
  onCourtSelect?: (courtId: number, bookingId: string) => void;
  removeBooking?: (idx: number) => void;
  // onEditBooking?: (
  //   b: components["schemas"]["BookingData"],
  //   idx: number
  // ) => void;
}

export default function BookingDisplay({
  bookings = [],
  removeBooking,
  // onEditBooking,
}: BookingDisplayProps) {
  const r = routes;
  const { i18n, t } = useTranslation("common");

  const groupedBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.start_date]) {
      acc[booking.start_date] = [];
    }
    acc[booking.start_date]!.push(booking);
    return acc;
  }, {} as Record<string, components["schemas"]["BookingData"][]>);

  const sortedDates = Object.keys(groupedBookings).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const revalidator = useRevalidator();

  const handleCourtSelect = (
    court: components["schemas"]["AvailableCourtDto"],
    bookingDataIdx: number
  ) => {
    bookings.map((booking, idx) => {
      if (idx == bookingDataIdx) {
        // console.log("UPDATINF BOOKING",courtId,bookingDataIdx)
        booking.court_id = court.id;
        booking.court_name = court.name;
        booking.total_price = court.total_price;
        booking.is_reserved = false;
        // if (onEditBooking) {
          // console.log("NEW BOOKING", booking);
          // onEditBooking(booking, idx);
        // }
      }
    });

    revalidator.revalidate()
  };

  if (!bookings || bookings.length === 0) {
    return <></>;
  }

  return (
    <Tabs defaultValue={sortedDates[0]} className="w-full">
      {sortedDates && sortedDates.length > 1 && (
        <TabsList className="flex  justify-start overflow-auto h-12">
          {sortedDates.map((date, idx) => (
            <TabsTrigger
              key={date}
              value={date}
              className="mb-2 mr-2 space-x-2 flex items-center"
            >
              <span>{format(parseISO(date), "MMM d, yyyy")}</span>
              {bookings[idx]?.is_reserved && <AlertCircle size={14} />}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      {sortedDates.map((date, idx) => (
        <TabsContent key={date} value={date}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span>
                    Reservar para {formatMediumDate(date, i18n.language)}
                  </span>
                </CardTitle>

                {removeBooking && (
                  <IconButton
                    className="w-min"
                    icon={TrashIcon}
                    onClick={() => {
                      removeBooking(idx);
                    }}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="">
                {groupedBookings[date]!.map((booking, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between ">
                        {booking.is_reserved && 
                        <MessageAlert 
                        variant="destructive"
                        message="No es posible reservar, ya que ya existe una reserva en este horario."/>
                        }
                      
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  pt-2">
                        <div>
                          <div className="flex items-center mb-2">
                            <StoreIcon className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Cancha</div>
                          </div>
                          <Badge
                            variant="outline"
                            className="flex items-center whitespace-nowrap w-min"
                          >
                            {booking.court_name}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">
                              Día de la semana
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="flex items-center w-min"
                          >
                            {dayNames[booking.day_week]}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">
                              Precio Total
                            </div>
                          </div>
                          {Number(booking.discount) > 0 ? (
                              <>
                                <Badge
                                  variant="outline"
                                  className="flex items-center w-min line-through"
                                >
                                  {formatCurrencyAmount(
                                    booking.total_price,
                                    DEFAULT_CURRENCY,
                                    i18n.language
                                  )}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="flex items-center w-min"
                                >
                                  {formatCurrencyAmount(
                                    Number(booking.total_price) - Number(booking.discount),
                                    DEFAULT_CURRENCY,
                                    i18n.language
                                  )}
                                </Badge>
                              </>
                            ) : (
                              <Badge
                                variant="outline"
                                className="flex items-center w-min"
                              >
                                {formatCurrencyAmount(
                                  booking.total_price,
                                  DEFAULT_CURRENCY,
                                  i18n.language
                                )}
                              </Badge>
                            )}
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <Clock className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">
                              Horarios reservados
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="flex items-center"
                            >
                              {format(parseISO(booking.start_date), "p")}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="flex items-center"
                            >
                              {format(parseISO(booking.end_date), "p")}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {booking.available_courts &&
                        booking.available_courts.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center mb-2">
                              <Typography fontSize={subtitle}>
                                Otras Canchas Disponibles
                              </Typography>
                              {/* <div className="text-sm font-medium">Available Courts</div> */}
                            </div>
                            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                              <div className="flex w-max space-x-4 p-4">
                                {booking.available_courts?.map((court) => (
                                  <Card
                                    key={court.id}
                                    className={`w-[150px] flex-shrink-0 cursor-pointer transition-colors ${
                                      booking.court_id === court.id
                                        ? "bg-muted"
                                        : ""
                                    }`}
                                    onClick={() => {}}
                                  >
                                    <CardContent className="p-0 relative">
                                      <div className="absolute top-0 right-0 p-1">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger>
                                            <IconButton
                                              icon={MoreVertical}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle more options click
                                              }}
                                            />
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            {/* {onEditBooking && ( */}
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleCourtSelect(
                                                    court,
                                                    idx
                                                  )
                                                }
                                              >
                                                Seleccionar cancha para reserva
                                              </DropdownMenuItem>
                                            {/* )} */}
                                            <DropdownMenuItem>
                                              <Link
                                                to={r.toCourtDetail(
                                                  court.name,
                                                  court.uuid
                                                )}
                                              >
                                                Ver Cancha
                                              </Link>
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                      <div className="flex flex-col items-center justify-center p-4 pt-8">
                                        <StoreIcon className="mb-2 h-8 w-8" />
                                        <div className="text-center font-medium underline">
                                          {court.name}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
