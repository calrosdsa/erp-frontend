import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import PurchaseOrderClient from "./order.client";
import apiClient from "~/apiclient";
import {
  ItemLineType,
  itemLineTypeToJSON,
} from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { FetchResponse } from "openapi-fetch";
import { editOrderSchema } from "~/util/data/schemas/buying/purchase-schema";
import { formatRFC3339 } from "date-fns";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";

type ActionData = {
  action: string;
  updateStatusWithEvent: z.infer<typeof updateStatusWithEventSchema>;
  editData:z.infer<typeof editOrderSchema>
};
export const action = async ({ request,params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION
  switch (data.action) {
    case "update-status-with-event": {
      const res = await client.PUT("/order/update-status", {
        body: data.updateStatusWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit":{
      console.log("EDIT ORDER")
      const d = data.editData
      const res = await client.PUT("/order",{
        body:{
          id: d.id,
          currency: d.currency,
          party_id: d.partyID,
          posting_date: formatRFC3339(d.postingDate),
          posting_time: d.postingTime,
          order_party_type:params.partyOrder || "",
          tz: d.tz,
          delivery_date:d.deliveryDate ? formatRFC3339(d.deliveryDate):undefined,
          references:[],
        }
      })
      message = res.data?.message
      error = res.error?.detail
      actionRes = ""
      break;
    }
  }
  return json({
    message,
    error,
    action:actionRes,
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
  const res = await client.GET("/order/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
      query: {
        party: params.partyOrder || "",
      },
    },
  });
  if (res.data) {
    switch (tab) {
      case "info": {
        lineItemRes = client.GET("/item-line", {
          params: {
            query: {
              line_type: itemLineTypeToJSON(ItemLineType.ITEM_LINE_ORDER),
              id: res.data?.result.entity.order.id.toString(),
            },
          },
        });
        taxLinesRes = client.GET("/taxes-and-charges",{
          params:{
            query:{
              id:res.data.result.entity.order.id.toString(),
            }
          }
        })
        break;
      }
      case "connections": {
        resConnections = client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.order.id.toString(),
            },
            query: {
              party: params.partyOrder || "",
            },
          },
        });
        // console.log(resConnection.data,resConnection.error)
        break;
      }
    }
  }
  // res.data?.related_actions
  console.log("FETCH ORDER ...")
  return defer({
    actions: res.data?.actions,
    order: res.data?.result.entity.order,
    acctDimension:res.data?.result.entity.acc_dimensions,
    associatedActions: res.data?.associated_actions,
    activities: res.data?.result.activities,
    connections: resConnections,
    lineItems: lineItemRes,
    taxLines:taxLinesRes, 
  });
};

export default function PurchaseOrder() {
  return <PurchaseOrderClient />;
}
