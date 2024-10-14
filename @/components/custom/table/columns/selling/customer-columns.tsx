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

export const customerColumns = ({}): ColumnDef<
  components["schemas"]["CustomerDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) => r.toCustomerDetail(name, rowData.uuid)}
          />
        );
      },
    },
    {
      accessorKey: "customer_type",
      header: t("form.type"),
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => {
        return <TableCellDate {...props} i18n={i18n} />;
      },
    },
  ];
};
