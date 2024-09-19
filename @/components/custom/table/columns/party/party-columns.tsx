import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellDate from "../../cells/table-cell-date";
import { z } from "zod";
import { partyReferencesSchema } from "~/util/data/schemas/party/party-schemas";
import TableCellIndex from "../../cells/table-cell-index";

export const partyReferencesColumns = ({}): ColumnDef<components["schemas"]["PartyReferenceDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    // {
    //     accessorKey:"ordinal",
    //     header:t("table.ordinal"),
        
    // },
    {
        id:"index",
        header:t("table.no"),
        cell:TableCellIndex,
    },
    {
        accessorKey:"reference",
        header:t("table.reference"),
    },
    {
        accessorKey:"name",
        header:t("table.referenceName"),
        cell:({...props})=>{
            const rowData =props.row.original
            return <TableCellNameNavigation
            {...props}
            navigate={(name)=>r.toReferenceDetail(rowData.code,name,rowData.uuid)}
            />
        }
    },
  
  ];
};
