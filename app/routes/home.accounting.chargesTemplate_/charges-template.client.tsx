import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { chargesTemplateColumns } from "@/components/custom/table/columns/accounting/charges-templates-columns";
import { routes } from "~/util/route";

export default function ChargesTemplateClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate()
  const r = routes
  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
          navigate(r.toRoute({
            main:r.chargesTemplate,
            routePrefix:[r.accountingM],
            routeSufix:["new"],
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
        columns={chargesTemplateColumns({})}
      />
    </>
  );
}
