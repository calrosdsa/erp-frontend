import { useLoaderData, useNavigate, useOutletContext, useParams } from "@remix-run/react"
import { loader } from "./route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { DataTable } from "@/components/custom/table/CustomTable"
import { invoiceColumns } from "@/components/custom/table/columns/invoice/invoice-columns"
import { routes } from "~/util/route"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { useTranslation } from "react-i18next"


export default function InvoicesClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const params = useParams()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const navigate = useNavigate()
    const {t} = useTranslation("common")
    const r = routes
    setUpToolbar(()=>{
        return {
            title:t(params.partyInvoice || ""),
            ...(permission?.create && {
                addNew:()=>{
                    navigate(r.toPurchaseInvoiceCreate())
                }
            })
        }
    },[permission])
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={invoiceColumns({
                partyType:params.partyInvoice || ""
            })}
            paginationOptions={{
                rowCount:paginationResult?.total,   
            }}
            />
        </div>
    )
}