import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import PurchaseOrderClient from "./order.client";
import apiClient from "~/apiclient";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { FetchResponse } from "openapi-fetch";
import {
  mapToOrderData,
  orderDataSchema,
} from "~/util/data/schemas/buying/order-schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  updateStatusWithEvent: z.infer<typeof updateStatusWithEventSchema>;
  orderData: z.infer<typeof orderDataSchema>;
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {
    case "update-status-with-event": {
      const res = await client.PUT("/order/update-status", {
        body: data.updateStatusWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      console.log("EDIT ORDER");
      const res = await client.PUT("/order", {
        body: mapToOrderData(data.orderData, params.partyOrder || ""),
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
  //   let taxLinesRes: Promise<FetchResponse<any, any, any>> | undefined =
  //   undefined;
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
  let lineItems: components["schemas"]["LineItemDto"][] = [];
  let taxLines: components["schemas"]["TaxAndChargeLineDto"][] = [];
  let addressAndContact:components["schemas"]["AddressAndContactDto"] | undefined = undefined
  let docTerms:components["schemas"]["DocTermsDto"] | undefined = undefined
  if (res.data) {
    switch (tab) {
      case "info": {
        const lineItemRes = await client.GET("/item-line", {
          params: {
            query: {
              line_type: itemLineTypeToJSON(ItemLineType.ITEM_LINE_ORDER),
              id: res.data?.result.entity.order.id.toString(),
            },
          },
        });
        lineItems = lineItemRes.data?.result || [];
        const taxLinesRes = await client.GET("/taxes-and-charges", {
          params: {
            query: {
              id: res.data.result.entity.order.id.toString(),
            },
          },
        });
        taxLines = taxLinesRes.data?.result || [];
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
      case "address-and-contact":{
        const aacRes = await client.GET("/document/info/address-and-contact/{id}",{
          params:{
            path:{
              id:res.data.result.entity.order.id.toString(),
            },
            query:{
              party: params.partyOrder || "",
            }
          }
        })
        addressAndContact = aacRes.data?.result
      }
      case "terms-and-conditions":{
        const aacRes = await client.GET("/document/info/doc-term/{id}",{
          params:{
            path:{
              id:res.data.result.entity.order.id.toString(),
            },
            query:{
              party: params.partyOrder || "",
            }
          }
        })
        console.log("DOC TERMS",aacRes.data)
        docTerms = aacRes.data?.result
      }
    }
  }
  // res.data?.related_actions
  console.log("FETCH ORDER ...");
  return defer({
    actions: res.data?.actions,
    order: res.data?.result.entity.order,
    acctDimension: res.data?.result.entity.acc_dimensions,
    associatedActions: res.data?.associated_actions,
    activities: res.data?.result.activities,
    connections: resConnections,
    lineItems: lineItems,
    taxLines: taxLines,
    addressAndContact,
    docTerms,
  });
};

export default function PurchaseOrder() {
  return <PurchaseOrderClient />;
}
