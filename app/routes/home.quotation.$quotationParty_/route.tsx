import { json, LoaderFunctionArgs } from "@remix-run/node";
import QuotationsClient from "./quotation.client";
import apiClient from "~/apiclient";
import { DEFAULT_COLUMN, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/quotation/{party}", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        code: searchParams.get("code") || "",
        order: searchParams.get("order") || DEFAULT_ORDER,
        column: searchParams.get("column") || DEFAULT_COLUMN,
        status: searchParams.get("status") || "",
        valid_till: searchParams.get("valid_till") || "",
        posting_date: searchParams.get("posting_date") || "",
        party_id: searchParams.get("party") || "",
      },
      path: {
        party: params.quotationParty || "",
      },
    },
  });
  handleError(res.error);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
    filters: res.data?.pagination_result.filters,
  });
};

export default function Quotations() {
  return (
    <div>
      <QuotationsClient />
    </div>
  );
}
