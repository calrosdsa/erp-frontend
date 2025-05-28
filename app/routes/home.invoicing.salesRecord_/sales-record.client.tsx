import {
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { salesRecordColumn } from "@/components/custom/table/columns/invoicing/sales-records.columns";
import { useExporter } from "~/util/hooks/ui/useExporter";
import DataLayout from "@/components/layout/data-layout";
import { useTranslation } from "react-i18next";
import { InvoiceSearch } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import { CustomerSearch } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";

export default function SalesRecordClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate();
  const r = route;
  const { exportExcel } = useExporter();
  const { t } = useTranslation("common");


  return (
    <>
      <ListLayout
        title={t(party.salesRecord)}
        actions={[
          {
            label: "Export Data",
            onClick: () => {
              exportExcel("/sales-record/export");
            },
          },
        ]}
        {...(permission?.create && {
          onCreate: () => {
            navigate(
              r.toRoute({
                main: r.salesRecord,
                routePrefix: [r.invoicing],
                routeSufix: ["new"],
              })
            );
          },
        })}
      >
        {/* {JSON.stringify(paginationResult?.results)} */}
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
                <CustomerSearch placeholder={t("customer")} />
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
      </ListLayout>
    </>
  );
}
