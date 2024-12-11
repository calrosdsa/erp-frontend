import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import ReceiptDetailClient from "./receipt.client";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { FetchResponse } from "openapi-fetch";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { editReceiptSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { formatRFC3339 } from "date-fns";

type ActionData = {
  action: string;
  updateStateWithEvent: z.infer<typeof updateStatusWithEventSchema>;
  editData:z.infer<typeof editReceiptSchema>
};
export const action = async ({ request,params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION
  switch (data.action) {
    case "update-state-with-event": {
      const res = await client.PUT("/receipt/update-state", {
        body: data.updateStateWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.error);
      break;
    }
    case "edit":{
      const d = data.editData
      const res = await client.PUT("/receipt",{
        body:{
          party_id: d.partyID,
          party_receipt: params.partyReceipt || "",
          posting_date: formatRFC3339(d.postingDate),
          posting_time: d.postingTime,
          tz: d.tz,
          project: d.projectID,
          cost_center: d.costCenterID,
          currency: d.currency,
          id: d.id
        }
      })
      message = res.data?.message
      error = res.error?.detail
      actionRes = ""
      break
    }
  }
  return json({
    message,
    error,
    action:actionRes
  });
};
export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult
}:ShouldRevalidateFunctionArgs) {
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
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  let lineItemRes: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  let taxLinesRes: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  const res = await client.GET("/receipt/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
      query: {
        party: params.partyReceipt || "",
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
              id: res.data.result.entity.receipt.id.toString(),
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
              line_type: itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT),
              id: res.data?.result.entity.receipt.id.toString(),
            },
          },
        });
        taxLinesRes = client.GET("/taxes-and-charges",{
          params:{
            query:{
              id:res.data.result.entity.receipt.id.toString(),
            }
          }
        })
        break;
      }
    }
  }

  return defer({
    receiptDetail: res.data?.result.entity,
    receipt: res.data?.result.entity.receipt,
    actions: res.data?.actions,
    connections: resConnections,
    activities: res.data?.result.activities,
    lineItems: lineItemRes,
    taxLines:taxLinesRes,
  });
};

export default function ReceiptDetail() {
  return <ReceiptDetailClient />;
}
