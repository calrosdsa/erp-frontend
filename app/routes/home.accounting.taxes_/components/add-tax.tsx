import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createTaxSchema } from "~/util/data/schemas/accounting/tax-schema";
import { action } from "../route";
import { useToast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { routes } from "~/util/route";


export const AddTax = ({open,onOpenChange}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
})=> {
    const fetcher = useFetcher<typeof action>()
    const {t} = useTranslation("common")
    const { toast } = useToast()
    const r = routes
    useEffect(()=>{
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error
            })
        }
        if(fetcher.data?.message){
            toast({
                title:fetcher.data.message
            })
            onOpenChange(false)
        }
    },[fetcher.data])
    return(
        <DrawerLayout
        open={open}
        title={t("f.add-new",{o:t("_tax.base")})}
        onOpenChange={onOpenChange}
        >
            <CustomForm
            fetcher={fetcher}
            schema={createTaxSchema}
            defaultValues={{
                enabled:true
            } as z.infer<typeof createTaxSchema>}
            onSubmit={(values:z.infer<typeof createTaxSchema>)=>{
                fetcher.submit({
                    action:"add-tax",
                    addTaxData:values,
                },{
                    method:"POST",
                    action:r.taxes,
                    encType:"application/json",
                })
            }}
            formItemsData={[
                {
                    name:"name",
                    label:t("form.name"),
                    type:"string",
                    typeForm:"input",
                },
                {
                    name:"value",
                    label:t("form.value"),
                    type:"string",
                    typeForm:"input",
                },
                {
                    name:"enabled",
                    label:t("form.enabled"),
                    type:"boolean",
                    typeForm:"check",
                    description:t("f.enable",{o:t("_tax.base")}),
                }
            ]}
            >

            </CustomForm>
        </DrawerLayout>
    )
}

type CreateTaxStore = {
    isOpen:boolean
    onOpenChange:(e:boolean)=>void
}

export const useCreateTax = create<CreateTaxStore>((set)=>({
    isOpen:false,
    onOpenChange:(e)=>set((state)=>({isOpen:e}))
}))
    // const [openDialog,setOpenDialog] = useState(false)
    // const dialog = openDialog && <AddTax
    // open={openDialog}
    // onOpenChange={(e)=>setOpenDialog(e)}
    // />
    // return [dialog,setOpenDialog] as const
