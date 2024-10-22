import { useFetcher, useLoaderData, useParams, useSearchParams } from "@remix-run/react"
import { action, loader } from "./route"
import { useToolbar } from "~/util/hooks/ui/useToolbar"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { EventState, PartyType, stateFromJSON } from "~/gen/common"
import { z } from "zod"
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema"
import { routes } from "~/util/route"
import { toast, useToast } from "@/components/ui/use-toast"
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage"
import DetailLayout from "@/components/layout/detail-layout"
import InvoiceInfoTab from "./components/tab/invoice-info"
import InvoiceConnectionsTab from "./components/tab/invoice-connections"


export default function InvoiceDetailClient(){
    const {actions,invoice,activities} = useLoaderData<typeof loader>()
    const toolbarState = useToolbar()
    const {t} = useTranslation("common")
    const fetcher = useFetcher<typeof action>()
    const params = useParams()
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab")
    const r = routes

    const navItems = [
        {
          title: t("info"),
          href: r.toInvoiceDetail(params.partyInvoice || "",invoice?.code || ""),
        },
        {
          title: t("connections"),
          href: r.toInvoiceDetail(params.partyInvoice || "",invoice?.code || "","connections"),
        },
      ];

    const setUpToolBar = () =>{
        toolbarState.setToolbar({
            title:`${t("_invoice.base")}(${invoice?.code})`,
            status:stateFromJSON(invoice?.status),
            onChangeState:(e)=>{
                const body:z.infer<typeof updateStateWithEventSchema> = {
                    current_state:invoice?.status || "", 
                    party_type:params.partyInvoice || "",
                    party_id:invoice?.code || "",
                    events:[e],
                }
                fetcher.submit({
                    action:"update-state-with-event",
                    updateStateWithEvent:body
                },{
                    method:"POST",
                    encType:"application/json"
                })
            }
            
        })
    }

    


    useEffect(()=>{
        if(fetcher.state =="submitting"){
            toolbarState.setLoading(true)
        }else{
            toolbarState.setLoading(false)
        }
    },[fetcher.state])

    useDisplayMessage({
        error:fetcher.data?.error,
        success:fetcher.data?.message,
    },[fetcher.data])

    useEffect(()=>{
        setUpToolBar()
    },[])
    return (
        <DetailLayout
        navItems={navItems}
        partyID={invoice?.id}
        activities={activities}
        >
           {tab == "info" &&
           <InvoiceInfoTab/>
           }
           {tab == "connections" &&
           <InvoiceConnectionsTab/>
           }
        </DetailLayout>
    )
}