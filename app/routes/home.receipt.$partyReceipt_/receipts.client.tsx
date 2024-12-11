import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { receiptColumns } from "@/components/custom/table/columns/receipt/receipt-columns";
import { routes } from "~/util/route";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";


export default function ReceiptsClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const params = useParams()
    const r = routes
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const { resetDocument } = useResetDocument()
    setUpToolbar(()=>{
        return {
            ...(permission?.create && {
                addNew:()=>{
                    resetDocument()
                    navigate(r.toCreateReceipt(partyTypeFromJSON(params.partyReceipt)))
                }
            }) 
        }
    },[permission])

    return (
        <div>
            <DataTable
            paginationOptions={{
                rowCount:paginationResult?.total,
            }}
            
            data={paginationResult?.results || []}
            columns={receiptColumns({
                receiptPartyType:params.partyReceipt || PartyType[PartyType.purchaseReceipt]
            })}
            />
        </div>
    )
}