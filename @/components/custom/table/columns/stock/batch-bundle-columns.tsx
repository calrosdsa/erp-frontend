import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";

export const batchBundleColumns = ({}: {}): ColumnDef<
  components["schemas"]["BatchBundleDto"]
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "batch_bundle_no",
      header: t("batchBundle"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.batchBundle,
                routePrefix:[r.stockM],
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
      accessorKey: "warehouse",
      header: t("warehouse"),
      cell: ({ ...props }) => {
        const rowData = props.row.original
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.itemM,
                routePrefix:[r.stockM],
                routeSufix: [name],
                q: {
                  tab: "info",
                  id:rowData.warehouse_uuid
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey:"item",
      header: t("item"),
      cell: ({ ...props }) => {
        const rowData = props.row.original
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.itemM,
                routePrefix:[r.stockM],
                routeSufix: [name],
                q: {
                  tab: "info",
                  id:rowData.item_code
                },
              })
            }
          />
        );
      },
    },
  ];
};
