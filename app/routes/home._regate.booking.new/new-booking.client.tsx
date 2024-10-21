import Wizard from "@/components/layout/wizard";
import CreateBookings from "./componets/create-bookings";
import { ValidateBooking } from "./componets/validate-booking";
import { action } from "./route";
import { useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useUnmount } from "usehooks-ts";


export default function NewBookingClient() {
  const fetcher = useFetcher<typeof action>({key:"booking-data"})
  useUnmount(()=>{
    fetcher.submit({},{
        method:"POST",
        encType: "application/json",
      })
  })
  
  
  return (
       <>
       
       {/* <Wizard 
       initialStep={(fetcher.data?.bookingData && fetcher.data.bookingData.length > 0) ? 1:0}
       steps={[
         {title:"Fecha y Hora",content: <ValidateBooking/>},
         { title:"Reserva",content: <CreateBookings
           bookings={fetcher.data?.bookingData || []}
           />,
         },
       ]}
       onComplete={()=>{}}
       /> */}
       {(fetcher.data?.bookingData && fetcher.data.bookingData.length > 0)?
       <CreateBookings
       bookings={fetcher.data.bookingData}
       />
       :
       <ValidateBooking/>
      }
      
      {/* </Wizard> */}
       </>
  );
}
