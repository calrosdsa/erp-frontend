import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemPriceColumns } from "@/components/custom/table/columns/stock/item-price-columns";
import { useAddItemPrice } from "./components/add-item-price";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { routes } from "~/util/route";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useNewItemPrice } from "../home.stock.itemPrice.new/components/new-item-price-dialog";

export default function ItemPricesClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const addItemPrice = useAddItemPrice();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions: globalState.roleActions,
    actions: actions,
  });
  const r = routes;
  const navigate = useNavigate();
  const newItemPrice = useNewItemPrice();

  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.itemPrice),
              routePrefix: [r.stockM],
              routeSufix: ["new"],
            })
          );
        },
      }),
    };
  }, [permission]);
  return (
    <div>
      <DataTable
        data={paginationResult?.results || []}
        columns={itemPriceColumns({ includeItem: true })}
        paginationOptions={{
          rowCount: paginationResult?.total || 0,
        }}
        enableSizeSelection={true}
        hiddenColumns={{
          Currency: false,
          Rate: true,
        }}
      />
    </div>
  );
}
