import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { warehouseColumns } from "@/components/custom/table/columns/stock/warehouse-columns"
import { useCreateWareHouse } from "./components/add-warehouse"
import { ListTree } from "lucide-react"
import { usePermission } from "~/util/hooks/useActions"
import { GlobalState } from "~/types/app"
import { route } from "~/util/route"
import { useTranslation } from "react-i18next"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { ButtonToolbar } from "~/types/actions"
import { PartyType, partyTypeToJSON } from "~/gen/common"

export default function WareHousesClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const createWareHouse = useCreateWareHouse()
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
                    main:partyTypeToJSON(PartyType.warehouse),
                    routePrefix:[r.stockM],
                    routeSufix:[r.treeView]
                }))
            },
            Icon:ListTree
        })
        return {
            buttons:buttons,
            ...(permission?.create && {
                addNew:()=>{
                    createWareHouse.openDialog({})
                }
            })
        }
    },[permission])
    return (
        <>
            <DataTable
            data={paginationResult?.results || []}
            columns={warehouseColumns()}
            enableSizeSelection={true}
            paginationOptions={{
                rowCount:paginationResult?.total
            }}
            />
        </>
    )
}