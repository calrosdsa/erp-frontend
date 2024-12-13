import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import TableCellTranslate from "../../cells/table-cell-translate";
import TableCellDate from "../../cells/table-cell-date";
import TableCellNavigate from "../../cells/table-cell-navigate";

export const serialNoSumaryColumns = ({}: {}): ColumnDef<
  components["schemas"]["SerialNoTransactionDto"]
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    {
      header: t("form.postingDate"),
      accessorKey: "posting_date",
      cell: ({ ...props }) => {
        return <TableCellDate {...props} formatDate="medium" i18n={i18n} />;
      },
    },
    {
      accessorKey: "serial_no",
      header: t("serialNo"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.serialNo,
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
      accessorKey: "batch_bundle_no",
      header: t("batchBundle"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.batchBundle,
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
      accessorKey: "item_name",
      header: t("item"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.itemM,
                routePrefix: [r.stockM],
                routeSufix: [name],
                q: {
                  tab: "info",
                  id: rowData.item_code,
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "warehouse_name",
      header: t("warehouse"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.warehouseM,
                routePrefix: [r.stockM],
                routeSufix: [name],
                q: {
                  tab: "info",
                  id: rowData.warehouse_uuid,
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "voucher_type",
      header: t("form.voucherType"),
      cell: ({ ...props }) => {
        return <TableCellTranslate {...props} t={t} />;
      },
    },
    {
      accessorKey: "voucher_code",
      header: t("form.voucherNo"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <>
            <TableCellNameNavigation
              {...props}
              navigate={(name) => r.toVoucher(rowData.voucher_type, name)}
            />
          </>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("form.status"),
      cell: ({ ...props }) => {
        return <TableCellTranslate {...props} t={t} />;
      },
    },
  ];
};

export const serialNoColumns = ({}: {}): ColumnDef<
  components["schemas"]["SerialNoDto"]
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    
    {
      accessorKey: "serial_no",
      header: t("serialNo"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.serialNo,
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
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
  ];
};
