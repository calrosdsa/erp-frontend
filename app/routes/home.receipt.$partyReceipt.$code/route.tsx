import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import ReceiptDetailClient from "./receipt.client";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { FetchResponse } from "openapi-fetch";
import {
  ItemLineType,
  itemLineTypeToJSON,
  PartyType,
  partyTypeToJSON,
} from "~/gen/common";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { formatRFC3339 } from "date-fns";
import { components } from "~/sdk";
import { mapToReceiptData, receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";

type ActionData = {
  action: string;
  updateStateWithEvent: z.infer<typeof updateStatusWithEventSchema>;
  receiptData: z.infer<typeof receiptDataSchema>;
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {
    case "update-state-with-event": {
      const res = await client.PUT("/receipt/update-state", {
        body: data.updateStateWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      const res = await client.PUT("/receipt", {
        body: mapToReceiptData(data.receiptData),
      });
      message = res.data?.message;
      error = res.error?.detail;
      actionRes = "";
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
  let lineItems: components["schemas"]["LineItemDto"][] = [];
  let taxLines: components["schemas"]["TaxAndChargeLineDto"][] = [];
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
        const lineItemRes =await  client.GET("/item-line", {
          params: {
            query: {
              line_type:
                params.partyReceipt ==
                partyTypeToJSON(PartyType.purchaseReceipt)
                  ? itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT)
                  : itemLineTypeToJSON(ItemLineType.DELIVERY_LINE_ITEM),
              id: res.data?.result.entity.receipt.id.toString(),
            },
          },
        });
        lineItems = lineItemRes.data?.result || []
        const taxLinesRes = await client.GET("/taxes-and-charges", {
          params: {
            query: {
              id: res.data.result.entity.receipt.id.toString(),
            },
          },
        });
        taxLines = taxLinesRes.data?.result || []
        // console.log("ITEM LINES", lineItemResd.error, lineItemResd.data);
        break;
      }
    }
  }

  return defer({
    receiptDetail: res.data?.result.entity,
    receipt: res.data?.result.entity.receipt,
    actions: res.data?.actions,
    associatedActions: res.data?.associated_actions,
    connections: resConnections,
    activities: res.data?.result.activities,
    lineItems: lineItems,
    taxLines: taxLines,
  });
};

export default function ReceiptDetail() {
  return <ReceiptDetailClient />;
}
