import { Button } from "@/components/ui/button";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRevalidator,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemColumns } from "./components/itemColumns";
import {
  getCoreRowModel,
  PaginationState,
  TableOptions,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { routes } from "~/util/route";

const ItemsClient = () => {
  const { t } = useTranslation("common");
  const { data } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const navigate = useNavigate()
  const r = routes
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
    pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
  });
  return (
    <div>

      <div className="">
        <DataTable
          data={data?.pagination_result.results || []}
          metaActions={{
            meta:{
              addNew:()=>{
                navigate(r.toCreateItem())
              }
            }
          }}
          columns={itemColumns()}
          paginationOptions={{
            rowCount:data?.pagination_result.total || 0,
            onPaginationChange:  (e) => {
              const fD = new FormData();
              fD.append("page", e.pageIndex.toString());
              fD.append("size", e.pageSize.toString());
              submit(fD, {
                method: "GET",
                encType: "application/x-www-form-urlencoded",
                unstable_flushSync: true,
                preventScrollReset: true,
              });
              setPaginationState(e);
            },
            paginationState: paginationState,
          }}
        />
      </div>
    </div>
  );
};

export default ItemsClient;
