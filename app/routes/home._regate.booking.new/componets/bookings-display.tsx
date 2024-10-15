import React from 'react'
import { format, parseISO } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDays, Clock, DollarSign } from "lucide-react"
import { components } from '~/sdk'

interface BookingDisplayProps {
  bookings?: components["schemas"]["BookingData"][]
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function BookingDisplay({ bookings = [] }: BookingDisplayProps) {
  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p>No bookings available.</p>
        </CardContent>
      </Card>
    )
  }

  const groupedBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.start_date]) {
      acc[booking.start_date] = [];
    }
    acc[booking.start_date]!.push(booking);
    return acc;
  }, {} as Record<string, components["schemas"]["BookingData"][]>);

  const sortedDates = Object.keys(groupedBookings).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <Tabs defaultValue={sortedDates[0]} className="w-full">
      <TabsList className="flex flex-wrap justify-start mb-4">
        {sortedDates.map((date) => (
          <TabsTrigger key={date} value={date} className="mb-2 mr-2">
            {format(parseISO(date), 'MMM d, yyyy')}
          </TabsTrigger>
        ))}
      </TabsList>
      {sortedDates.map((date) => (
        <TabsContent key={date} value={date}>
          <Card>
            <CardHeader>
              <CardTitle>Bookings for {format(parseISO(date), 'MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                {groupedBookings[date]!.map((booking, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant={booking.is_valid ? "default" : "destructive"}>
                          {booking.is_valid ? "Valid" : "Invalid"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Court {booking.court_id}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-stretch border-t pt-4">
                        <div className="flex-1 pr-4 sm:border-r">
                          <div className="flex items-center mb-2">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Day of Week</div>
                          </div>
                          <Badge variant="outline" className="flex items-center w-min">
                            {dayNames[booking.day_week - 1]}
                          </Badge>
                        </div>

                        <div className="flex-1 px-4 sm:border-r mt-4 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Total Price</div>
                          </div>
                          <Badge variant="outline" className="flex items-center w-min">
                            {formatCurrency(booking.total_price)}
                          </Badge>
                        </div>

                        <div className="flex-1 pl-4 mt-4 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <Clock className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Booked Times</div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center">
                              {format(parseISO(booking.start_date), 'p')}
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              {format(parseISO(booking.end_date), 'p')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}