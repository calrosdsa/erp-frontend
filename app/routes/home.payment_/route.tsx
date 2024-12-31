import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_COLUMN, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import PaymentsClient from "./payments.client";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";


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


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/payment", {
    params: {
      query: {
        size: searchParams.get("size") || DEFAULT_SIZE,
        code: searchParams.get("code") || "",
        orientation: searchParams.get("orientation") || DEFAULT_ORDER,
        column: searchParams.get("column") || DEFAULT_COLUMN,
        status: searchParams.get("status") || "",
        posting_date: searchParams.get("posting_date") || "",
        party_id: searchParams.get("party_id") || "",
        invoice_id: searchParams.get("pi_id") || searchParams.get("si_id") || "",
        amount:searchParams.get("amount") || "",
        payment_type:searchParams.get("payment_type") || "",
        account_paid_from_id:searchParams.get("account_paid_from_id") || "",
        account_paid_to_id:searchParams.get("account_paid_to_id") || "",
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

export default function Payments() {
  return (
    <div>
      <PaymentsClient />
    </div>
  );
}
