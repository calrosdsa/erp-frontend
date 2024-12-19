import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import Menu from "./components/menu";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function ModuleClient() {
  const { module } = useLoaderData<typeof loader>();
  setUpToolbar(()=>{
    return {
      titleToolbar:module?.module.label
    }
  },[module])
  return (
    <div>
      {module && <Menu data={module} />}
      {/* {JSON.stringify(module)} ASDAS */}
    </div>
  );
}
