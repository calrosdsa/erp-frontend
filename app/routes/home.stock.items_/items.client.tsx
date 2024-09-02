import { Button } from "@/components/ui/button";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemColumns } from "./components/itemColumns";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { routes } from "~/util/route";
import { useActions } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";

const ItemsClient = () => {
  const { t } = useTranslation("common");
  const { data } = useLoaderData<typeof loader>();
  const state = useOutletContext<GlobalState>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [permission] = useActions({
    roleActions: state.role?.RoleActions,
    actions: data?.actions,
  });
  const submit = useSubmit();
  const navigate = useNavigate();
  const r = routes;
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
            meta: {
              ...(permission?.create && {
                addNew: () => {
                  navigate(r.toCreateItem());
                },
              }),
            },
          }}
          columns={itemColumns()}
          paginationOptions={{
            rowCount: data?.pagination_result.total || 0,
            onPaginationChange: (e) => {
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
