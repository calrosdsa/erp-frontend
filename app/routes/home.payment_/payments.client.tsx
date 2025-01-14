import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData, useNavigate, useOutletContext, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { paymentColumns } from "@/components/custom/table/columns/accounting/payment-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import DataLayout from "@/components/layout/data-layout";
import { useTranslation } from "react-i18next";
import { party } from "~/util/party";
import { PartySearch, PartyTypeSearch } from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export default function PaymentsClient() {
  const { paginationResult, actions,filters } = useLoaderData<typeof loader>();
  const r = route;
  const navigate = useNavigate();
  const globalState = useOutletContext<GlobalState>();
  const [searchParams] = useSearchParams()
  const {t}= useTranslation("common")
  const p = party
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.payment),
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
        {name:t("table.createdAt"),value:"created_at"},
        {name:t("form.status"),value:"status"},
    ]}
    fixedFilters={()=>{
      return (
        <>
        <PartyTypeSearch/>
        <PartySearch
        partyType={searchParams.get("party_type") || ""}
        />

        </>
      )
    }}
    >
      <DataTable
        columns={paymentColumns()}
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        enableSizeSelection={true}
        data={paginationResult?.results || []}
      />
    </DataLayout>
  );
}
