import Wizard from "@/components/layout/wizard";
import CreateBookings from "./componets/create-bookings";
import { ValidateBooking } from "./componets/validate-booking";
import { action } from "./route";
import { json, useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useUnmount } from "usehooks-ts";
import { useNewBooking } from "./use-new-booking";
import { components } from "~/sdk";
import generateBookingData from "./util-new";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import CreateLayout from "@/components/layout/create-layout";

export default function NewBookingClient() {
  const fetcher = useFetcher<typeof action>({ key: "booking-data" });
  const { payload } = useNewBooking();

  const onBookingPayload = () => {
    if (payload) {
      const { court, selectedSlots, courtName } = payload;
      console.log("SELECTED SLOTS", selectedSlots);
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
      {/* {JSON.stringify(fetcher.data)} */}
      <CreateLayout>
        {fetcher.state == "submitting" ? (
          <LoadingSpinner className="h-[70vh]" size="lg" />
        ) : fetcher.data?.bookingData && fetcher.data.bookingData.length > 0 ? (
          <CreateBookings data={fetcher.data.bookingData} />
        ) : (
          <ValidateBooking />
        )}
      </CreateLayout>
    </>
  );
}
