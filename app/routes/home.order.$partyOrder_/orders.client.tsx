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
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";

export default function OrdersClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const r = routes;
  const params = useParams()
  const partyOrder = params.partyOrder || ""
  const navigate = useNavigate();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const lineItems = useLineItems()
  const taxAndCharges = useTaxAndCharges()



  setUpToolbar(()=>{
    return {
      titleToolbar:undefined,
      ...(permission?.create && {
        addNew: () => {
          lineItems.reset()
          taxAndCharges.reset()
          navigate(r.toRoute({
            main:partyOrder,
            routePrefix:["order"],
            routeSufix:["new"]
          }));
        },
      }),
    }
  },[permission])

  return (
    <div>
      <DataTable
        data={paginationResult?.results || []}
        columns={orderColumns({
          orderPartyType:partyOrder
        })}
      />
    </div>
  );
}
