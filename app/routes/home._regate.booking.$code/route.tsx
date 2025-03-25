import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { BookingModal } from "./booking-modal";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { editPaidAmountSchema } from "~/util/data/schemas/regate/booking-schema";
import { components } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { route } from "~/util/route";

type ActionData = {
  action: string;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
  editPaidAmount: z.infer<typeof editPaidAmountSchema>;
  rescheduleBooking: components["schemas"]["BookingRescheduleBody"];
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "reschedule-booking": {
      const d = data.rescheduleBooking;
      const res = await client.PUT("/regate/booking/reschedule", {
        body: d,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit-paid-amount": {
      const d = data.editPaidAmount;
      const res = await client.PUT("/regate/booking/paid-amount", {
        body: {
          booking_id: d.bookingID,
          added_amount: d.addedAmount,
          total_paid_amount: d.paidAmount,
        },
      });
      console.log(d,res.error,res.data)
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "update-status": {
      const d = data.updateStatus;
      const res = await client.PUT("/regate/booking/update-status", {
        body: {
          party_id: d.party_id,
          party_type: d.party_type,
          events: d.events,
          current_state: d.current_state,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
    }
  }
  return json({
    error,
    message,
    action:LOAD_ACTION
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.action == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const res = await client.GET("/regate/booking/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
    },
  });
  handleError(res.error);
  return defer({
    booking: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
  });
};



export const openBookingModal = (id?:string,callback?:(key:string,value:string)=>void) => {
  if(id && callback){

    callback(route.booking, id);
  }
};




