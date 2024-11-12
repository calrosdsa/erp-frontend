import { useFetcher, useLoaderData } from "@remix-run/react";
import { action, loader } from "../route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { aCompanyModulesColumns } from "@/components/custom/table/columns/admin/a-company-columns";
import { CompanyEntitySelector } from "../components/company-entity-selector";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useState } from "react";
import { components } from "~/sdk";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Button } from "@/components/ui/button";

export default function ACompanyModules() {
  const { companyEntities,company } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>()
  // const [selectedEntities, setSelectedEntities] = useState<
  //   components["schemas"]["CompanyEntityDto"][]
  // >([]);

  setUpToolbar(() => {
    return {
    }
  }, []);
  useDisplayMessage({
    success:fetcher.data?.message,
    error:fetcher.data?.error
  },[fetcher.data])
  return (
    <div>

      <CompanyEntitySelector
        entities={companyEntities}
        onEnableDisable={(e,enabled)=>{
          if(company == undefined) return
          const n = e.map((t)=>{
              t.company_id = company.id
              t.enabled = enabled
              return t
          })
          fetcher.submit({
              action:"update-modules",
              updateModules:n
          },{
              method:"POST",
              encType:"application/json",
          })
        }}
        onSelectionChange={(e) => {
            // setSelectedEntities(e)
        }}
      />
    </div>
  );
}
