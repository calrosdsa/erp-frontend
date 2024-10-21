import { useFetcher } from "@remix-run/react"
import { create } from "zustand"
import { action } from "../route"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout"
import CustomForm from "@/components/custom/form/CustomForm"
import { createCustomerSchema } from "~/util/data/schemas/selling/customer-schema"
import { z } from "zod"
import { loader } from "~/root"
import { routes } from "~/util/route"
import { useGroupDebounceFetcher } from "~/util/hooks/fetchers/useGroupDebounceFetcher"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import { useCreateGroup } from "~/routes/home.groups.$party_/components/create-group"
import { PartyType, partyTypeToJSON } from "~/gen/common"


export const CreateCustomer = ({open,onOpenChange,globalState}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
    globalState:GlobalState
}) =>{
    const fetcher = useFetcher<typeof action>()
    const {toast} = useToast()
    const {t} = useTranslation("common")
    const customerTypeFetcher = useFetcher<typeof action>()
    const [groupDebounceFetcher,onGroupNameChange] = useGroupDebounceFetcher({
        partyType:PartyType.customerGroup
    })
    const [groupPermission] = usePermission({
        actions:groupDebounceFetcher.data?.actions,
        roleActions:globalState.roleActions
    })
    const createGroup = useCreateGroup()
    const r = routes
    const getCustomerTypes = () =>{
        customerTypeFetcher.submit({
            action:"customer-types",
        },{
            encType:"application/json",
            method:"POST",
            action:r.customers
        })
    }
    useEffect(()=>{
        getCustomerTypes()
    },[])
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
        title={t("_customer.create")}
        >
            <CustomForm
            fetcher={fetcher}
            schema={createCustomerSchema}
            onSubmit={(values:z.infer<typeof createCustomerSchema>)=>{
                fetcher.submit({
                    action:"create-customer",
                    createCustomer:values
                },{
                    encType:"application/json",
                    method:"POST",
                    action:r.customers
                })
            }}
            formItemsData={[
                {
                    name:"name",
                    type:"string",
                    typeForm:"input",
                    label:t("form.name"),
                },
                {
                    name:"customerType",
                    type:"string",
                    typeForm:"select",
                    data:customerTypeFetcher.data?.customerTypes || [],
                    keyName:"name",
                    keyValue:"code",
                    label:t("form.type"),
                },
            ]}
            renderCustomInputs={(form)=>{
                return (
                    <>
                    <FormAutocomplete
                    form={form}
                    onValueChange={onGroupNameChange}
                    data={groupDebounceFetcher.data?.groups || []}
                    name="groupName"
                    nameK={"name"}
                    label={t("_group.base")}
                    {...(groupPermission?.create && {
                        addNew:()=>{
                            createGroup.openDialog({
                                partyType:partyTypeToJSON(PartyType.customerGroup)
                            })
                        }
                    })}
                    onSelect={(e)=>{
                        form.setValue("groupUuid",e.uuid)
                    }}
                    />
                    </>
                )
            }}
            />
        </DrawerLayout>
    )
}

interface CreateCustomerStore {
    open:boolean
    openDialog:(opt:{})=>void
    onOpenChange:(e:boolean)=>void
}

export const useCreateCustomer =create<CreateCustomerStore>((set)=>({
    open:false,
    onOpenChange:(e)=>set((state)=>({open:e})),
    openDialog:(opts)=>set((state)=>({open:true})),
}))