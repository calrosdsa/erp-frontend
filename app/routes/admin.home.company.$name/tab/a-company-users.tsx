import { useFetcher, useLoaderData } from "@remix-run/react"
import { action, loader } from "../route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { aCompanyUserColumns } from "@/components/custom/table/columns/admin/a-company-columns"
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout"
import { z } from "zod"
import CustomForm from "@/components/custom/form/CustomForm"
import { useTranslation } from "react-i18next"
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export const addCompanyUserSchema = z.object({
    givenName:z.string(),
    familyName:z.string().optional(),
    email:z.string().email(),
    companyID:z.number(),
})

export default function ACompanyUsers(){
    const {company,companyUsers} = useLoaderData<typeof loader>()
    const [addCompanyUser,setAddCompanyUser] = useState(false)
    
    return (
        <div>
            <Button onClick={()=>{
                setAddCompanyUser(true)
            }}>
                Add
            </Button>
            {(addCompanyUser && company?.id) && 
            <AddCompanyUser
            open={addCompanyUser}
            onOpenChange={(e)=>setAddCompanyUser(e)}
            companyID={company.id}
            />
            }
            <DataTable
            data={companyUsers || []}
            columns={aCompanyUserColumns()}
            />
        </div>
    )
}

const AddCompanyUser = ({open,onOpenChange,companyID}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
    companyID:number
}) =>{
    const fetcher = useFetcher<typeof action>()
    const {t} = useTranslation("common")
    useDisplayMessage({
        error:fetcher.data?.error,
        success:fetcher.data?.message,
        onShowMessage:()=>{
            onOpenChange(false)
        }
    },[fetcher.data])
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}
        >
            <CustomForm
            onSubmit={(e:z.infer<typeof addCompanyUserSchema>)=>{{
                fetcher.submit({
                    action:"add-user",
                    addUser:e,
                },{
                    method:"POST",
                    encType:"application/json"
                })
            }}}
            defaultValues={{
                companyID:companyID
            }}
            formItemsData={[
                {
                    name:"givenName",
                    required:true,
                    label:t("form.givenName"),
                    typeForm:"input"
                },
                {
                    name:"familyName",
                    label:t("form.familyName"),
                    typeForm:"input"
                },
                {
                    name:"email",
                    required:true,
                    label:t("form.email"),
                    type:"email",
                    typeForm:"input"
                },
            ]}
            schema={addCompanyUserSchema}
            fetcher={fetcher}
            />
        </DrawerLayout>
    )
}
// interface AddCompanyUserStore {

// }
// export const useAddCompanyUser = create<AddCompanyUserStore>((set)=>({

// }))