import { json, LoaderFunctionArgs } from "@remix-run/node";
import GeneralLedgerClient from "./account-receivable-sumary.client";
import apiClient from "~/apiclient";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { handleError } from "~/util/api/handle-status-code";
import AccountReceivableSumaryClient from "./account-receivable-sumary.client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const fromDate =
    searchParams.get("fromDate") || format(new Date(), "yyyy-MM-dd");
  const toDate =
    searchParams.get("toDate") ||
    format(new Date().toLocaleDateString(), "yyyy-MM-dd");
  const res = await client.GET("/accounting/report/account-receivable/sumary", {
    params: {
      query: {
        from_date: fromDate,
        to_date: toDate,        
        party: decodeURIComponent(searchParams.get("party") || "") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    accountReceivableSumary: res.data?.result,
  });
};

export default function AccountReceivableSumary() {
  return <AccountReceivableSumaryClient />;
}
