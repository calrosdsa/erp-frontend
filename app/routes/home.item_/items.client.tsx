import { Button } from "@/components/ui/button";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemColumns } from "./components/item-columns";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DEFAULT_ID, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { route } from "~/util/route";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { useModalNav } from "~/util/hooks/app/use-open-modal";

const ItemsClient = () => {
  const { t } = useTranslation("common");
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    roleActions: globalState.roleActions,
    actions: actions,
  });
  const {openModal} = useModalNav()
  const r = route;
  
  return (
    <div>
      <ListLayout
        title="Articulo"
        {...(permission.create && {
          onCreate: () =>
            openModal(route.item,DEFAULT_ID)
        })}
      >
        <DataTable
          data={paginationResult?.results || []}
          columns={itemColumns({
            openModal:openModal
          })}
          enableSizeSelection={true}
        />
      </ListLayout>
    </div>
  );
};

export default ItemsClient;
