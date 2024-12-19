import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { journalEntryColumns } from "@/components/custom/table/columns/accounting/journal-entry-columns";
import { routes } from "~/util/route";

export default function JournalEntryClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const r =routes
  const navigate = useNavigate()
  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
          navigate(r.toRoute({
            main:r.journalEntry,
            routePrefix:[r.accountingM],
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
        columns={journalEntryColumns({})}
        enableSizeSelection={true}
      />
    </>
  );
}
