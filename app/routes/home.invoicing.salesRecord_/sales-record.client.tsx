import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
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
import { ButtonToolbar } from "~/types/actions";
import { useExporter } from "~/util/hooks/ui/useExporter";
import DataLayout from "@/components/layout/data-layout";
import { useTranslation } from "react-i18next";
import { InvoiceSearch } from "~/util/hooks/fetchers/docs/useInvoiceDebounceFetcher";

export default function SalesRecordClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate();
  const r = routes;
  const { exportD } = useExporter();
  const { t } = useTranslation("common");

  setUpToolbar(() => {
    let actions: ButtonToolbar[] = [];
    actions.push({
      label: "Export Data",
      onClick: () => {
        exportD("/sales-record/export");
      },
    });
    return {
      actions,
      ...(permission?.create && {
        addNew: () => {
          navigate(
            r.toRoute({
              main: r.salesRecord,
              routePrefix: [r.invoicing],
              routeSufix: ["new"],
            })
          );
        },
      }),
    };
  }, [permission]);
  return (
    <>
      <DataLayout
        filterOptions={paginationResult?.filters}
        orderOptions={[
          { name: "Fecha de Creación", value: "created_at" },
          { name: "Fecha de Facture", value: "invoice_date" },
          { name: t("form.status"), value: "status" },
        ]}
        fixedFilters={() => {
          return (
            <div className="grid gap-2 sm:flex sm:space-x-2 sm:overflow-auto  ">
              <InvoiceSearch
              partyType={r.saleInvoice}
              placeholder={t("saleInvoice")}
              />
            </div>
          );
        }}
      >
        <DataTable
         enableSizeSelection={true}
          data={paginationResult?.results || []}
          columns={salesRecordColumn({})}
        />
      </DataLayout>
    </>
  );
}
