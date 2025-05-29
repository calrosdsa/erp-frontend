import { json, LoaderFunctionArgs } from "@remix-run/node";
import { format } from "date-fns";
import apiClient from "~/apiclient";
import SerialNoResumeClient from "./serial-no-resume.client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const fromDate =
    searchParams.get("fromDate") || format(new Date(), "yyyy-MM-dd");
  const toDate =
    searchParams.get("toDate") ||
    format(new Date().toLocaleDateString(), "yyyy-MM-dd");
    console.log(searchParams.get("item"),)
  const data = await client.GET("/serial-no/transactions", {
    params: {
      query: {
        from_date: fromDate,
        to_date: toDate,
        voucher_code: searchParams.get("voucherNo") || undefined,
        serial_no: searchParams.get("serialNo") || undefined,
        batch_bundle_no: searchParams.get("batchBundleNo") || undefined,
        item_id:searchParams.get("item_id") || undefined,
      },
    },
  });
  return json({
    serialNoSumaryEntries: data.data?.result || [],
  });
};


export default function SerialNoResume(){
    return <SerialNoResumeClient/>
}