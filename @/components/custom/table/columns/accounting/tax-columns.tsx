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

export const taxColumns = (): ColumnDef<components["schemas"]["TaxDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell:({...props})=>{
        const rowData = props.row.original
        return(
          <TableCellNameNavigation
          {...props}
          navigate={(name)=>r.toTaxDetail(name,rowData.uuid)}
          />
        )
      }
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate
      {...props}
      i18n={i18n}
      />
    },
  ];
};
