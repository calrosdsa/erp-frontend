import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { DataTable } from "@/components/custom/table/CustomTable";
import { customerColumns } from "@/components/custom/table/columns/selling/customer-columns";
import { useCreateCustomer } from "./components/create-customer";

export default function CustomersClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const createCustomer = useCreateCustomer()
  return (
    <div>
      <DataTable
        metaActions={{
          meta: {
            ...(permission?.create && {
              addNew: () => {
                createCustomer.openDialog({})
              },
            }),
          },
        }}
        data={paginationResult?.results || []}
        columns={customerColumns({})}
      />
    </div>
  );
}
