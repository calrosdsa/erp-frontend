import { json, LoaderFunctionArgs } from "@remix-run/node";
import GeneralLedgerClient from "./stock-ledger.client";
import apiClient from "~/apiclient";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { handleError } from "~/util/api/handle-status-code";
import StockLedgerClient from "./stock-ledger.client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const fromDate =
    searchParams.get("fromDate") || format(new Date(), "yyyy-MM-dd");
  const toDate =
    searchParams.get("toDate") ||
    format(new Date().toLocaleDateString(), "yyyy-MM-dd");
  const res = await client.GET("/stock-ledger/report", {
    params: {
      query: {
        from_date: fromDate,
        to_date: toDate, 
        voucher_no:searchParams.get("voucherNo") || "",
        item:searchParams.get("item") || "",
        warehouse:searchParams.get("warehouse") || "",

      },
    },
  });
  handleError(res.error);
  return json({
    stockLedger: res.data?.result,
  });
};

export default function StockLedger() {
  return <StockLedgerClient />;
}
