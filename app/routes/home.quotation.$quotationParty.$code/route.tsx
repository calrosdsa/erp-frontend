import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import QuotationDetailClient from "./quotation-detail.client";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { FetchResponse } from "openapi-fetch";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";

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
      const res = await client.PUT("/quotation/update-status", {
        body: data.updateStateWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.error);
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
              id: res.data.result.entity.id.toString(),
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
              id: res.data?.result.entity.id.toString(),
            },
          },
        });
        break;
      }
    }
  }

  return defer({
    quotation: res.data?.result.entity,
    actions: res.data?.actions,
    connections: resConnections,
    activities: res.data?.result.activities,
    lineItems: lineItemRes,
  });
};

export default function QuotationDetial() {
  return <QuotationDetailClient />;
}
