import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { NewCostCenter, useNewCostCenter } from "./use-new-cost-center";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";

export default function CostCenterClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const newCostCenter = useNewCostCenter();
  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
            newCostCenter.onOpenChange(true)
        },
      }),
    };
  }, [permission]);
  return (
    <>
    {newCostCenter.open && 
    <NewCostCenter
    open={newCostCenter.open}
    onOpenChange={newCostCenter.onOpenChange}
    />
    }
      <DataTable
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        data={paginationResult?.results || []}
        columns={costCenterColumns({})}
      />
    </>
  );
}
