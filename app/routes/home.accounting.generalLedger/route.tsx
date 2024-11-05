import { json, LoaderFunctionArgs } from "@remix-run/node";
import GeneralLedgerClient from "./general-ledger.client";
import apiClient from "~/apiclient";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { handleError } from "~/util/api/handle-status-code";

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const fromDate = searchParams.get("fromDate") || format(startOfMonth(new Date()),"yyyy-MM-dd")
    const toDate = searchParams.get("toDate") || format(endOfMonth(new Date()).toLocaleDateString(),"yyyy-MM-dd")
    const voucherNo = searchParams.get("voucherNo") 
    console.log(fromDate,toDate)
    const res = await client.GET("/ledger/general",{
        params:{
            query:{
                from_date:fromDate,
                to_date:toDate,
                voucher_no:voucherNo || "",
            }
        }
    })
    handleError(res.error)
    return json({
        generalLedger:res.data?.result,
    })
}

export default function GeneralLedger(){
    return (
        <GeneralLedgerClient/>
    )
}