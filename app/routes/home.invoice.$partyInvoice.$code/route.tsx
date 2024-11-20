import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import { ItemLineType, itemLineTypeToJSON, PartyType } from "~/gen/common";
import { handleError } from "~/util/api/handle-status-code";
import PurchaseInvoiceDetailClient from "./invoice.client";
import { z } from "zod";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { FetchResponse } from "openapi-fetch";
type ActionData = {
  action: string;
  updateStateWithEvent: z.infer<typeof updateStateWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "update-state-with-event": {
      const res = await client.PUT("/invoice/update-state", {
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
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  let lineItemRes: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  const res = await client.GET("/invoice/purchase/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
      query: {
        party: params.partyInvoice || "",
      },
    },
  });
  console.log("FETCHIN-HERE", res.error, res.data);
  handleError(res.error);
  if (res.data) {
    switch (tab) {
      case "info": {
        lineItemRes = client.GET("/item-line", {
          params: {
            query: {
              line_type: itemLineTypeToJSON(ItemLineType.ITEM_LINE_ORDER),
              id: res.data?.result.entity.invoice.id.toString(),
            },
          },
        });
        break;
      }
      case "connections": {
        resConnections = client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.invoice.id.toString(),
            },
            query: {
              party: params.partyInvoice || "",
            },
          },
        });
        // console.log(resConnection.data,resConnection.error)
        break;
      }
    }
  }
  return defer({
    invoice: res.data?.result.entity.invoice,
    actions: res.data?.actions,
    connections: resConnections,
    associatedActions: res.data?.associated_actions,
    activities: res.data?.result.activities,
    totals: res.data?.result.entity.totals,
    lineItems:lineItemRes,
  });
};
export default function InvoiceDetail() {
  return (
    <div>
      <PurchaseInvoiceDetailClient />
    </div>
  );
}
