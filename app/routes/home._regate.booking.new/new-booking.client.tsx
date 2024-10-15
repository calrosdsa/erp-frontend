import CreateBookings from "./componets/create-bookings";
import { ValidateBooking } from "./componets/validate-booking";
import { action } from "./route";
import { useFetcher } from "@remix-run/react";


export default function NewBookingClient() {
  const fetcher = useFetcher<typeof action>({key:"booking-data"})
  return (
       <>
       {(fetcher.data?.bookingData && fetcher.data.bookingData.length > 0)?
       <CreateBookings
       bookings={fetcher.data.bookingData}
       />
       :
       <ValidateBooking/>
       }
       </>
  );
}
