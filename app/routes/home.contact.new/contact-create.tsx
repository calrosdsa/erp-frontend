import { useFetcher, useSearchParams } from "@remix-run/react"
import { action } from "./route"
import CustomForm from "@/components/custom/form/CustomForm"
import { createContactSchema } from "~/util/data/schemas/contact/contact.schema"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { getGenders } from "~/util/data/gender"


export default function ContactCreateClient(){
    const fetcher = useFetcher<typeof action>()
    const {t} = useTranslation("common")
    const {toast} = useToast()
    const [searchParams] = useSearchParams()

    useEffect(()=>{
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error
            })
        }
    },[fetcher.data])
    return (
        <div>
            <CustomForm
            fetcher={fetcher}
            schema={createContactSchema}
            className=" create-grid"
            defaultValues={{
                partyReferenceId:Number(searchParams.get("referenceId"))
            } as z.infer<typeof createContactSchema>}
            onSubmit={(values:z.infer<typeof createContactSchema>)=>{
                fetcher.submit({
                    createContact:values,
                    action:"create-contact",
                },{
                    encType:"application/json",
                    method:"POST",
                })
            }}
            formItemsData={[
                {
                    name:"givenName",
                    label:t("form.givenName"),
                    type:"string",
                    typeForm:"input"
                },
                {
                    name:"familyName",
                    label:t("form.familyName"),
                    type:"string",
                    typeForm:"input"
                },
                {
                    name:"email",
                    label:t("form.email"),
                    type:"email",
                    typeForm:"input"
                },
                {
                    name:"phoneNumber",
                    label:t("form.phoneNumber"),
                    type:"tel",
                    typeForm:"input"
                },
                {
                    name:"gender",
                    label:t("form.gender"),
                    typeForm:"select",
                    data:getGenders(),
                    keyName:"name",
                    keyValue:"code",
                }
            ]}
            />
        </div>
    )
}