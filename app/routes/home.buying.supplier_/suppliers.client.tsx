import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { supplierColumns } from "@/components/custom/table/columns/buying/supplier-columns";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useCreateSupplier } from "./components/create-supplier";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";

export default function SuppliersClient() {
  const globalState = useOutletContext<GlobalState>();
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const createSupplier = useCreateSupplier();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { t } = useTranslation("common");
  return (
    <ListLayout
      title={t(party.supplier)}
      {...(permission.create && {
        onCreate: () => {
          createSupplier.openDialog({});
        },
      })}
    >
      <DataTable
        data={paginationResult?.results || []}
        columns={supplierColumns({})}
        enableSizeSelection={true}
      />
    </ListLayout>
  );
}
