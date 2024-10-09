import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { receiptColumns } from "@/components/custom/table/columns/receipt/receipt-columns";
import { routes } from "~/util/route";
import { PartyType } from "~/gen/common";


export default function ReceiptsClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const params = useParams()
    const r = routes
    const navigate = useNavigate()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })

    return (
        <div>
            <DataTable
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            navigate(r.toCreateReceipt(params.partyReceipt || ""))
                        }
                    }) 
                }
            }}
            data={paginationResult?.results || []}
            columns={receiptColumns({
                receiptPartyType:params.partyReceipt || PartyType[PartyType.purchaseReceipt]
            })}
            />
        </div>
    )
}