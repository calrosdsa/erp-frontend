import TableCellDate from "@/components/custom/table/cells/table-cell-date";
import TableCellNameNavigation from "@/components/custom/table/cells/table-cell-name_navigation";
import TableCellNavigate from "@/components/custom/table/cells/table-cell-navigate";
import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";

export const itemColumns = (): ColumnDef<components["schemas"]["ItemDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      accessorKey: "code",
      header: t("table.code"),
      id: "code",
      cell: ({ ...props }) => {
        const rowData = props.row.original
        return (
        <TableCellNameNavigation
          {...props}
          navigate={(name) => r.toItemDetailPrices(name,rowData.uuid)}
        />
        )
      }
    },
    {
      accessorKey: "name",
      header: t("form.name"),
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
    },
 
  ];
};
