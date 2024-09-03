import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { profileColumms } from "@/components/custom/table/columns/manage/profile-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCreateUser } from "./components/create-user";

export default function UsersClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const state = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: state.role?.RoleActions,
  });
  const createUser = useCreateUser()
  return (
    <>
      <DataTable
        metaActions={{
          meta: {
            ...(permission?.create && {
              addNew: () => {
                createUser.openDialog({permission:permission})
              },
            }),
          },
        }}
        data={paginationResult?.results || []}
        columns={profileColumms({})}
        hiddenColumns={{
          givenName: false,
          familyName: false,
        }}
      />
    </>
  );
}
