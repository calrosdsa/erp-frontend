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
import { InvoiceSearch } from "~/util/hooks/fetchers/docs/useInvoiceDebounceFetcher";
import { useTranslation } from "react-i18next";
import DataLayout from "@/components/layout/data-layout";
import { parties } from "~/util/party";
import { ButtonToolbar } from "~/types/actions";
import { useExporter } from "~/util/hooks/ui/useExporter";
import { CustomerSearch } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { SupplierSearch } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";

export default function PurchaseRecordClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate();
  const r = routes;
  const p = parties;
  const { exportExcel } = useExporter();

  setUpToolbar(() => {
    let actions: ButtonToolbar[] = [];
    actions.push({
      label: "Export Data",
      onClick: () => {
        exportExcel("/purchase-record/export");
      },
    });
    return {
      actions,
      ...(permission?.create && {
        addNew: () => {
          navigate(
            r.toRoute({
              main: r.purchaseRecord,
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
                partyType={p.purchaseInvoice}
                placeholder={t("purchaseInvoice")}
              />
              <SupplierSearch
              placeholder={t("supplier")}
              />
            </div>
          );
        }}
      >
        <DataTable
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          data={paginationResult?.results || []}
          enableSizeSelection={true}
          columns={purchaseRecordColumn({})}
        />
      </DataLayout>
    </>
  );
}
