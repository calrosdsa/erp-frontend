import CustomForm from "@/components/custom/form/CustomForm";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createWarehouseSchema } from "~/util/data/schemas/stock/warehouse-schema";
import { action } from "../route";
import { useToast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { route } from "~/util/route";
import { WarehouseAutocompleteForm } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { components } from "~/sdk";


export const CreateWareHouse = ({open,onOpenChange,roleActions}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
    roleActions:components["schemas"]["RoleActionDto"][]
})=>{
    const {t} = useTranslation("common")
    const fetcher = useFetcher<typeof action>()
    const {toast} = useToast()
    const r = route
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
    return (
        <DrawerLayout
        open={open}
        title={t("f.add-new",{o:t("_warehouse.base")})}
        onOpenChange={onOpenChange}
        >
            <CustomForm
            schema={createWarehouseSchema}
            fetcher={fetcher}
            defaultValues={{
                isGroup:false
            } as z.infer<typeof createWarehouseSchema>}
            formItemsData={[
                {
                    name:"name",
                    type:"string",
                    typeForm:"input",
                    label:t("form.name")
                },
                {
                    name:"isGroup",
                    type:"boolean",
                    typeForm:"check",
                    label:t("form.isGroup")
                },
            ]}
            onSubmit={(values:z.infer<typeof createWarehouseSchema>)=>{
                fetcher.submit({
                    action:"add-warehouse",
                    addWareHouse:values
                },{
                    method:"POST",
                    action:r.warehouses,
                    encType:"application/json"
                })
            }}
            renderCustomInputs={(form)=>{
                return (
                    <WarehouseAutocompleteForm
                    label="Almacén Principal"
                    control={form.control}
                    name="parentName"
                    isGroup={true}
                    roleActions={roleActions}
                    onSelect={(e)=>{
                      form.setValue("parentID",e.id)
                    }}
                    />      
                )
            }}
            />
        </DrawerLayout>

    )
}

interface Payload {
}

interface CreateWareHouse {
    payload?:Payload
    open:boolean
    onOpenChange:(e:boolean)=>void
    openDialog:(opts:Payload)=>void
}
export const useCreateWareHouse = create<CreateWareHouse>((set=>({
    open:false,
    onOpenChange:(e)=>set((state)=>({open:e})),
    openDialog:(opts)=>set((state)=>({
        open:true,
        payload:opts
    }))
})))

// export default function useCreateWareHouse(){
//     const [openDialog,setOpenDialog] = useState(false)
//     const dialog = openDialog && <AddWareHouse
//     open={openDialog}
//     onOpenChange={(e)=>setOpenDialog(e)}
//     />
    // return [dialog,setOpenDialog] as const
// }