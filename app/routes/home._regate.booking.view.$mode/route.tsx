import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import {
  DEFAULT_COLUMN,
  DEFAULT_CURRENCY,
  DEFAULT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_SIZE,
} from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import BookingsClient from "./bookings.client";
import { components } from "~/sdk";
import { endOfWeek, formatRFC3339, startOfWeek } from "date-fns";
import { route } from "~/util/route";

type ActionData = {
  action: string;
  updateBookingsBatch: components["schemas"]["UpdateBookingBatchRequestBody"];
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "update-bookings-batch": {
      const res = await client.POST("/regate/booking/update-booking-batch", {
        body: data.updateBookingsBatch,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
  }
  return json({ message, error });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  let paginationResult:
    | components["schemas"]["PaginationResultListBookingDto"]
    | undefined = undefined;
  let actions: components["schemas"]["ActionDto"][] = [];
  let bookingSlots: components["schemas"]["BookingSlotDto"][] = [];
  let courtRates: components["schemas"]["CourtRateDto"][] = [];

  if (params.mode == "list") {
    const res = await client.GET("/regate/booking", {
      params: {
        query: {
          page: searchParams.get("page") || DEFAULT_PAGE,
          size: searchParams.get("size") || DEFAULT_SIZE,
          query: searchParams.get("query") || "",
          event_id: searchParams.get("event_id") || "",
          court_id: searchParams.get("court_id") || "",
          customer_id: searchParams.get("party_id") || "",
          order: searchParams.get("order") || DEFAULT_ORDER,
          column: searchParams.get("column") || DEFAULT_COLUMN,
          status: searchParams.get("status") || "",
        },
      },
    });
    paginationResult = res.data?.pagination_result;
    actions = res.data?.actions || [];
  }

  if (params.mode == "schedule") {
    let date = new Date(searchParams.get("date") || new Date());
    let courtID = searchParams.get("court_id") || "";
    let courtName = searchParams.get("court_name") || "";
    const fromDate = formatRFC3339(startOfWeek(date));
    const toDate = formatRFC3339(endOfWeek(date));

    if (!courtID) {
      const res = await client.GET("/court", {
        params: {
          query: {
            size: "1",
          },
        },
      });
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
        route.toRoute({
          main: route.bookingM,
          routeSufix: ["view","schedule"],
          q: {
            court_id: courtID,
            court_name: courtName,
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
    bookingSlots = bookingSchedule.data?.booking_slots || [];
    courtRates = bookingSchedule.data?.cour_rates || []
    
  }
  return json({
    paginationResult: paginationResult,
    actions: actions,
    bookingSlots: bookingSlots,
    courtRates:courtRates,
  });
};

export default function Bookings() {
  return <BookingsClient />;
}
