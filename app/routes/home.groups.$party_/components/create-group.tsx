import CustomForm from "@/components/custom/form/CustomForm"
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout"
import { useFetcher } from "@remix-run/react"
import { create } from "zustand"
import { action } from "../route"
import { useTranslation } from "react-i18next"
import { useToast } from "@/components/ui/use-toast"
import { PartyType } from "~/types/enums"
import { createGroupSchema } from "~/util/data/schemas/group-schema"
import { z } from "zod"
import { routes } from "~/util/route"
import { useEffect } from "react"

export const CreateGroup = ({open,onOpenChange,partyType}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
    partyType?:string
}) =>{
    const fetcher = useFetcher<typeof action>()
    const {t} = useTranslation("common")
    const {toast} = useToast()
    const r = routes

  

    useEffect(()=>{
        if(fetcher.data?.message){
            toast({
                title:fetcher.data.message
            })
            onOpenChange(false)
        }
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error
            })
        }
    },[fetcher.data])
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}
        title={t("f.add-new",{o:t("group")})}
        >
            <CustomForm
            schema={createGroupSchema}
            fetcher={fetcher}
            defaultValues={{
                party_type_code:partyType?.toString(),
                enabled:true,
            } as z.infer<typeof createGroupSchema>}
            onSubmit={(values:z.infer<typeof createGroupSchema>)=>{
                fetcher.submit({
                    action:"create-group",
                    createGroup:values
                },{
                    method:"POST",
                    encType:"application/json",
                    action:r.groups
                })
            }}
            formItemsData={[
                {
                    name:"name",
                    label:t("form.name"),
                    typeForm:"input",
                    type:"string"
                },
                {
                    name:"is_group",
                    label:t("form.isGroup"),
                    description:t("form.isGroupDescription"),
                    typeForm:"check",
                    type:"boolean"
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

interface CreateGroupStore {
    open:boolean
    onOpenChange:(e:boolean)=>void
    openDialog:(opts:{partyType:string})=>void
    partyType:string | undefined
}
export const useCreateGroup = create<CreateGroupStore>((set)=>({
    open:false,
    openDialog:(opts)=>set((state)=>({open:true,partyType:opts.partyType})),
    onOpenChange:(e)=>set((state)=>({open:e})),
    partyType:undefined
}))