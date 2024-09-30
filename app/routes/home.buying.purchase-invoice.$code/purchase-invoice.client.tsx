import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import InvoiceTemplate from "@/components/custom/shared/invoice/InvoiceTemplate"
import { useToolbar } from "~/util/hooks/ui/useToolbar"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { stateFromJSON } from "~/gen/common"


export default function PurchaseInvoiceDetailClient(){
    const {actions,invoiceDetail} = useLoaderData<typeof loader>()
    const toolbarState = useToolbar()
    const {t} = useTranslation("common")

    const setUpToolBar = () =>{
        toolbarState.setToolbar({
            title:`${t("_invoice.base")}(${invoiceDetail?.invoice.code})`,
            state:stateFromJSON(invoiceDetail?.invoice.state)
        })
    }

    useEffect(()=>{
        setUpToolBar()
    },[])
    return (
        <div>
            <InvoiceTemplate
            invoiceDetail={invoiceDetail}
            
            />
        </div>
    )
}