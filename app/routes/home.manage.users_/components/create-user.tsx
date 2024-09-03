import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useToast } from "@/components/ui/use-toast";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { Permission } from "~/types/permission";
import { createUserSchema } from "~/util/data/schemas/manage/user-schema";



export const CreateUser = ({open,onOpenChange,permission}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
    permission?:Permission
})=>{
    const {t }=useTranslation("common")
    const {toast} = useToast()
    const fetcher = useFetcher()
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}
        className="md:max-w-5xl"
        title={t("f.add-new",{o:t("_user.base")})}
        >
            <CustomForm
            schema={createUserSchema}
            fetcher={fetcher}
            className="create-grid"
            onSubmit={(values:z.infer<typeof createUserSchema>)=>{
                console.log(values)
            }}
            formItemsData={[
                {
                    name:"givenName",
                    type:"string",
                    typeForm:"input",
                    label:t("form.givenName"),
                },
                {
                    name:"familyName",
                    type:"string",
                    typeForm:"input",
                    label:t("form.familyName"),
                },
                {
                    name:"email",
                    type:"email",
                    typeForm:"input",
                    label:t("form.email")
                },
                {
                    name:"phoneNumber",
                    type:"tel",
                    typeForm:"input",
                    label:t("form.phoneNumber")
                }
            ]}
            />
        </DrawerLayout>
    )
}

interface UserCreateStore{
    open:boolean
    permission:Permission | undefined
    onOpenChange:(e:boolean)=>void
    openDialog:(opts:{permission?:Permission})=>void
}
export const useCreateUser = create<UserCreateStore>((set)=>({
    open:false,
    permission:undefined,
    openDialog:(opts) => set((state)=>({open:true,permission:opts.permission})),
    onOpenChange:(e)=>set((state)=>({open:e}))
}))