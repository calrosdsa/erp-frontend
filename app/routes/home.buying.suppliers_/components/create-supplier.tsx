import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { action } from "../route";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import CustomForm from "@/components/custom/form/CustomForm";
import { createSupplierSchema } from "~/util/data/schemas/buying/supplier-schema";
import { z } from "zod";
import { routes } from "~/util/route";


export const CreateSupplier = ({open,onOpenChange}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
}) =>{
    const fetcher = useFetcher<typeof action>()
    const {t} = useTranslation("common")
    const {toast} = useToast()
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
        }
    },[fetcher.data])
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}
        title={t("f.add-new",{o:t("_supplier.base")})}
        >
            <CustomForm
            schema={createSupplierSchema}
            fetcher={fetcher}
            defaultValues={{
                enabled:true
            } as z.infer<typeof createSupplierSchema>}
            onSubmit={(values:z.infer<typeof createSupplierSchema>)=>{
                fetcher.submit({
                    action:"create-supplier",
                    createSupplier:values,
                },{
                    encType:"application/json",
                    action:r.suppliers,
                    method:"POST",
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
                    name:"enabled",
                    label:t("form.enabled"),
                    type:"boolean",
                    typeForm:"check",
                    description:t("f.enable",{o:t("_supplier.base")})
                }
            ]}
            />

        </DrawerLayout>
    )
}

interface CreateSupplierStore {
    open:boolean
    onOpenChange:(e:boolean)=>void
    openDialog:(opts:{})=>void
}
export const useCreateSupplier = create<CreateSupplierStore>((set)=>({
    open:false,
    onOpenChange:(e)=>set((state)=>({open:e})),
    openDialog:(opts)=>set((state)=>({open:true}))
}))