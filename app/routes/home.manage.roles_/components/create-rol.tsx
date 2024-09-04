import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { action } from "../route";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CustomForm from "@/components/custom/form/CustomForm";
import { createRoleSchema } from "~/util/data/schemas/manage/role-schema";
import { z } from "zod";
import { routes } from "~/util/route";

export const CreateRole = ({open,onOpenChange}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
}) =>{
    const fetcher = useFetcher<typeof action>()
    const {t} = useTranslation("common")
    const r = routes
    const {toast } = useToast()
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
        title={t("f.add-new",{o:t("_role.base")})}
        >
            <CustomForm
            fetcher={fetcher}
            schema={createRoleSchema}
            onSubmit={(values:z.infer<typeof createRoleSchema>)=>{
                fetcher.submit({
                    action:"create-role",
                    createRole:values
                },{
                    encType:"application/json",
                    method:"POST",
                    action:r.roles
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
                    name:"description",
                    label:t("form.description"),
                    typeForm:"textarea",
                }
            ]}
            />
        </DrawerLayout>
    )
}

interface CreateRoleStore {
    open:boolean
    onOpenChange:(e:boolean)=>void
    openDialog:(opts:{})=>void
}
export const useCreateRole = create<CreateRoleStore>((set)=>({
    open:false,
    onOpenChange:(e)=>set((state)=>({open:e})),
    openDialog:(opts)=>set((state)=>({open:true}))
}))