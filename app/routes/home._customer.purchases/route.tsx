import FallBack from "@/components/layout/Fallback";
import { ClientOnly } from "remix-utils/client-only";
import CustomerPurchasesClient from "./customer-purchases.client";


export default function CustomerPurchases(){
    return(
        // <div>PURCHASES</div>
        <ClientOnly fallback={<FallBack/>}>
            {()=>{
                return (
                    <CustomerPurchasesClient/>
                )
            }}
        </ClientOnly>
    )
}