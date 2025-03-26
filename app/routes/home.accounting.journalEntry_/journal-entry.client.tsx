import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { journalEntryColumns } from "@/components/custom/table/columns/accounting/journal-entry-columns";
import { route } from "~/util/route";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";

export default function JournalEntryClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const r = route;
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  return (
    <>
      <ListLayout
        title={t(party.journalEntry)}
        {...(permission.create && {
          onCreate: () => {
            navigate(
              r.toRoute({
                main: r.journalEntry,
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
          columns={journalEntryColumns({})}
          enableSizeSelection={true}
        />
      </ListLayout>
    </>
  );
}
