import { useFetcher, useLoaderData, useParams } from "@remix-run/react"
import { action, loader } from "./route"
import InvoiceTemplate from "@/components/custom/shared/invoice/InvoiceTemplate"
import { useToolbar } from "~/util/hooks/ui/useToolbar"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { EventState, PartyType, stateFromJSON } from "~/gen/common"
import { z } from "zod"
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema"
import { routes } from "~/util/route"
import { toast, useToast } from "@/components/ui/use-toast"


export default function InvoiceDetailClient(){
    const {actions,invoiceDetail} = useLoaderData<typeof loader>()
    const toolbarState = useToolbar()
    const {t} = useTranslation("common")
    const fetcher = useFetcher<typeof action>()
    const params = useParams()
    const r = routes
    const {toast } = useToast()
    const setUpToolBar = () =>{
        toolbarState.setToolbar({
            title:`${t("_invoice.base")}(${invoiceDetail?.invoice.code})`,
            status:stateFromJSON(invoiceDetail?.invoice.state),
            onChangeState:(e)=>{
                const body:z.infer<typeof updateStateWithEventSchema> = {
                    current_state:invoiceDetail?.invoice.state || "", 
                    party_type:params.partyInvoice || "",
                    party_uuid:invoiceDetail?.invoice.uuid || "",
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
    useEffect(()=>{
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error,
            })
        }
        if(fetcher.data?.message){
            toast({
                title:fetcher.data.message
            })
        }
    },[fetcher.data])

    useEffect(()=>{
        setUpToolBar()
    },[invoiceDetail])
    return (
        <div>
            <InvoiceTemplate
            invoiceDetail={invoiceDetail}
            />
        </div>
    )
}