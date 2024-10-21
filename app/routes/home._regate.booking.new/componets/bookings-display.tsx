import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarDays, Clock, DollarSign, ExternalLink, Keyboard, MoreVertical, StoreIcon } from "lucide-react";
import { components } from "~/sdk";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { Button } from "@/components/ui/button";
import Typography, { subtitle } from "@/components/typography/Typography";
import { Link, useNavigate, useRevalidator } from "@remix-run/react";
import { routes } from "~/util/route";
import IconButton from "@/components/custom-ui/icon-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatMediumDate } from "~/util/format/formatDate";

interface BookingDisplayProps {
  bookings?: components["schemas"]["BookingData"][];
  onCourtSelect?: (courtId: number, bookingId: string) => void;
}

const dayNames = [
  "Domingo",
  "Lunes",
  "Tuesday",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function BookingDisplay({ bookings = [] }: BookingDisplayProps) {
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
    court: components["schemas"]["CourtDto"],
    bookingDataIdx: number
  ) => {
    bookings.map((booking, idx) => {
      if (idx == bookingDataIdx) {
        // console.log("UPDATINF BOOKING",courtId,bookingDataIdx)
        booking.court_id = court.id;
        booking.court_name = court.name;
        booking.is_valid = true;
      }
    });
    revalidator.revalidate();
  };

  if (!bookings || bookings.length === 0) {
    return (
      <></>
    );
  }

  return (
    <Tabs defaultValue={sortedDates[0]} className="w-full">
      {sortedDates&& sortedDates.length > 1 &&
      <TabsList className="flex flex-wrap justify-start mb-4">
        {sortedDates.map((date) => (
          <TabsTrigger key={date} value={date} className="mb-2 mr-2">
            {format(parseISO(date), "MMM d, yyyy")}
          </TabsTrigger>
        ))}
      </TabsList>
      }
      {sortedDates.map((date) => (
        <TabsContent key={date} value={date}>
          <Card>
            <CardHeader>
              <CardTitle>
                Reservar para 
                {" "}
                {/* {format(parseISO(date), "MMMM d, yyyy",{locale:})}   */}
                {formatMediumDate(date,i18n.language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="">
                {groupedBookings[date]!.map((booking, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant={booking.is_valid ? "default" : "destructive"}
                        >
                          {booking.is_valid ? "Valid" : "Invalid"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
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
                          <Badge
                            variant="outline"
                            className="flex items-center w-min"
                          >
                            {formatCurrency(
                              booking.total_price,
                              DEFAULT_CURRENCY,
                              i18n.language
                            )}
                          </Badge>
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

                      {(booking.available_courts && booking.available_courts.length > 0) &&
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
                                booking.court_id === court.id ? 'bg-muted' : ''
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
                                    <DropdownMenuItem onClick={()=>handleCourtSelect(court,index)}
                                    >Seleccionar cancha para reserva</DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Link to={r.toCourtDetail(court.name,court.uuid)}>Ver Cancha</Link>
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
                      }


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
