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
import { GlobalState } from "~/types/app-types";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";
import DataLayout from "@/components/layout/data-layout";
import { PartySearch } from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useTranslation } from "react-i18next";
import { ListLayout } from "@/components/ui/custom/list-layout";
export default function OrdersClient() {
  const { paginationResult, actions, filters } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const r = route;
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { resetDocument } = useResetDocument();


  return (
    <ListLayout
    title={t(partyOrder)}
    {...(permission?.create && {
      onCreate: () => {
        resetDocument();
        navigate(
          r.toRoute({
            main: partyOrder,
            routePrefix: ["order"],
            routeSufix: ["new"],
          })
        );
      },
    })}
    >
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
    </ListLayout>
  );
}
