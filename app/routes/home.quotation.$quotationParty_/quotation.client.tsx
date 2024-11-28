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
import { quotationColumns } from "@/components/custom/table/columns/document/quotation-columns";


export default function QuotationsClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const params = useParams()
    const quotationParty = params.quotationParty || ""
    const r = routes
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })

    setUpToolbar(()=>{
        return {
            ...(permission?.create && {
                addNew:()=>{
                    navigate(r.toRoute({
                        main:quotationParty,
                        routePrefix:[r.quotation],
                        routeSufix:["new"]
                    }))
                }
            }) 
        }
    },[permission])

    return (
        <div>
            <DataTable           
            data={paginationResult?.results || []}
            columns={quotationColumns()}
            />
        </div>
    )
}