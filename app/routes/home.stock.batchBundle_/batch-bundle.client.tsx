import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { projectColumns } from "@/components/custom/table/columns/project/project-columns";
import { batchBundleColumns } from "@/components/custom/table/columns/stock/batch-bundle-columns";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { useTranslation } from "react-i18next";
import { party } from "~/util/party";

export default function BatchBundle() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  return (
    <>
      <ListLayout title={t(party.batchBundle)}>
        <DataTable
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          enableSizeSelection={true}
          data={paginationResult?.results || []}
          columns={batchBundleColumns({})}
        />
      </ListLayout>
    </>
  );
}
