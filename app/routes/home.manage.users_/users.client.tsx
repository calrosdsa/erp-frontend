import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { profileColumms } from "@/components/custom/table/columns/manage/profile-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { useCreateUser } from "./components/create-user";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";

export default function UsersClient() {
  const { result, actions } = useLoaderData<typeof loader>();
  const state = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: state.roleActions,
  });
  const createUser = useCreateUser()
  const {t} = useTranslation("common")

  setUpToolbar(()=>{
    return {
      ...(permission?.create && {
        titleToolbar:t("users"),
        addNew: () => {
          createUser.openDialog({permission:permission})
        },
      }),
    }
  },[permission])
  return (
    <>
      <DataTable
        data={result || []}
        columns={profileColumms({})}
        enableSizeSelection={true}
        hiddenColumns={{
          givenName: false,
          familyName: false,
        }}
      />
    </>
  );
}
