import { useFetcher, useSearchParams } from "@remix-run/react"
import { action } from "./route"
import CustomForm from "@/components/custom/form/CustomForm"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { getGenders } from "~/util/data/gender"
import { contactDataSchema } from "~/util/data/schemas/contact/contact.schema"
import CreateLayout from "@/components/layout/create-layout"
import { setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar"


export default function ContactCreateClient(){
    const fetcher = useFetcher<typeof action>()
    const {t} = useTranslation("common")
    const {toast} = useToast()
    const [searchParams] = useSearchParams()

    setUpToolbarRegister(()=>{
        return {
            titleToolbar:"Nuevo Contacto"
        }
    },[])

    useEffect(()=>{
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error
            })
        }
    },[fetcher.data])
    return (
        <CreateLayout>
            <CustomForm
            fetcher={fetcher}
            schema={contactDataSchema}
            className=" create-grid"
            defaultValues={{
                partyReferenceId: Number(searchParams.get("referenceId"))
            } as unknown as z.infer<typeof contactDataSchema>}
            onSubmit={(values:z.infer<typeof contactDataSchema>)=>{
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
                    name:"name",
                    label:t("form.name"),
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
                    name:"phone_number",
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
        </CreateLayout>
    )
}