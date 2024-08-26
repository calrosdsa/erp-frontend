import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemGroupColumns } from "./components/table/columns";
import { useState } from "react";
import useCreateGroup from "~/util/hooks/dialog/useCreateGroup";

export default function ItemGroupsClient() {
  const { paginationResult } = useLoaderData<typeof loader>();
  const [itemGroupDialog,openDialog] = useCreateGroup();
  return (
    <>
      {itemGroupDialog}
      <DataTable
        columns={itemGroupColumns()}
        data={paginationResult?.pagination_result.results || []}
        metaActions={{
          meta: {
            addNew: () => {
                openDialog(true)
            },
          },
        }}
      />
    </>
  );
}
