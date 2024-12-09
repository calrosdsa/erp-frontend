import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import StockEntryDetailClient from "./stock-entry-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import StockEntry from "../home.stock.stockEntry_/route";
import { FetchResponse } from "openapi-fetch";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { editStockEntrySchema } from "~/util/data/schemas/stock/stock-entry-schema";
import { formatRFC3339 } from "date-fns";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";

type ActionData = {
  action: string;
  updateStatusWithEvent: z.infer<typeof updateStatusWithEventSchema>;
  editData:z.infer<typeof editStockEntrySchema>
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION
  switch (data.action) {
    case "update-status-with-event": {
      const res = await client.PUT("/stock-entry/update-status", {
        body: data.updateStatusWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log("ORDER ", res.error);
      break;
    }
    case "edit":{
      const d = data.editData
      const res = await client.PUT("/stock-entry",{
        body:{
          id:d.id,
          entry_type: d.entryType,
          posting_date: formatRFC3339(d.postingDate),
          posting_time: d.postingTime,
          tz: d.tz,
          currency: d.currency,
          project:d.projectID,
          cost_center:d.costCenterID,
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
  const tab = searchParams.get("tab") || "info";
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  let lineItemRes: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  const res = await client.GET("/stock-entry/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
    },
  });
  handleError(res.error);
  if (res.data) {
    switch (tab) {
      case "info": {
        lineItemRes = client.GET("/item-line", {
          params: {
            query: {
              line_type: itemLineTypeToJSON(ItemLineType.ITEM_LINE_STOCK_ENTRY),
              id: res.data?.result.entity.id.toString(),
            },
          },
        });
        break;
      }
      case "connections": {
        resConnections = client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.id.toString(),
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
  return defer({
    stockEntry: res.data?.result.entity,
    activities: res.data?.result.activities,
    connections: resConnections,
    lineItems: lineItemRes,
    actions:res.data?.actions,
    associatedActions:res.data?.associated_actions
  });
};

export default function StockEntryDetail() {
  return <StockEntryDetailClient />;
}
