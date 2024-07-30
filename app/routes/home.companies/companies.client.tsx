import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import {
  Avatar,
  Box,
  Button,
  Chip,
  ColorPaletteProp,
  Link,
  Typography,
} from "@mui/joy";
import OrderList from "~/components/shared/table/CustomList";
import OrderTable, { rows } from "~/components/shared/table/CustomTable";
import React, { useContext } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { RowMenu } from "~/components/shared/table/RowMenu";
import { useTranslation } from "react-i18next";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";

export default function CompaniesClient() {
  const { t } = useTranslation();
  const { paginationResult } = useLoaderData<typeof loader>();
  const ctxValue = useOutletContext<GlobalState>();

  return (
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
      {/* <OrderList />  */}
    </>
  );
}
