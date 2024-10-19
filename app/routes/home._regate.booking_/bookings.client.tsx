import { DataTable } from "@/components/custom/table/CustomTable"
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { bookingColumns } from "@/components/custom/table/columns/regate/booking-columns"
import { useToolbar } from "~/util/hooks/ui/useToolbar"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { routes } from "~/util/route"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"


export default function BookingsClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const {t} = useTranslation("common")
    const navigate = useNavigate()
    const r = routes
    const toolbar = useToolbar()

    const setUpToolbar = () =>{
        toolbar.setToolbar({
            title:t("regate._booking.base")
        })
    }

    useEffect(()=>{
        setUpToolbar()
    },[])

    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={bookingColumns()}
            hiddenColumns={{
                "created_at":false
            }}
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            navigate(r.toCreateBooking())
                        }
                    })
                }
            }}
            />
        </div>
    )
}