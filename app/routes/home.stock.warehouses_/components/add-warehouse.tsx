import CustomForm from "@/components/custom/form/CustomForm";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { addWareHouseSchema } from "~/util/data/schemas/stock/warehouse-schema";
import { action } from "../route";
import { useToast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { routes } from "~/util/route";


export const CreateWareHouse = ({open,onOpenChange}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
})=>{
    const {t} = useTranslation("common")
    const fetcher = useFetcher<typeof action>()
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
            schema={addWareHouseSchema}
            fetcher={fetcher}
            formItemsData={[
                {
                    name:"name",
                    type:"string",
                    typeForm:"input",
                    label:t("form.name")
                },
                {
                    name:"enabled",
                    type:"boolean",
                    typeForm:"check",
                    label:t("form.enabled"),
                    description:t("f.enable",{o:t("_warehouse.base")})
                },
                
            ]}
            onSubmit={(values:z.infer<typeof addWareHouseSchema>)=>{
                fetcher.submit({
                    action:"add-warehouse",
                    addWareHouse:values
                },{
                    method:"POST",
                    action:r.warehouses,
                    encType:"application/json"
                })
            }}
            />
        </DrawerLayout>

    )
}

interface CreateWareHouse {
    open:boolean
    onOpenChange:(e:boolean)=>void
    openDialog:(opts:{})=>void
}
export const useCreateWareHouse = create<CreateWareHouse>((set=>({
    open:false,
    onOpenChange:(e)=>set((state)=>({open:e})),
    openDialog:(opts)=>set((state)=>({open:true}))
})))

// export default function useCreateWareHouse(){
//     const [openDialog,setOpenDialog] = useState(false)
//     const dialog = openDialog && <AddWareHouse
//     open={openDialog}
//     onOpenChange={(e)=>setOpenDialog(e)}
//     />
    // return [dialog,setOpenDialog] as const
// }