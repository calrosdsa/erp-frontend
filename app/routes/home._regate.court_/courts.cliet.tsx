import { useLoaderData, useNavigate, useOutletContext, useSearchParams } from "@remix-run/react";
import Court, { loader } from "./route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { DataTable } from "@/components/custom/table/CustomTable";
import { courtColumns } from "@/components/custom/table/columns/regate/court-columns";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function CourtClient() {
  const globalState = useOutletContext<GlobalState>();
  const { results, actions } = useLoaderData<typeof loader>();
  const r = route;
  const navigate = useNavigate();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const [searchParams,setSearchParams] = useSearchParams()

  const openModal = (key:string,value:string)=>{
    searchParams.set(key,value)
    setSearchParams(searchParams,{
        preventScrollReset:true
    })
  }


  return (
    <ListLayout
      title="Cancha"
      {...(permission?.create && {
        onCreate: () => {
          navigate(r.toRouteDetail(r.court,"new"));
        },
      })}
    >
      <DataTable
        data={results || []}
        columns={courtColumns({
            openModal
        })}
        enableSizeSelection={true}
      />
    </ListLayout>
  );
}
