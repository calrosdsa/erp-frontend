import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import QuotationDetailClient from "./quotation-detail.client";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { FetchResponse } from "openapi-fetch";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { editQuotationSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { formatRFC3339 } from "date-fns";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  updateStateWithEvent: z.infer<typeof updateStateWithEventSchema>;
  editData: z.infer<typeof editQuotationSchema>;
};
export const action = async ({ request,params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "update-state-with-event": {
      const res = await client.PUT("/quotation/update-status", {
        body: data.updateStateWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      const d = data.editData
      const res = await client.PUT("/quotation",{
        body:{
          id: d.id,
          currency: d.currency,
          party_id: d.partyID,
          posting_date: formatRFC3339(d.postingDate),
          posting_time: d.postingTime,
          quotation_party_type:params.quotationParty || "",
          tz: d.tz,
          valid_till: formatRFC3339(d.validTill),
        }
      })
      message = res.data?.message
      error = res.error?.detail
      console.log(res.error);
      break;
    }
  }

  return json({
    message,
    error,
  });
};
export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
}:ShouldRevalidateFunctionArgs) {
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  let lineItemRes: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  let taxLinesRes: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  const res = await client.GET("/quotation/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
      query: {
        party: params.quotationParty || "",
      },
    },
  });
  handleError(res.error);

  if (res.data) {
    switch (tab) {
      case "connections": {
        resConnections = client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.quotation.id.toString(),
            },
            query: {
              party: params.partyReceipt || "",
            },
          },
        });
        // console.log(resConnection.data,resConnection.error)
        break;
      }
      case "info": {
        lineItemRes = client.GET("/item-line", {
          params: {
            query: {
              line_type: itemLineTypeToJSON(ItemLineType.QUOTATION_LINE_ITEM),
              id: res.data?.result.entity.quotation.id.toString(),
            },
          },
        });
        taxLinesRes = client.GET("/taxes-and-charges", {
          params: {
            query: {
              id: res.data.result.entity.quotation.id.toString(),
            },
          },
        });
        break;
      }
    }
  }
  console.log("GET QUOTATION...")

  return defer({
    quotation: res.data?.result.entity.quotation,
    actions: res.data?.actions,
    connections: resConnections,
    activities: res.data?.result.activities,
    lineItems: lineItemRes,
    taxLines: taxLinesRes,
    assocActions: res.data?.associated_actions,
  });
};

export default function QuotationDetial() {
  return <QuotationDetailClient />;
}
