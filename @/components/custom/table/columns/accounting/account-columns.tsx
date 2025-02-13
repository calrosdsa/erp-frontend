import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { route } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellDate from "../../cells/table-cell-date";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellStatus from "../../cells/table-cell-status";
import TableCellTranslate from "../../cells/table-cell-translate";

export const accountColumns = (): ColumnDef<components["schemas"]["LedgerDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell:({...props})=>{
        const rowData = props.row.original
        return(
          <TableCellNameNavigation
          {...props}
          navigate={(name)=>r.toRoute({
            main:r.accountM,
            routeSufix:[name],
            q:{
              tab:"info",
              id:rowData.uuid,
            }
          })}
          />
        )
      }
    },
    {
      accessorKey:"status",
      header:t("form.status"),
      cell:TableCellStatus
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate
      {...props}
      formatDate="medium"
      i18n={i18n}
      />
    },
  ];
};
