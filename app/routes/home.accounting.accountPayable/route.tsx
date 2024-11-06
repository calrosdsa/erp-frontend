import { json, LoaderFunctionArgs } from "@remix-run/node";
import GeneralLedgerClient from "./account-payable.client";
import apiClient from "~/apiclient";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { handleError } from "~/util/api/handle-status-code";
import AccountPayableClient from "./account-payable.client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const fromDate =
    searchParams.get("fromDate") || format(new Date(), "yyyy-MM-dd");
  const toDate =
    searchParams.get("toDate") ||
    format(new Date().toLocaleDateString(), "yyyy-MM-dd");
  console.log(fromDate, toDate);
  const res = await client.GET("/accounting/report/account-payable", {
    params: {
      query: {
        from_date: fromDate,
        to_date: toDate,        
        parties: searchParams.get("parties") || "[14]",
      },
    },
  });
  handleError(res.error);
  return json({
    accountPayable: res.data?.result,
  });
};

export default function AccountPayable() {
  return <AccountPayableClient />;
}
