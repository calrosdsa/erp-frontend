import { ActionFunctionArgs, defer, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import apiClient from "~/apiclient";
import BookingScheduleClient from "./booking-schedule.client";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { FetchResponse } from "openapi-fetch";
import { endOfMonth, endOfWeek, formatRFC3339, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { route } from "~/util/route";
import { components } from "~/sdk";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const r = route;
  let courtID = searchParams.get("courtID") || "";
  let courtName = searchParams.get("courtName") || "";
  let date = new Date(searchParams.get("date") || new Date());
  const fromDate = formatRFC3339(startOfWeek(date));
  const toDate = formatRFC3339(endOfWeek(date));
 console.log(fromDate,toDate)
  let bookingSlots: components["schemas"]["BookingSlotDto"][] = [];
  let courtRates: components["schemas"]["CourtRateDto"][] = [];
  if (!courtID) {
    const res = await client.GET("/court", {
      params: {
        query: {
          size: "1",
        },
      },
    });
    if(res.error){
      return {
        bookingSlots,
        courtRates,    
      }
    }
    // if ((res.data && res.data?.pagination_result?.total == 0) || res.error) {
    //   return json({
    //     bookingSlots,
    //     courtRates,
    //   });
    // }

    if (res.data) {
      courtID = res.data.result[0]?.id.toString() || "";
      courtName = res.data.result[0]?.name || "";
    }
    return redirect(
      r.toRoute({
        main: r.bookingM,
        routeSufix: ["schedule"],
        q: {
          courtID: courtID,
          courtName: courtName,
        },
      })
    );
  }
  const bookingSchedule = await client.GET("/regate/booking-slot", {
    params: {
      query: {
        court_id: courtID,
        to_date: toDate,
        from_date: fromDate,
      },
    },
  });

  return {
    bookingSlots: bookingSchedule.data?.booking_slots || [],
    courtRates: bookingSchedule.data?.cour_rates || [],
  };
};

export default function BookingSchedule() {
  return <BookingScheduleClient />;
}
