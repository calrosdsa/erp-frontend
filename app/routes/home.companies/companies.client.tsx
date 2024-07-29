import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { Avatar, Box, Button, Chip, ColorPaletteProp, Link, Typography } from "@mui/joy";
import OrderList from "~/components/shared/table/CustomList";
import OrderTable, { rows } from "~/components/shared/table/CustomTable";
import React from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { RowMenu } from "~/components/shared/table/RowMenu";
import { useTranslation } from "react-i18next";

export default function CompaniesClient() {
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
        {t("company.companies")}
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
      </Box>

      <OrderTable
      headerValues={[{name:"",style:{ width: 60, padding: '12px 6px' }},{name:"Name"},{name:""}]}
      body={()=>{
        return (
            <tbody>
            {rows.map((row,idx) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                    {idx}
                </td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
             
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button">
                      Download
                    </Link>
                    <RowMenu onEdit={()=>{}}/>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        )
      }}
       />
      {/* <OrderList />  */}
    </>
  );
}
