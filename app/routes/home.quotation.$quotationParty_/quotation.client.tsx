import { DataTable } from "@/components/custom/table/CustomTable";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { receiptColumns } from "@/components/custom/table/columns/receipt/receipt-columns";
import { routes } from "~/util/route";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { quotationColumns } from "@/components/custom/table/columns/document/quotation-columns";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";
import DataLayout from "@/components/layout/data-layout";
import { PartySearch } from "../home.order.$partyOrder.new/components/party-autocomplete";

export default function QuotationsClient() {
  const { paginationResult, actions, filters } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const params = useParams();
  const quotationParty = params.quotationParty || "";
  const r = routes;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { resetDocument } = useResetDocument();

  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
          resetDocument();
          navigate(
            r.toRoute({
              main: quotationParty,
              routePrefix: [r.quotation],
              routeSufix: ["new"],
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
      fixedFilters={() => {
        return (
          <>
            <PartySearch party={quotationParty} />
          </>
        );
      }}
    >
      <DataTable
        data={paginationResult?.results || []}
        columns={quotationColumns({
          quotationType: quotationParty,
        })}
      />
    </DataLayout>
  );
}
