import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { DataTable } from "@/components/custom/table/CustomTable";
import { invoiceColumns } from "@/components/custom/table/columns/invoice/invoice-columns";
import { routes } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";
import DataLayout from "@/components/layout/data-layout";
import { State, stateToJSON } from "~/gen/common";
import { PartySearch } from "../home.order.$partyOrder.new/components/party-autocomplete";

export default function InvoicesClient() {
  const { results, actions, filters } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const params = useParams();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const partyInvoice = params.partyInvoice || "";
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const r = routes;
  const { resetDocument } = useResetDocument();

  setUpToolbar(() => {
    return {
      titleToolbar: t(partyInvoice),
      ...(permission?.create && {
        addNew: () => {
          resetDocument();
          navigate(
            r.toRoute({
              routePrefix: ["invoice"],
              main: partyInvoice,
              routeSufix: [`new`],
            })
          );
        },
      }),
    };
  }, [permission]);
  return (
    <DataLayout
    filterOptions={filters}
      orderOptions={[
        { name: "Fecha de Creación", value: "created_at" },
        { name: t("form.status"), value: "status" },
      ]}
      fixedFilters={()=>{
        return (
          <>
          <PartySearch
          party={partyInvoice}
          />
          </>
        )
      }}
    >
      {/* {JSON.stringify(filters)} */}
      <DataTable
        data={results || []}
        columns={invoiceColumns({
          partyType: params.partyInvoice || "",
        })}
        enableSizeSelection={true}
        // paginationOptions={{
        //   rowCount: paginationResult?.total,
        // }}
        // enableRowSelection={true}
      />
    </DataLayout>
  );
}
