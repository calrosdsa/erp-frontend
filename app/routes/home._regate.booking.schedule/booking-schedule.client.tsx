import { Await, useLoaderData } from "@remix-run/react";
import BookingScheduleHeader from "./components/booking-schedule-header";
import { loader } from "./route";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { components } from "~/sdk";

export default function BookingScheduleClient() {
  const { paginationResult, bookingSlots } = useLoaderData<typeof loader>();
  return (
    <div>
      <BookingScheduleHeader />
      {JSON.stringify(bookingSlots)}
      <Suspense fallback={<FallBack />}>
        <Await resolve={bookingSlots}>
          {(resData: any) => {
            const data =
              resData.data as components["schemas"]["ResponseDataListCourtRateDtoBody"];
            return (
              <div>
                Cour rates
                {JSON.stringify(data)}
                <Await resolve={bookingSlots}>
                  {(resData: any) => {
                    const data =
                      resData.data as components["schemas"]["ResponseDataListBookingSlotDtoBody"];
                    return (
                    <div>
                      Booking Slots
                      {JSON.stringify(data)}
                    </div>)
                  }}
                </Await>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
