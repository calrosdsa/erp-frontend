import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { pricelistItemColums } from "@/components/custom/table/columns/selling/stock/priceListItem";
import { useCreatePriceList } from "./components/add-price-list";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";

export default function PriceListsClient() {
  const globalState = useOutletContext<GlobalState>();
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const createPriceList = useCreatePriceList();
  const { t } = useTranslation("common");
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });

  return (
    <>
      <ListLayout
        title={t(party.priceList)}
        {...(permission?.view && {
          onCreate: () => {
            createPriceList.onOpenChange(true);
          },
        })}
      >
        <DataTable
          columns={pricelistItemColums()}
          data={paginationResult?.results || []}
          enableSizeSelection={true}
        />
      </ListLayout>
    </>
  );
}
