import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemGroupColumns } from "./components/table/columns";
import { useState } from "react";
import { useCreateItemGroup } from "./components/add-item-group";

export default function ItemGroupsClient() {
  const { paginationResult } = useLoaderData<typeof loader>();
  const createItemGroup = useCreateItemGroup()
  return (
    <>
      <DataTable
        columns={itemGroupColumns()}
        data={paginationResult?.pagination_result.results || []}
        metaActions={{
          meta: {
            addNew: () => {
                createItemGroup.onOpenChage(true)
            },
          },
        }}
      />
    </>
  );
}
