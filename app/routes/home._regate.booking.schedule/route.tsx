import { defer, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
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
  let court = searchParams.get("court") || "";
  let courtName = searchParams.get("courtName") || "";
  let date = new Date(searchParams.get("date") || new Date());
  const fromDate = formatRFC3339(startOfWeek(date));
  const toDate = formatRFC3339(endOfWeek(date));
 console.log(fromDate,toDate)
  let bookingSlots: components["schemas"]["BookingSlotDto"][] = [];
  let courtRates: components["schemas"]["CourtRateDto"][] = [];
  if (!court) {
    const res = await client.GET("/court", {
      params: {
        query: {
          page: searchParams.get("page") || DEFAULT_PAGE,
          size: "1",
        },
      },
    });
    if ((res.data && res.data?.pagination_result?.total == 0) || res.error) {
      return json({
        bookingSlots,
        courtRates,
      });
    }

    if (res.data && res.data?.pagination_result?.total > 0) {
      court = res.data.pagination_result.results[0]?.id.toString() || "";
      courtName = res.data.pagination_result.results[0]?.name || "";
    }
    return redirect(
      r.toRoute({
        main: r.bookingM,
        routeSufix: ["schedule"],
        q: {
          court: court,
          courtName: courtName,
        },
      })
    );
  }
  const bookingSchedule = await client.GET("/regate/booking-slot", {
    params: {
      query: {
        court_id: court,
        to_date: toDate,
        from_date: fromDate,
      },
    },
  });

  return json({
    bookingSlots: bookingSchedule.data?.booking_slots || [],
    courtRates: bookingSchedule.data?.cour_rates || [],
  });
};

export default function BookingSchedule() {
  return <BookingScheduleClient />;
}
