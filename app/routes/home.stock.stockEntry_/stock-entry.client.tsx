import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { journalEntryColumns } from "@/components/custom/table/columns/accounting/journal-entry-columns";
import { stockEntryColumns } from "@/components/custom/table/columns/stock/stock-entry-columns";
import { route } from "~/util/route";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { useResetDocument } from "@/components/custom/shared/document/reset-data";
import { ButtonToolbar } from "~/types/actions";
import { stateFromJSON } from "~/gen/common";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";

export default function StockEntryClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const navigate = useNavigate();
  const r = route;
  const { resetItems } = useResetDocument();
  const {t} = useTranslation("common")

  // setUpToolbar(() => {
  //   return {
  //     ...(permission?.create && {
  //       addNew: () => {
  //         resetItems();
  //         navigate(
  //           r.toRoute({
  //             main: r.stockEntry,
  //             routePrefix: [r.stockM],
  //             routeSufix: ["new"],
  //           })
  //         );
  //       },
  //     }),
  //   };
  // }, [permission]);
  return (
    <>
      <ListLayout
        title={t(party.stockEntry)}
        {...(permission?.create && {
          onCreate: () => {
            resetItems();
            navigate(
              r.toRouteDetail( r.stockEntry,"new",)
            );
          },
        })}
      >
        <DataTable
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          data={paginationResult?.results || []}
          columns={stockEntryColumns({})}
          enableSizeSelection={true}
        />
      </ListLayout>
    </>
  );
}
