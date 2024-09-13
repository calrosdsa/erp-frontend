import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useToast } from "@/components/ui/use-toast";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { Permission } from "~/types/permission";
import { createUserSchema } from "~/util/data/schemas/manage/user-schema";
import { action } from "../route";
import { useEffect } from "react";
import { routes } from "~/util/route";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { components } from "~/sdk";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { DEFAULT_DEBOUNCE_TIME, MAX_DEFAULT_SIZE } from "~/constant";
import { useRoleDebounceFetcher } from "~/util/hooks/fetchers/userRoleDebounceFetcher";
import { GlobalState } from "~/types/app";



export const CreateUser = ({open,onOpenChange,permission,globalState}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
    permission?:Permission
    globalState:GlobalState
})=>{
    const {t }=useTranslation("common")
    const {toast} = useToast()
    const r = routes
    const fetcher = useFetcher<typeof action>()
    const [ rolesFetcherDebounce,onRoleNameChange] = useRoleDebounceFetcher()
    const fetcherPartyTypesUser = useFetcher<typeof action>({key:"party-types"})
    const companiesFetcher = useFetcher<{
        companies:components["schemas"]["Company"][]
    }>({key:"companies"})
    const getUserPartyTypes = async() =>{
        fetcherPartyTypesUser.submit({
            action:"party-types"
        },{
            method:"POST",
            encType:"application/json",
            action:r.users
        })
    }
    const getCompanies = async() =>{
        companiesFetcher.submit({
            action:"user-companies",
            size:MAX_DEFAULT_SIZE,
        },{
            method:"POST",
            encType:"application/json",
            action:r.companies
        })
    }

    useEffect(()=>{
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error
            })
        }
        if(fetcher.data?.message){
            toast({
                title:fetcher.data.message,
            })
            onOpenChange(false)
        }
    },[fetcher.data])

    useEffect(()=>{
        getUserPartyTypes()
        getCompanies()
    },[])
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
                console.log("VALUES",values)
                fetcher.submit({
                    createUser:values,
                    action:"create-user",
                },{
                    method:'POST',
                    encType:"application/json",
                    action:r.users,
                })
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
                },
                {
                    name:"partyCode",
                    type:"string",
                    typeForm:"select",
                    label:t("form.type"),
                    data:fetcherPartyTypesUser.data?.partyTypes || [],
                    keyName:"name",
                    keyValue:"code"
                },
                {
                    name:"companyIds",
                    typeForm:"multiselect",
                    label:t("companies"),
                    data:companiesFetcher.data?.companies || [],
                    keyName:"name",
                    keyValue:"id",
                }
            ]}
            renderCustomInputs={(form)=>{
                return (
                    <>
                    <FormAutocomplete
                    form={form}
                    label={t("roles")}
                    data={rolesFetcherDebounce.data?.roles || []}
                    onOpen={()=>onRoleNameChange("")}
                    onValueChange={(e)=>onRoleNameChange(e)}
                    name="roleName"
                    nameK={"code"}
                    onSelect={(v)=>{
                        form.setValue("roleUuid", v.uuid);
                    }}
                    />
                    </>
                )
            }}
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