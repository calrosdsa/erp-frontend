import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { pricelistItemColums } from "@/components/custom/table/columns/selling/stock/priceListItem";
import { useCreatePriceList } from "./components/add-price-list";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function PriceListsClient() {
  const globalState = useOutletContext<GlobalState>();
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const createPriceList = useCreatePriceList();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  setUpToolbar(() => {
    return {
      ...(permission?.view && {
        addNew: () => {
          createPriceList.onOpenChange(true);
        },
      }),
    };
  }, [permission]);
  return (
    <>
      <DataTable
        columns={pricelistItemColums()}
        data={paginationResult?.results || []}
        enableSizeSelection={true}
      />
    </>
  );
}
