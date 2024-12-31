import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_COLUMN, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import InvoicesClient from "./invoices.client";
import { components, operations } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action:string
  query:operations["invoices"]["parameters"]["query"]
}
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = await request.json() as ActionData
  let results:components["schemas"]["InvoiceDto"][] = []
  let actions:components["schemas"]["ActionDto"][] = []
  switch (data.action) {
    case "get": {
      const res = await client.GET("/invoice/{party}", {
        params: {
          query: data.query,
          path: {
            party: params.partyInvoice || "",
          },
        },
      });
      results = res.data?.pagination_result.results || []
      actions = res.data?.actions || []
      break;
    }
  }
//   handleError(res.error);
  return json({
    results,
    actions,
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
  console.log("INVOICES...",searchParams,url)
  const res = await client.GET("/invoice/{party}", {
    params: {
      query: {
        size: searchParams.get("size") || DEFAULT_SIZE,
        code:searchParams.get("code") || "",
        orientation: searchParams.get("orientation") || DEFAULT_ORDER,
        column: searchParams.get("column") || DEFAULT_COLUMN,
        status: searchParams.get("status") || "",
        due_date: searchParams.get("due_date") || "",
        posting_date: searchParams.get("posting_date") || "",
        party_id: searchParams.get("party") || "",
        order_id:searchParams.get("order_id") || "",
      },
      path: {
        party: params.partyInvoice || "",
      },
    },
  });
  handleError(res.error);
  
  return json({
    results: res.data?.pagination_result.results,
    actions: res.data?.actions,
    filters:res.data?.pagination_result.filters,
  });
};

export default function PurchaseInvoices() {
  return <InvoicesClient />;
}
