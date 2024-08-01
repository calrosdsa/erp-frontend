import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { Box, Typography } from "@mui/joy";
import { RowMenu } from "~/components/shared/table/RowMenu";
import OrderTable from "~/components/shared/table/CustomTable";


export default function ItemGroupsClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    return(
        <>
         <OrderTable
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
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "end",justifyContent:"end"}}
                        >
                        
                        <RowMenu onEdit={() => {}} />
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
              }
            </>
          );
        }}
      />
        </>
    )
}