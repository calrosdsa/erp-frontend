import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { accountColumns } from "@/components/custom/table/columns/accounting/account-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { route } from "~/util/route"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { ButtonToolbar } from "~/types/actions"
import { useTranslation } from "react-i18next"
import { ListTree } from "lucide-react"
import { PartyType, partyTypeToJSON } from "~/gen/common"


export default function AccountsClient(){
    const globalState = useOutletContext<GlobalState>()
    const {result,actions} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const r = route
    const {t} = useTranslation("common")
    const navigate = useNavigate()
    setUpToolbar(()=>{
        let buttons:ButtonToolbar[] = []
        buttons.push({
            label:t("treeView"),
            onClick:()=>{
                navigate(r.toRoute({
                    main:r.accountM,
                    routeSufix:[r.treeView]
                }))
            },
            Icon:ListTree
        })
        return {
            buttons:buttons,
            ...(permission?.create && {
                addNew:()=>{
                    navigate(r.toRoute({
                        main:r.accountM,
                        routeSufix:["new"]
                    }))
                }
            })
        }
    },[permission])
    return (
        <div className="">
            <DataTable
            data={result || []}
            columns={accountColumns()}
            enableSizeSelection={true}
            />
        </div>
    )
}