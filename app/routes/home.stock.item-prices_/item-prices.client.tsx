import { useLoaderData, useSearchParams, useSubmit } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemPriceColumns } from "@/components/custom/table/columns/stock/itemPriceColumns";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { useAddItemPrice } from "./components/add-item-price";

export default function ItemPricesClient() {
  const { paginationResult,actions } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const addItemPrice = useAddItemPrice();
  const submit = useSubmit();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
    pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
  });

  return (
    <div>
      {/* {JSON.stringify(data)} */}

      <DataTable
        metaActions={{
          meta: {
            addNew: () => {
              addItemPrice.onOpenDialog({});
            },
          },
        }}
        data={paginationResult?.results || []}
        columns={itemPriceColumns({ includeItem: true })}
        paginationOptions={{
          paginationState: paginationState,
          rowCount: paginationResult?.total || 0,
          onPaginationChange: (e) => {
            const fD = new FormData();
            fD.append("page", e.pageIndex.toString());
            fD.append("size", e.pageSize.toString());
            submit(fD, {
              method: "GET",
              encType: "application/x-www-form-urlencoded",
            });
            setPaginationState(e);
          },
        }}
        hiddenColumns={{
          Currency: false,
          Rate: true,
        }}
      />
    </div>
  );
}
