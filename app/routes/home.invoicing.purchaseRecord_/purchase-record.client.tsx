import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { chargesTemplateColumns } from "@/components/custom/table/columns/accounting/charges-templates-columns";
import { route } from "~/util/route";
import { currencyExchangeColumns } from "@/components/custom/table/columns/core/currency-exchange-columns";
import { salesRecordColumn } from "@/components/custom/table/columns/invoicing/sales-records.columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { purchaseRecordColumn } from "@/components/custom/table/columns/invoicing/purchase-record-columns";
import { InvoiceSearch } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import { useTranslation } from "react-i18next";
import DataLayout from "@/components/layout/data-layout";
import { party } from "~/util/party";
import { ButtonToolbar } from "~/types/actions";
import { useExporter } from "~/util/hooks/ui/useExporter";
import { CustomerSearch } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { SupplierSearch } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function PurchaseRecordClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate();
  const r = route;
  const p = party;
  const { exportExcel } = useExporter();

  return (
    <>
      <ListLayout
        title={t(party.purchaseRecord)}
        actions={[
          {
            label: "Exportar Registros de Compra",
            onClick: () => {
              exportExcel("/purchase-record/export");
            },
          },
        ]}
        {...(permission?.create && {
          onCreate: () => {
            navigate(
              r.toRoute({
                main: r.purchaseRecord,
                routePrefix: [r.invoicing],
                routeSufix: ["new"],
              })
            );
          },
        })}
      >
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
                <SupplierSearch placeholder={t("supplier")} />
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
      </ListLayout>
    </>
  );
}
