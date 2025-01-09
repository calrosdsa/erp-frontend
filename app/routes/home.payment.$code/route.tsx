import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import PaymentDetailClient from "./payment.client";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { mapToPaymentBody, partyReferencesToDto, paymentDataSchema } from "~/util/data/schemas/accounting/payment-schema";
import { formatRFC3339 } from "date-fns";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  updateStateWithEvent: z.infer<typeof updateStatusWithEventSchema>;
  paymentData: z.infer<typeof paymentDataSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {
    case "edit": {
      const res = await client.PUT("/payment", {
        body: mapToPaymentBody(data.paymentData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      actionRes = "";
      break;
    }
    case "update-state-with-event": {
      const res = await client.PUT("/payment/update-state", {
        body: data.updateStateWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
  }
  return json({
    message,
    error,
    action: actionRes,
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
  const url = new URL(request.url)
  const searchParams= url.searchParams
  const tab = searchParams.get("tab")
  let taxLines: components["schemas"]["TaxAndChargeLineDto"][] = [];
  const res = await client.GET("/payment/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
    },
  });
  handleError(res.error);
  if (res.data) {
    switch(tab){
      case "info":{
        const taxLinesRes = await client.GET("/taxes-and-charges", {
          params: {
            query: {
              id: res.data.result.entity.id.toString(),
          },
        },
      });
      taxLines = taxLinesRes.data?.result || []
      break
    }
  }
}

  return json({
    payment: res.data?.result.entity,
    actions: res.data?.actions,
    associatedActions: res.data?.associated_actions,
    activities: res.data?.result.activities || [],
    taxLines:taxLines,
  });
};

export default function PaymentDetail() {
  return <PaymentDetailClient />;
}
