import Wizard from "@/components/layout/wizard";
import CreateBookings from "./componets/create-bookings";
import { ValidateBooking } from "./componets/validate-booking";
import { action } from "./route";
import { useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useUnmount } from "usehooks-ts";
import { useNewBooking } from "./use-new-booking";
import { components } from "~/sdk";
import generateBookingData from "./util-new";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";

export default function NewBookingClient() {
  const fetcher = useFetcher<typeof action>({ key: "booking-data" });
  const { payload, resetPayload } = useNewBooking();

  const onBookingPayload = () => {
    if (payload) {
      const { court, selectedSlots, courtName } = payload;
      const body: components["schemas"]["ValidateBookingBody"] = {
        bookings: generateBookingData(court, courtName, selectedSlots),
      };
      console.log("BOOKING SLOTS", body);
      fetcher.submit(
        {
          action: "validate-booking-data",
          validateBookingData: body,
        },
        {
          method: "POST",
          encType: "application/json",
        }
      );
    }
  };

  

  useEffect(() => {
    if (payload) {
      onBookingPayload();
    }
  }, [payload]);

  useUnmount(() => {
    fetcher.submit(
      {},
      {
        method: "POST",
        encType: "application/json",
      }
    );
  });

  return (
    <>
      {fetcher.state == "submitting" ?
        <LoadingSpinner className="h-[70vh]" size="lg"/>
      :
      fetcher.data?.bookingData && fetcher.data.bookingData.length > 0 ? (
        <CreateBookings data={fetcher.data.bookingData} />
      ) : (
        <ValidateBooking />
      )
    }

      {/* </Wizard> */}
    
    </>
  );
}
