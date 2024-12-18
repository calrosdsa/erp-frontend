import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { DataTable } from "@/components/custom/table/CustomTable";
import { customerColumns } from "@/components/custom/table/columns/selling/customer-columns";
import { useCreateCustomer } from "./components/create-customer";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";

export default function CustomersClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const {t} = useTranslation("common")
  const createCustomer = useCreateCustomer()
  
  setUpToolbar(()=>{
    return {
      titleToolbar:t("_customer.base"),
      ...(permission?.create && {
        addNew: () => {
          createCustomer.openDialog({})
        },
      }),
    }
  },[permission])
  return (
    <div>
      <DataTable
        data={paginationResult?.results || []}
        enableSizeSelection={true}
        columns={customerColumns({})}
      />
    </div>
  );
}
