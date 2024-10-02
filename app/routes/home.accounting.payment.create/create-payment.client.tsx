import { useFetcher } from "@remix-run/react"
import { action } from "./route"
import { useTranslation } from "react-i18next"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { createPaymentSchema } from "~/util/data/schemas/accounting/payment-schema"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FormLayout from "@/components/custom/form/FormLayout"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"


export default function PaymentCreateClient(){
    const fetcher = useFetcher<typeof action>()
    const {t} =  useTranslation("common")
    const {toast} = useToast()
    const form = useForm<z.infer<typeof createPaymentSchema>>({
        resolver:zodResolver(createPaymentSchema),
        defaultValues:{}
    })

    const onSubmit = (values:z.infer<typeof createPaymentSchema>) => {

    }

    useEffect(()=>{
        // if(fetcher.data.){

        // }
    },[fetcher.data])
    return (
        <FormLayout>
            <Form {...form}>
                <fetcher.Form 
                method="post"
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("", "gap-y-3 grid p-3")}>
                    <div className="create-grid">
                        
                    </div>

                </fetcher.Form>
            </Form>
        </FormLayout>
    )
}