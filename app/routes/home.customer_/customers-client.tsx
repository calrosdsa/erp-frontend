import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { DataTable } from "@/components/custom/table/CustomTable";
import { customerColumns } from "@/components/custom/table/columns/selling/customer-columns";
import { useCreateCustomer } from "./components/create-customer";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { ListLayout } from "@/components/ui/custom/list-table";

export default function CustomersClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { t } = useTranslation("common");
  const createCustomer = useCreateCustomer();
  const [searchParams, setSearchParams] = useSearchParams();
  const openModal = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  return (
    <ListLayout
      title="Clientes"
      {...(permission?.create && {
        onCreate: () => {
          createCustomer.openDialog({});
        },
      })}
    >
      <DataTable
        data={paginationResult?.results || []}
        enableSizeSelection={true}
        columns={customerColumns({
          openModal,
        })}
      />
    </ListLayout>
  );
}
