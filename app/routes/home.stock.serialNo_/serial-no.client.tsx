import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { projectColumns } from "@/components/custom/table/columns/project/project-columns";
import { serialNoColumns } from "@/components/custom/table/columns/stock/serial-no-columns";

export default function SerialNoClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  // const [permission] = usePermission({
  //   actions: actions,
  //   roleActions: globalState.roleActions,
  // });
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
        data={paginationResult?.results || []}
        columns={serialNoColumns({})}
        enableSizeSelection={true}
      />
    </>
  );
}
