import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { projectColumns } from "@/components/custom/table/columns/project/project-columns";
import { batchBundleColumns } from "@/components/custom/table/columns/stock/batch-bundle-columns";

export default function BatchBundle() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  setUpToolbar(() => {
    return {
    };
  }, []);
  return (
    <>

      <DataTable
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        enableSizeSelection={true}
        data={paginationResult?.results || []}
        columns={batchBundleColumns({})}
      />
    </>
  );
}
