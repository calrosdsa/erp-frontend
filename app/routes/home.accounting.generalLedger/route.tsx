import { json, LoaderFunctionArgs } from "@remix-run/node";
import GeneralLedgerClient from "./general-ledger.client";
import apiClient from "~/apiclient";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { handleError } from "~/util/api/handle-status-code";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const fromDate =
    searchParams.get("fromDate") || format(new Date(), "yyyy-MM-dd");
  const toDate =
    searchParams.get("toDate") ||
    format(new Date(), "yyyy-MM-dd");
  const voucherNo = searchParams.get("voucherNo");
  console.log(fromDate, toDate);
  const res = await client.GET("/accounting/report/general", {
    params: {
      query: {
        from_date: fromDate,
        to_date: toDate,
        voucher_no: voucherNo || "",
        party: searchParams.get("party") || "",
        party_type: searchParams.get("partyType") || "",
        account:searchParams.get("account") || "",
        project:searchParams.get("project_id") || "",
        cost_center:searchParams.get("cost_center_id") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    generalLedger: res.data?.result.entries,
    opening:res.data?.result.opening
    
  });
};

export default function GeneralLedger() {
  return <GeneralLedgerClient />;
}
