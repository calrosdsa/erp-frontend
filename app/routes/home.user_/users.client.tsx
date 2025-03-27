import { useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { profileColumms } from "@/components/custom/table/columns/manage/profile-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { useCreateUser } from "./components/create-user";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";

export default function UsersClient() {
  const { result, actions } = useLoaderData<typeof loader>();
  const state = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: state.roleActions,
  });
  const [searchParams,setSearchParams] = useSearchParams()
  const createUser = useCreateUser();
  const { t } = useTranslation("common");

  const openModal =(key:string,value:string)=>{
    searchParams.set(key,value)
    setSearchParams(searchParams,{
      preventScrollReset:true
    })
  }
  
  return (
    <>
      <ListLayout
      title={"Usuarios"}
      {...(permission?.create && {
        onCreate: () => {
          createUser.openDialog({ permission: permission });
        },
      })}
      >
        <DataTable
          data={result || []}
          columns={profileColumms({
            openModal
          })}
          enableSizeSelection={true}
          hiddenColumns={{
            givenName: false,
            familyName: false,
          }}
        />
      </ListLayout>
    </>
  );
}
