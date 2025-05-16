import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { workspaceColumns } from "@/components/custom/table/columns/core/workspace-columns";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { route } from "~/util/route";
import { DEFAULT_ID } from "~/constant";

export default function WorkSpaceClient() {
  const { results, actions } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const openModal = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };
  return (
    <>
      <ListLayout
      title="WorkSpace"
      {...(permission.create && {
        onCreate:()=>{
            openModal(route.workspace,DEFAULT_ID)
        }
      })}
      >
        <DataTable
          enableSizeSelection={true}
          data={results || []}
          columns={workspaceColumns({
            openModal: openModal,
          })}
        />
      </ListLayout>
    </>
  );
}
