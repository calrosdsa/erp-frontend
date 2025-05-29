import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { chargesTemplateColumns } from "@/components/custom/table/columns/accounting/charges-templates-columns";
import { route } from "~/util/route";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";

export default function ChargesTemplateClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate();
  const r = route;
  const { t } = useTranslation("common");
  const { reset } = useTaxAndCharges();
  return (
    <>
      <ListLayout
        title={t(party.chargesTemplate)}
        {...(permission?.create && {
          onCreate: () => {
            reset();
            navigate(
              r.toRoute({
                main: r.chargesTemplate,
                routePrefix: [r.accountingM],
                routeSufix: ["new"],
              })
            );
          },
        })}
      >
        <DataTable
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          data={paginationResult?.results || []}
          columns={chargesTemplateColumns({})}
        />
      </ListLayout>
    </>
  );
}
