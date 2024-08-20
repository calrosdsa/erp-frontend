import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";


export const upsertItemAttributeValueSchema = z.object({
    value:z.string(),
    abbreviation:z.string(),
    ordinal:z.number().readonly(),
    itemAttributeId:z.number(),
})
export default function UpsertItemAttributeValue({
    open,close,title
}:{
    open:boolean
    close:()=>void
    title:string
}){
    const fetcher = useFetcher({key:"upsert-item-attribute"})
    const form = useForm<z.infer<typeof upsertItemAttributeValueSchema>>({
        resolver:zodResolver(upsertItemAttributeValueSchema),
        defaultValues:{
            ordinal:1,
        }
    })
    const {t} = useTranslation()

    const onSubmit = (e:z.infer<typeof upsertItemAttributeValueSchema>) =>{
        console.log("vvv",e)
    }
    return (
        <DrawerLayout open={open} close={()=>close()} title={title}>
            <CustomForm
            form={form}
            fetcherKey="upsert-item-attribute"
            formItemsData={[
                {
                    name:"ordinal",
                    type:"number",
                    typeForm:"input",
                    label:t("table.no"),
                    readOnly:true
                },
                {
                    name:"value",
                    type:"string",
                    typeForm:"input",
                    label:t("_stock.itemAttributeValue"),
                },
                {
                    name:"abbreviation",
                    type:"string",
                    typeForm:"input",
                    label:t("table.abbreviation"),
                },
            ]}
            onSubmitt={form.handleSubmit(onSubmit)}
            />
        </DrawerLayout>
    )
}

