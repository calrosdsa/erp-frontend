import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { paymentColumns } from "@/components/custom/table/columns/accounting/payment-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { routes } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import PaginationLayout from "@/components/layout/pagination-layout";
import { useTranslation } from "react-i18next";

export default function PaymentsClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const r = routes;
  const navigate = useNavigate();
  const globalState = useOutletContext<GlobalState>();
  const {t}= useTranslation("common")
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
              routePrefix: [r.accountingM],
              routeSufix: ["new"],
            })
          );
        },
      }),
    };
  }, [permission]);
  return (
    <PaginationLayout 
    orderOptions={[
        {name:t("table.createdAt"),value:"created_at"},
        {name:t("form.status"),value:"status"},
    ]}
    filterOptions={()=>{
        return (
        <></>
    )
    }}
    >
      <DataTable
        columns={paymentColumns()}
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        data={paginationResult?.results || []}
      />
    </PaginationLayout>
  );
}
