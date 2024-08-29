import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { taxColumns } from "@/components/custom/table/columns/accounting/tax-columns";
import { useCreateTax } from "./components/add-tax";

export default function TaxesClient() {
  const { result } = useLoaderData<typeof loader>();
  const createTax = useCreateTax()
  return (
    <>
      <DataTable columns={taxColumns()} data={result?.results || []} 
      metaActions={{
        meta:{
            addNew:()=>{
                createTax.onOpenChange(true)
            }
        }
      }}
      />
    </>
  );
}
