import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { DataTable } from "@/components/custom/table/CustomTable";
import { moduleColumns } from "@/components/custom/table/columns/core/module-columns";

export default function ModulesClient() {
  const { results, actions } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  setUpToolbar(() => {
    return {

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
