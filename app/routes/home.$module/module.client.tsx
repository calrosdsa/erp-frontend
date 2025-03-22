import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import Menu from "./components/menu";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";

export default function ModuleClient() {
  const { module } = useLoaderData<typeof loader>();
  const {roleActions} = useOutletContext<GlobalState>()
  setUpToolbar(()=>{
    return {
      titleToolbar:module?.module.label
    }
  },[module])
  return (
    <div>
      {module && <Menu data={module} roleActions={roleActions}/>}
      {/* {JSON.stringify(module)} ASDAS */}
    </div>
  );
}
