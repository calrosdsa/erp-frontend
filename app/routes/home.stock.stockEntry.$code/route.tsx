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
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";

type ActionData = {
  action: string;
  updateStatusWithEvent: z.infer<typeof updateStateWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
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
  }
  return json({
    message,
    error,
  });
};

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
    associatedActions:res.data?.associated_actions
  });
};

export default function StockEntryDetail() {
  return <StockEntryDetailClient />;
}
