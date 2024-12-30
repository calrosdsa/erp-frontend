import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_COLUMN, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import InvoicesClient from "./invoices.client";
import { components } from "~/sdk";

type ActionData = {
  action:string
  getData:{
    query:string
    partyID?:number
  }
}
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = await request.json() as ActionData
  let results:components["schemas"]["InvoiceDto"][] = []
  let actions:components["schemas"]["ActionDto"][] = []
  switch (data.action) {
    case "get": {
      const d = data.getData
      const res = await client.GET("/invoice/{party}", {
        params: {
          query: {
            page: "10",
            size: DEFAULT_SIZE,
            query:d.query,
            party_id:d.partyID?.toString(),
          },
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  console.log("INVOICES...",searchParams,url)
  const res = await client.GET("/invoice/{party}", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        query:searchParams.get("query") || "",
        orientation: searchParams.get("orientation") || DEFAULT_ORDER,
        column: searchParams.get("column") || DEFAULT_COLUMN,
        status: searchParams.get("status") || "",
        due_date: searchParams.get("due_date") || "",
        posting_date: searchParams.get("posting_date") || "",
        party_id: searchParams.get("party") || "",
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
