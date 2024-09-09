import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { orderColumns } from "@/components/custom/table/columns/order/order-columns";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { routes } from "~/util/route";

export default function PurchasesClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const r = routes;
  const navigate = useNavigate();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  return (
    <div>
      <DataTable
        data={paginationResult?.results || []}
        columns={orderColumns({})}
        metaActions={{
          meta: {
            ...(permission?.create && {
              addNew: () => {
                navigate(r.toPurchaseOrderCreate());
              },
            }),
          },
        }}
      />
    </div>
  );
}
