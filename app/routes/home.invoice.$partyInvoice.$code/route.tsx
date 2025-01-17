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
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { FetchResponse } from "openapi-fetch";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import {
  invoiceDataSchema,
  mapToInvoiceBody,
} from "~/util/data/schemas/invoice/invoice-schema";
import { LOAD_ACTION } from "~/constant";
import { components } from "~/sdk";
type ActionData = {
  action: string;
  updateStateWithEvent: z.infer<typeof updateStatusWithEventSchema>;
  invoiceData: z.infer<typeof invoiceDataSchema>;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  console.log("ON ACTION")
  switch (data.action) {
    case "update-status-with-event": {
      console.log("UPDATE STATUS", data);
      const res = await client.PUT("/invoice/update-state", {
        body: data.updateStateWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log("ERROR", res.error);
      break;
    }
    case "edit": {
      const res = await client.PUT("/invoice", {
        body: mapToInvoiceBody(data.invoiceData),
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log("ON EDIT INVOICE")
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
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  // let lineItemRes: Promise<FetchResponse<any, any, any>> | undefined =
  //   undefined;
  // let taxLinesRes: Promise<FetchResponse<any, any, any>> | undefined =
  //   undefined;
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
  handleError(res.error);
  let lineItems: components["schemas"]["LineItemDto"][] = [];
  let taxLines: components["schemas"]["TaxAndChargeLineDto"][] = [];
  if (res.data) {
    switch (tab) {
      case "info": {
        const lineItemRes = await client.GET("/item-line", {
          params: {
            query: {
              line_type: itemLineTypeToJSON(ItemLineType.ITEM_LINE_ORDER),
              id: res.data?.result.entity.invoice.id.toString(),
              update_stock:
                res.data.result.entity.invoice.update_stock.toString(),
              party_type:params.partyInvoice || "",
            },
          },
        });
        lineItems = lineItemRes.data?.result || []
        const taxLinesRes =await client.GET("/taxes-and-charges", {
          params: {
            query: {
              id: res.data.result.entity.invoice.id.toString(),
            },
          },
        });
        taxLines = taxLinesRes.data?.result || []
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
    lineItems: lineItems,
    taxLines: taxLines,
  });
};
export default function InvoiceDetail() {
  return (
    <div>
      <PurchaseInvoiceDetailClient />
    </div>
  );
}
