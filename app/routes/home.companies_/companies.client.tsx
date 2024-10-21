import { useTranslation } from "react-i18next";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { DataTable } from "@/components/custom/table/CustomTable";
import { columns } from "./components/table/columns";
import { useCreateCompany } from "./components/create-company";
import { usePermission } from "~/util/hooks/useActions";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function CompaniesClient() {
  const { t } = useTranslation("common");
  const { paginationResult } = useLoaderData<typeof loader>();
  const state = useOutletContext<GlobalState>();
  const createCompany = useCreateCompany();
  const [permission] = usePermission({
    roleActions: state.roleActions,
    actions: paginationResult?.actions,
  });

  setUpToolbar(()=>{
    return {
      title:t("companies"),
      ...(permission?.create && {
        addNew: () => {
          createCompany.openDialog({});
        },
      }),
    }
  },[permission])

  return (
    <>
      <DataTable
        columns={columns()}
        data={paginationResult?.pagination_result.results || []}
        hiddenColumns={{
          code: false,
        }}
        // expandedOptions={{
        //   getSubRows: (row) => row.CompanyDepartments,
        // }}
      />

      {/* <OrderTable
        headerValues={[
          { name: "", style: { width: 60, padding: "12px 6px" } },
          { name: "Name"},
          { name: "Fecha de Creacion"},
          { name: "" },
        ]}
        body={() => {
          return (
            <>
            {paginationResult != undefined &&
              <tbody>
                {paginationResult.pagination_result.results.map((row, idx) => (
                  <tr key={row.ID}>
                    <td style={{ textAlign: "center", width: 120 }}>{idx+1}</td>
                    <td>
                      <Typography level="body-xs">{row.Name}</Typography>
                    </td> 

                    <td>
                      <Typography level="body-xs">{row.CreatedAt}</Typography>
                    </td>

                    <td>
                      <div  className="flex gap-2 justify-end items-end">                        
                        <RowMenu onEdit={() => {}} />
                          </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              }
            </>
          );
        }}
      /> */}
      {/* <OrderList />  */}
    </>
  );
}
