import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { taxColumns } from "@/components/custom/table/columns/accounting/tax-columns";
import { useCreateTax } from "./components/add-tax";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";

export default function TaxesClient() {
  const { result,actions } = useLoaderData<typeof loader>();
  const createTax = useCreateTax()
  const globalState = useOutletContext<GlobalState>()
  const [permission] = usePermission({
    roleActions:globalState.roleActions,
    actions:actions
  })
  return (
    <>
      <DataTable columns={taxColumns()} data={result?.results || []} 
      metaActions={{
        meta:{
          ...(permission?.create && {
            addNew:()=>{
              createTax.onOpenChange(true)
            }
          })
        }
      }}
      />
    </>
  );
}
