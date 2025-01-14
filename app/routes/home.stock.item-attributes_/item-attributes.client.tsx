import { Button } from "@/components/ui/button"
import { Link, useLoaderData, useNavigate, useOutletContext, useSearchParams, useSubmit } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { itemAttributeColumns } from "@/components/custom/table/columns/stock/item-attribute-columns"
import { PaginationState } from "@tanstack/react-table"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { useState } from "react"
import { route } from "~/util/route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"


export default function ItemAttributesClient(){
    const {t,i18n} = useTranslation("common")
    const globalState= useOutletContext<GlobalState>()
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
      actions:actions,
      roleActions:globalState.roleActions,
    })
    const [searchParams,setSearchParams] = useSearchParams()
    const submit = useSubmit()
    const navigate = useNavigate()
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
        pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
      });

    const r = route 
    return (
        <div>
            <DataTable
            metaActions={{
              meta:{
                ...(permission?.create && {
                  addNew:()=>{
                    navigate(r.createItemAttributeRoute)
                  }
                }) 
              }
            }}
            data={paginationResult?.results || []}
            columns={itemAttributeColumns()}
            paginationOptions={{
                rowCount:paginationResult?.total || 0,
                onPaginationChange:  (e) => {
                  const fD = new FormData();
                  fD.append("page", e.pageIndex.toString());
                  fD.append("size", e.pageSize.toString());
                  submit(fD, {
                    method: "GET",
                    encType: "application/x-www-form-urlencoded",
                  });
                  setPaginationState(e);
                },
                paginationState: paginationState,
              }}
            />
        </div>
    )
}