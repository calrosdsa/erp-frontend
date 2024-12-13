import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addMinutes, format, parse } from "date-fns";

interface Booking {
  court_id: number;
  court_name: string;
  day_week: number;
  discount?: number;
  end_date: string;
  is_reserved: boolean;
  start_date: string;
  times: string[];
  total_price?: number;
}

interface BookingDetailsProps {
  bookings: Booking[];
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BookingDetails({ bookings }: BookingDetailsProps) {
  const [totalHours, totalPrice] = useMemo(() => {
    return [
      bookings.reduce((total, booking) => total + booking.times.length, 0),
      bookings.reduce(
        (total, booking) => total + (booking.total_price || 0),
        0
      ),
    ];
  }, [bookings]);

  return (
    <Card className="w-full  mx-auto">
      {/* <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="p-1">
          <p className=" font-semibold">
            Total Horas Reservadas: {totalHours / 2} hrs
          </p>
          <p className=" font-semibold">Precio Total: {totalPrice}</p>
        </div>
        
      </CardContent>
    </Card>
  );
}


// {/* <Table className=" border rounded-lg">
//           <TableHeader>
//             <TableRow>
//               <TableHead>Court</TableHead>
//               <TableHead>Day</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Times</TableHead>
//               <TableHead>Price</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {bookings.map((booking, index) => (
//               <TableRow key={index}>
//                 <TableCell>{booking.court_name}</TableCell>
//                 <TableCell>{daysOfWeek[booking.day_week]}</TableCell>
//                 <TableCell>
//                   {new Date(booking.start_date).toLocaleDateString()}
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex whitespace-nowrap gap-2">
//                     <Badge variant="outline" className="flex items-center">
//                       {booking.times[0]}
//                     </Badge>
//                     <Badge variant="outline" className="flex items-center">
//                       {/* {parse(booking.times[booking.times.length - 1],"")} */}
//                       {format(
//                         addMinutes(
//                           parse(
//                             booking.times[booking.times.length - 1] || "00:00:00",
//                             "HH:mm:ss",
//                             new Date()
//                           ),
//                           30
//                         ),
//                         "HH:mm:ss"
//                       )}
//                     </Badge>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   {booking.total_price
//                     ? `${booking.total_price.toFixed(2)}`
//                     : "N/A"}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table> */}