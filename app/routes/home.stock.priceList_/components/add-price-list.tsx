import CustomForm from "@/components/custom/form/CustomForm"
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { CURRENCY_CODES } from "~/constant"
import { createPriceListSchema } from "~/util/data/schemas/stock/price-list-schema"
import { action } from "../route"
import { useFetcher } from "@remix-run/react"
import { create } from "zustand"
import { routes } from "~/util/route"


export const AddPriceList =({open,onOpenChange}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
})=>{
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
            onOpenChange(false)
        }
    },[fetcher.data])
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}
        title={t("priceList")}
        >
            <CustomForm
            onSubmit={(values:z.infer<typeof createPriceListSchema>)=>{
                fetcher.submit({
                    action:"add-price-list",
                    createPriceList:values
                },{
                    method:"POST",
                    action:r.toRoute({
                        main:r.priceList,
                        routePrefix:[r.stockM]
                    }),
                    encType:"application/json"
                })
            }}
            defaultValues={{
                isBuying:false,
                isSelling:false
            } as z.infer<typeof createPriceListSchema>}
            schema={createPriceListSchema}
            fetcher={fetcher}
            formItemsData={[
                {
                    name:"name",
                    type:"string",
                    typeForm:"input",
                    label:t("form.name")
                },
                {
                    name:"currency",
                    type:"string",
                    typeForm:"select",
                    label:t("form.currency"),
                    data:CURRENCY_CODES,
                    keyName:"Code",
                    keyValue:"Code",
                },
                {
                    name:"isSelling",
                    description:t("_selling.isSellingDesc"),
                    type:"boolean",
                    typeForm:"check",
                    label:t("_selling.isSelling"),
                },
                {
                    name:"isBuying",
                    description:t("_selling.isBuyingDesc"),
                    type:"boolean",
                    typeForm:"check",
                    label:t("_selling.isBuying"),
                }
            ]}
            />

        </DrawerLayout>
    )
}

interface CreatePriceListStore {
    open:boolean
    onOpenChange:(e:boolean)=>void
}

export const useCreatePriceList = create<CreatePriceListStore>((set)=>({
    open:false,
    onOpenChange:(e)=>set((state)=>({open:e}))
}))
    // const [open,setOpen] = useState(false)
    // const dialog = open && <AddPriceList
    // open={open}
    // onOpenChange={(e)=>setOpen(e)}
    // />
    // return [dialog,setOpen] as const;
