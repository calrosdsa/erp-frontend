import { Button } from "@/components/ui/button";
import {
  Link,
  useFetcher,
  useLoaderData,
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

const ItemsClient = () => {
  const { t } = useTranslation();
  const { data } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
    pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
  });
  return (
    <div>
      <Link to={"./create_item"}>
        <Button>{t("create_item")}</Button>
      </Link>
      <div className="">
        <DataTable
          data={data?.pagination_result.results || []}
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
