import { Await, useLoaderData } from "@remix-run/react";
import BookingScheduleHeader from "./components/booking-schedule-header";
import { loader } from "./route";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { components } from "~/sdk";
import FieldReservation from "./components/field-reservation";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";

export default function BookingScheduleClient() {
  const { bookingSlots, courtRates } = useLoaderData<typeof loader>();
  const {t} = useTranslation("common")
  setUpToolbar(() => {
    return {
      titleToolbar:t("regate.schedule")
    };
  }, []);
  return (
    <div>
      <FieldReservation schedules={courtRates} reservations={bookingSlots} />
      {/* <Suspense fallback={<FallBack />}>
        <Await resolve={resCourtRates} errorElement={<div>ERROR</div>}>
          {(resData: any) => {
            const data =
            resData.data as components["schemas"]["ResponseDataListCourtRateDtoBody"];
            const courtRates = data.result || []
            return (
              <div>
                <Await resolve={bookingSlots}>
                  {(resData: any) => {
                    const data =
                    resData.data as components["schemas"]["ResponseDataListBookingSlotDtoBody"];
                    const bookingSlots = data.result ||[]
                    return (
                      <div>
                        {courtRates.length >0 &&
                      <FieldReservation
                      schedules={courtRates}
                      reservations={bookingSlots}
                      />                      
                    }
                    </div>)
                  }}
                </Await>
              </div>
            );
          }}
        </Await>
      </Suspense> */}
    </div>
  );
}
