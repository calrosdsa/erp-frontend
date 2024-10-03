import { useFetcher, useSearchParams } from "@remix-run/react"
import { action } from "./route"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import FormLayout from "@/components/custom/form/FormLayout"
import { useForm } from "react-hook-form"
import { createAddressSchema } from "~/util/data/schemas/address/address-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomForm from "@/components/custom/form/CustomForm"
import { countries } from "~/util/data/countries"
import { useEffect } from "react"
import { routes } from "~/util/route"


export default function AddressCreateClient(){
    const fetcher = useFetcher<typeof action>()
    const {toast} = useToast()
    const {t} = useTranslation("common")
    const r =routes
    const [searchParams] = useSearchParams()

    useEffect(()=>{
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error,
            })
        }
    },[fetcher.data])
    
    return (
        <CustomForm
        fetcher={fetcher}
        schema={createAddressSchema}
        className="create-grid"
        buttonClassName=""
        defaultValues={{
            partyReferenceId:Number(searchParams.get("referenceId"))
        } as z.infer<typeof createAddressSchema>}
        onSubmit={(values:z.infer<typeof createAddressSchema>)=>{
            fetcher.submit({
                action:"create-address",
                createAddress:values,
                redirectRoute:r.address,
            },{
                action:r.createAddress,
                method:"POST",
                encType:"application/json"
            })
        }}
        formItemsData={[
            {
                label:t("form.name"),
                name:"title",
                typeForm:"input",
                required:true,
                type:"string"
            },
            {
                label:t("form.city"),
                name:"city",
                typeForm:"input",
                required:true,
                type:"string"
            },
            {
                label:t("form.streetLine1"),
                name:"streetLine1",
                typeForm:"input",
                required:true,
                type:"string"
            },
            {
                label:t("form.streetLine2"),
                name:"streetLine2",
                typeForm:"input",
                required:true,
                type:"string"
            },
            {
                label:t("form.company"),
                name:"company",
                typeForm:"input",
                type:"string"
            },
            {
                label:t("form.province"),
                name:"province",
                typeForm:"input",
                type:"string"
            },
            {
                label:t("form.country"),
                name:"countryCode",
                typeForm:"select",
                data:countries,
                keyName:"label",
                keyValue:"code",
            },
            {
                label:t("form.phoneNumber"),
                name:"phoneNumber",
                typeForm:"input",
                type:"tel"
            },
            {
                label:t("form.email"),
                name:"email",
                typeForm:"input",
                type:"email"
            },
            {
                label:t("form.postalCode"),
                name:"postalCode",
                typeForm:"input",
                type:"string"
            },
            {
                label:t("form.identificationNumber"),
                name:"identificationNumber",
                typeForm:"input",
                type:"string"
            },

            {
                label:t("form.enabled"),
                name:"enabled",
                typeForm:"check",
            },
            {
                label:t("form.isShippingAddress"),
                name:"isShippingAddress",
                typeForm:"check",
            },
            {
                label:t("form.isBillingAddress"),
                name:"isBillingAddress",
                typeForm:"check",
            },

        ]}
        />
        // <FormLayout>
        //     <Form {...form}>
        //         <fetcher.Form>
        //             <div className="create-grid">
        //                 <CustomFormField
        //                 label={t("form.name")}
        //                 name={"title"}
        //                 form={form}
        //                 children={(field) => {
        //                   return <Input {...field}/>;
        //                 }}
        //                 />
        //             </div>
        //         </fetcher.Form>
        //     </Form>
        // </FormLayout>
    )
}