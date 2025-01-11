import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";

export default function ModulesClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
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

  </div>
  )
}
