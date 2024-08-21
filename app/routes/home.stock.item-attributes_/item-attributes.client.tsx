import { Button } from "@/components/ui/button"
import { Link, useLoaderData, useSearchParams, useSubmit } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { itemAttributeColumns } from "@/components/custom/table/columns/stock/item-attribute-columns"
import { PaginationState } from "@tanstack/react-table"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { useState } from "react"
import { routes } from "~/util/route"


export default function ItemAttributesClient(){
    const {t,i18n} = useTranslation("common")
    const {pagination_result} = useLoaderData<typeof loader>()
    const [searchParams,setSearchParams] = useSearchParams()
    const submit = useSubmit()
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
        pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
      });
    const r = routes 
    return (
        <div>
            <Link to={r.createItemAttributeRoute}>
            <Button>
                {t("_stock.createItemAttribute")}            
            </Button>
            </Link>
            <DataTable
            data={pagination_result?.results || []}
            columns={itemAttributeColumns()}
            paginationOptions={{
                rowCount:pagination_result?.total || 0,
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