import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { paymentColumns } from "@/components/custom/table/columns/accounting/payment-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { routes } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";


export default function PaymentsClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const r = routes
    const navigate = useNavigate()
    const globalState =  useOutletContext<GlobalState>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    setUpToolbar(()=>{
        return {
            ...(permission?.create && {
                addNew:()=>{
                    navigate(r.toPaymentCreate())
                }
            })
        }
    },[permission])
    return (
        <div>
            <DataTable
            columns={paymentColumns()}
            data={paginationResult?.results ||  []}
            />
        </div>
    )
}