import { DataTable } from "@/components/custom/table/CustomTable";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { quotationColumns } from "@/components/custom/table/columns/document/quotation-columns";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";
import DataLayout from "@/components/layout/data-layout";
import { PartySearch } from "../home.order.$partyOrder.new/components/party-autocomplete";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function QuotationsClient() {
  const { paginationResult, actions, filters } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const params = useParams();
  const quotationParty = params.quotationParty || "";
  const r = route;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { resetDocument } = useResetDocument();

  return (
    <ListLayout
      title={t(quotationParty)}
      {...(permission.create && {
        onCreate: () => {
          resetDocument();
          navigate(
            r.toRoute({
              main: quotationParty,
              routePrefix: [r.quotation],
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
    </ListLayout>
  );
}
