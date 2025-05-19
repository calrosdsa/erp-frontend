import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { roleColumns } from "@/components/custom/table/columns/user/role-columns";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { CreateRole, useCreateRole } from "./components/create-rol";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { useTranslation } from "react-i18next";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";

export default function RolesClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const createRole = useCreateRole();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });

  return (
    <>
      {createRole.open && (
        <CreateRole
          open={createRole.open}
          onOpenChange={createRole.onOpenChange}
        />
      )}
      <ListLayout
        title={"Rol"}
        {...(permission?.create && {
          onCreate: () => {
            createRole.openDialog({});
          },
        })}
      >
        <DataTable
          
          data={paginationResult?.results || []}
          columns={roleColumns({})}
          enableSizeSelection={true}
        />
      </ListLayout>
    </>
  );
}
