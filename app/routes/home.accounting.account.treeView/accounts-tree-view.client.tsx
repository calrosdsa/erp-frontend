import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { accountColumns } from "@/components/custom/table/columns/accounting/account-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { route } from "~/util/route"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { TreeView } from "@/components/layout/tree/tree-view"
import { useNewAccount } from "../home.accounting.account.new/use-new-account"


export default function AccountsTreeViewClient(){
    const globalState = useOutletContext<GlobalState>()
    const {data,actions} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const r = route
    const navigate = useNavigate()
    const newAccount = useNewAccount()
    setUpToolbar(()=>{
        return {
            ...(permission?.create && {
                addNew:()=>{
                    navigate(r.toCreateAccountLedger())
                }
            })
        }
    },[permission])
    return (
        <div>
            <TreeView
            data={data||[]}
            onAddChild={(e)=>{
                newAccount.setPayload({
                    parentName:e.name,
                    parentID:e.id
                })
                navigate(r.toRoute({
                    main:r.accountM,
                    routePrefix:[r.accountingM],
                    routeSufix:["new"]
                }))
            }}
            onEdit={(e)=>{
                navigate(r.toRoute({
                    main:r.accountM,
                    routePrefix:[r.accountingM],
                    routeSufix:[e.name],
                    q:{
                        tab:"info",
                        id:e.uuid
                    }
                }))
            }}
            />    
        </div>
    )
}