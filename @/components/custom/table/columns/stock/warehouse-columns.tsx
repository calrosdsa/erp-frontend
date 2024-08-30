import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";

export const warehouseColumns = (): ColumnDef<
  components["schemas"]["WareHouse"]
>[] => {
  const { t,i18n } = useTranslation("common");
  const r = routes
  let columns: ColumnDef<components["schemas"]["WareHouse"]>[] = [];
  columns.push({
    accessorKey: "Code",
    header: t("table.code"),
    cell: ({ row }) => {
      const code = row.getValue("Code") as string;
      return (
        <Link
          to={r.toWarehouseInfo(code)}
          className="underline font-semibold"
        >
          {code.toString()}
        </Link>
      );
    },
  });
  columns.push({
    header: t("form.name"),
    accessorKey: "Name",
  })
  columns.push({
    accessorKey: "CreatedAt",
    header: t("table.createdAt"),
    cell: ({ row }) => {
      const date = row.getValue("CreatedAt");
      const longDate = formatLongDate(date as string,i18n.language)
      return (
        <div className="">
          {longDate}
        </div>
      );
    },
  })

  return columns;
};
