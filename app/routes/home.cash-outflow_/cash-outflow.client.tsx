import { DataTable } from "@/components/custom/table/CustomTable";
import DataLayout from "@/components/layout/data-layout";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { GlobalState } from "~/types/app";
import { loader } from "./route";
import { termsAndConditionsColumns } from "@/components/custom/table/columns/document/terms-and-conditions-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import { BankColumns } from "@/components/custom/table/columns/accounting/bank.columns";
import { CashOutflowColumns } from "@/components/custom/table/columns/accounting/cash-outflow.columns";
import { ButtonToolbar } from "~/types/actions";


export default function CashOutflowClient (){
    const {roleActions} = useOutletContext<GlobalState>()
    const {results,actions,filters} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
        roleActions,actions
    })
    const {t} = useTranslation("common")
    const navigate = useNavigate()
    setUpToolbar(()=>{
        
        return {
            titleToolbar:t("cashOutflow"),
            ...(permission.create && {
                addNew:()=>{
                    navigate(route.toRoute({
                        main:route.cashOutflow,
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
            columns={CashOutflowColumns()}
            enableSizeSelection={true}
            />
        </DataLayout>
    )
}