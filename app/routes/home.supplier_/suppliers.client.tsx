import { useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { supplierColumns } from "@/components/custom/table/columns/buying/supplier-columns";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useCreateSupplier } from "./components/create-supplier";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { DEFAULT_ID } from "~/constant";

export default function SuppliersClient() {
  const globalState = useOutletContext<GlobalState>();
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const createSupplier = useCreateSupplier();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { t } = useTranslation("common");
  const [searchParams,setSearchParams] = useSearchParams()
  const setParams = (params: Record<string, any>) => {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value); // Update or add the parameter
      } else {
        searchParams.delete(key); // Remove the parameter if the value is empty
      }
    });
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };
  return (
    <ListLayout
      title={t(party.supplier)}
      {...(permission.create && {
        onCreate: () => {
          setParams({
            [route.supplier]:DEFAULT_ID
          })
        },
      })}
    >
      <DataTable
        data={paginationResult?.results || []}
        columns={supplierColumns({
          setParams, 
        })}
        enableSizeSelection={true}
      />
    </ListLayout>
  );
}
