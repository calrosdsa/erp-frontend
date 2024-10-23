import { useLoaderData, useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { orderColumns } from "@/components/custom/table/columns/order/order-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { routes } from "~/util/route";
import ProgressBarWithTooltip from "@/components/custom-ui/progress-bar-with-tooltip";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { partyTypeFromJSON } from "~/gen/common";

export default function OrdersClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const r = routes;
  const params = useParams()
  const partyOrder = partyTypeFromJSON(params.partyOrder)
  const navigate = useNavigate();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });



  setUpToolbar(()=>{
    return {
      title:undefined,
      ...(permission?.create && {
        addNew: () => {
          navigate(r.toCreateOrder(partyOrder));
        },
      }),
    }
  },[permission])

  return (
    <div>
      {/* {JSON.stringify(paginationResult?.results)} */}
      <div>
      
      </div>
      <DataTable
        data={paginationResult?.results || []}
        columns={orderColumns({
          orderPartyType:partyOrder
        })}
      />
    </div>
  );
}
