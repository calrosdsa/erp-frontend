import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { NewCostCenter, useNewCostCenter } from "./use-new-cost-center";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function CostCenterClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const newCostCenter = useNewCostCenter();

  return (
    <>
      {newCostCenter.open && (
        <NewCostCenter
          open={newCostCenter.open}
          onOpenChange={newCostCenter.onOpenChange}
        />
      )}
      <ListLayout
        title="Centro de Costo"
        {...(permission.create && {
          onCreate: () => {
            newCostCenter.onOpenChange(true);
          },
        })}
      >
        <DataTable
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          data={paginationResult?.results || []}
          columns={costCenterColumns({})}
          enableSizeSelection={true}
        />
      </ListLayout>
    </>
  );
}
