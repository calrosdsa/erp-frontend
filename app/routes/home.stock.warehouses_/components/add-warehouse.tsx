import CustomForm from "@/components/custom/form/CustomForm";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { t } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createWareHouseSchema } from "~/util/data/schemas/stock/warehouse-schema";


function AddWareHouse({open,onOpenChange}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
}){
    const {t} = useTranslation("common")
    const fetcher = useFetcher()
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}
        >
            <CustomForm
            schema={createWareHouseSchema}
            fetcher={fetcher}
            formItemsData={[
                {
                    name:"name",
                    type:"string",
                    typeForm:"input",
                    label:t("form.name")
                }
            ]}
            onSubmit={(values:z.infer<typeof createWareHouseSchema>)=>{
                console.log(values)
            }}
            />
        </DrawerLayout>

    )
}

export default function useCreateWareHouse(){
    const [openDialog,setOpenDialog] = useState(false)
    const dialog = openDialog && <AddWareHouse
    open={openDialog}
    onOpenChange={(e)=>setOpenDialog(e)}
    />
    return [dialog,setOpenDialog] as const
}