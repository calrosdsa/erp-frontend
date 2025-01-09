import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { journalEntryColumns } from "@/components/custom/table/columns/accounting/journal-entry-columns";
import { stockEntryColumns } from "@/components/custom/table/columns/stock/stock-entry-columns";
import { routes } from "~/util/route";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";
import { ButtonToolbar } from "~/types/actions";
import { stateFromJSON } from "~/gen/common";

export default function StockEntryClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate()
  const r = routes
  const { resetItems } = useResetDocument()
  
  setUpToolbar(() => {
    
    return {
      ...(permission?.create && {
        addNew: () => {
          resetItems()
          navigate(r.toRoute({
            main:r.stockEntry,
            routePrefix:[r.stockM],
            routeSufix:["new"]
          }))
        },
      }),
    };
  }, [permission]);
  return (
    <>
      <DataTable
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        data={paginationResult?.results || []}
        columns={stockEntryColumns({})}
        enableSizeSelection={true}
      />
    </>
  );
}
