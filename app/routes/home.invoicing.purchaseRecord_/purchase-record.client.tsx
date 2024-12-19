import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { chargesTemplateColumns } from "@/components/custom/table/columns/accounting/charges-templates-columns";
import { routes } from "~/util/route";
import { currencyExchangeColumns } from "@/components/custom/table/columns/core/currency-exchange-columns";
import { salesRecordColumn } from "@/components/custom/table/columns/invoicing/sales-records.columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { purchaseRecordColumn } from "@/components/custom/table/columns/invoicing/purchase-record-columns";

export default function PurchaseRecordClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate();
  const r = routes;
  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
          navigate(
            r.toRoute({
              main: r.purchaseRecord,
              routePrefix:[r.invoicing],
              routeSufix: ["new"],
            })
          );
        },
      }),
    };
  }, [permission]);
  return (
    <>
    <div className=" relative w-full">
            <DataTable
              paginationOptions={{
                rowCount: paginationResult?.total,
              }}
              data={paginationResult?.results || []}
              enableSizeSelection={true}
              columns={purchaseRecordColumn({})}
              />
              </div>
    </>
  );
}
