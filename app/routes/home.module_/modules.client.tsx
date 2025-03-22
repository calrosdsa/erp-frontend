import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { DataTable } from "@/components/custom/table/CustomTable";
import { moduleColumns } from "@/components/custom/table/columns/core/module-columns";
import { route } from "~/util/route";
import { party } from "~/util/party";

export default function ModulesClient() {
  const { results, actions } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const navigate = useNavigate()
  setUpToolbar(() => {
    return {
      titleToolbar:"Modulos",
      ...(permission.create && {
        addNew:()=>{
          navigate(
            route.toRoute({
              main:party.module,
              routeSufix:["new"]
            })
          )
        }
      })
    }
  },[permission]);
  return (
  <div>
    <DataTable
    enableSizeSelection={true}
    data={results || []}
    columns={moduleColumns({})}
    />
  </div>
  )
}
