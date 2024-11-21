import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import BookingScheduleClient from "./booking-schedule.client";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { FetchResponse } from "openapi-fetch";
import { endOfMonth, formatRFC3339, startOfMonth, startOfYear } from "date-fns";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const court = searchParams.get("court") || "305"
  const fromDate = formatRFC3339(startOfMonth(new Date())) || ""
  const toDate = formatRFC3339(endOfMonth(new Date())) || ""

  const res = await client.GET("/court",{
    params:{
      query:{
        page:searchParams.get("page") ||DEFAULT_PAGE,
        size:searchParams.get("size") ||DEFAULT_SIZE
      }
    }
  })
  const resBookingSlots =  client.GET("/regate/booking-slot",{
    params:{
      query:{
        court_id:court,
        to_date:toDate,
        from_date:fromDate,
      }
    }
  })
  const resCourtRates =  client.GET("/court-rate/{id}",{
    params:{
      path:{
        id:"Cancha 1"
      }
    }
  })
  return defer({
    paginationResult:res.data?.pagination_result,
    bookingSlots:resBookingSlots,
    resCourtRates:resCourtRates,

  });
};

export default function BookingSchedule() {
  return <BookingScheduleClient />;
}
