import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import TableCellNameNavigation from "../../../cells/table-cell-name_navigation";
import { route } from "~/util/route";
import TableCellDate from "../../../cells/table-cell-date";

export const pricelistItemColums = (): ColumnDef<
  components["schemas"]["PriceListDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.priceList,
                routePrefix: [r.stockM],
                routeSufix: [name],
                q: {
                  tab: "info",
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "currency",
      header: t("form.currency"),
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
