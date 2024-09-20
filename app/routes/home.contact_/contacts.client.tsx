import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { DataTable } from "@/components/custom/table/CustomTable"
import { contactColumns } from "@/components/custom/table/columns/contact/contact-columms"
import { routes } from "~/util/route"


export default function ContactsClient(){
    const { paginationResult,actions } = useLoaderData<typeof loader>()
    const  globalState = useOutletContext<GlobalState>()
    const r = routes
    const navigate = useNavigate()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions,
    })
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={contactColumns()}
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            navigate(r.toCreateContact())
                        }
                    })
                }
            }}
            />
        </div>
    )
}