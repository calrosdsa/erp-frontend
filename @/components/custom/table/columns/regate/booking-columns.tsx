
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
import TableCellIndex from "../../cells/table-cell-index";
import TableCellStatus from "../../cells/table-cell-status";
import TableCellProgress from "../../cells/table-cell-progressbar";

export const bookingColumns = (): ColumnDef<components["schemas"]["BookingDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
       header:t("table.no"),
       cell:TableCellIndex,
    },
    {
        accessorKey: "code",
        header: t("form.code"),
        cell: ({ ...props }) => {
          return (
            <TableCellNameNavigation
              {...props}
              navigate={(code) => r.toBookingDetail(code)}
            />
          );
        },
      },
    {
        accessorKey: "party_name",
        header: t("_customer.base"),
        cell: ({ ...props }) => {
          const rowData = props.row.original;
          return (
            <>
                <TableCellNameNavigation
                  {...props}
                  navigate={(name) => r.toCustomerDetail(name,rowData.party_uuid)}
                />
            </>
          );
        },
      },
      {
        accessorKey:"status",
        header:t("form.status"),
        cell:TableCellStatus
      },
      {
        id: "received",
        header: t("table.received"),
        cell: ({ ...props }) => {
          const rowData = props.row.original;
          return (
            <TableCellProgress
              {...props}
              current={rowData.paid}
              total={rowData.total_price}
            />
          );
        },
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
