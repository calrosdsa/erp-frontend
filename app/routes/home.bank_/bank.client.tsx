import { DataTable } from "@/components/custom/table/CustomTable";
import DataLayout from "@/components/layout/data-layout";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { GlobalState } from "~/types/app-types";
import { loader } from "./route";
import { termsAndConditionsColumns } from "@/components/custom/table/columns/document/terms-and-conditions-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import { BankColumns } from "@/components/custom/table/columns/accounting/bank.columns";


export default function BankClient (){
    const {roleActions} = useOutletContext<GlobalState>()
    const {results,actions,filters} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
        roleActions,actions
    })
    const {t} = useTranslation("common")
    const navigate = useNavigate()
    setUpToolbar(()=>{
        return {
            titleToolbar:t("bank"),
            ...(permission.create && {
                addNew:()=>{
                    navigate(route.toRoute({
                        main:route.bank,
                        routeSufix:["new"]
                    }))
                }
            })
        }
    },[permission])
    return (
        <DataLayout
        filterOptions={filters}>
            <DataTable
            data={results || []}
            columns={BankColumns()}
            enableSizeSelection={true}
            />
        </DataLayout>
    )
}