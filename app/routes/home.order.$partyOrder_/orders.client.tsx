import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { orderColumns } from "@/components/custom/table/columns/order/order-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { routes } from "~/util/route";
import ProgressBarWithTooltip from "@/components/custom-ui/progress-bar-with-tooltip";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { partyTypeFromJSON } from "~/gen/common";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";
import DataLayout from "@/components/layout/data-layout";
import { PartySearch } from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useTranslation } from "react-i18next";
import { AutoComplete } from "@/components/custom/select/Autocomplete";
import { useCustomerDebounceFetcher } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";

export default function OrdersClient() {
  const { paginationResult, actions, filters } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const r = routes;
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { resetDocument } = useResetDocument();

  setUpToolbar(() => {
    return {
      titleToolbar: undefined,
      ...(permission?.create && {
        addNew: () => {
          resetDocument();
          navigate(
            r.toRoute({
              main: partyOrder,
              routePrefix: ["order"],
              routeSufix: ["new"],
            })
          );
        },
      }),
    };
  }, [permission]);

  const mockItems = [
    { value: "1", label: "Item 1" },
    { value: "2", label: "Item 2" },
  ];

  const [customerFetcher,onCustomerChange] = useCustomerDebounceFetcher() 
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
            <PartySearch party={partyOrder} />
          </>
        );
      }}
    >
      <AutoComplete
      items={customerFetcher.data?.customers.map(t=>{
        return {
          value:t,
          label:t.name,
        }
      }) || []}
      selectedValue={undefined}
      onSelectedValueChange={()=>{}}
      onSearchValueChange={onCustomerChange}
      searchValue=""
      />
      <DataTable
        data={paginationResult?.results || []}
        columns={orderColumns({
          orderPartyType: partyOrder,
        })}
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        enableSizeSelection={true}
      />
    </DataLayout>
  );
}
