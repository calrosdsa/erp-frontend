import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import SalesRecordClient from "./sales-record.client";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/sales-record", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        invoice_date:searchParams.get("invoice_date") || undefined,
        order:searchParams.get("order") || "",
        column:searchParams.get("column") || "",
        invoice_id:searchParams.get("invoice") || "",
        customer_id:searchParams.get("party") || ""
      },
    },
  });
  handleError(res.error);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
    
  });
};

export default function SalesRecord() {
  return <SalesRecordClient />;
}
