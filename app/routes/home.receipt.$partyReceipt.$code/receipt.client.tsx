import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"


export default function ReceiptDetailClient(){
    const {receiptDetail,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    return (
        <div>
        RECEIPT DETAIL
        {/* {JSON.stringify(receiptDetail)} */}
        </div>
    )
}