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
import TableCellProgress from "../../cells/table-cell-progressbar";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import TableCellPrice from "../../cells/table-cell-price";
import { Checkbox } from "@/components/ui/checkbox";
import { openBookingModal } from "~/routes/home._regate.booking.$code/route";
import TableCell from "../../cells/table-cell-update";
import { TableCellBase } from "../../cells/table-cell";

export const bookingColumns = ({
  setParams,
}: {
  setParams:(params: Record<string, any>) => void
}): ColumnDef<components["schemas"]["BookingDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  return [
    // {
    //   id: "select",
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    // },
    // {
    //   header: t("table.no"),
    //   cell: TableCellIndex,
    //   size: 30,
    // },
    {
      accessorKey: "code",
      header: t("form.code"),
      size: 75,
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellBase
            className="font-semibold underline cursor-pointer"
            {...props}
            onClick={() =>
              setParams({
                [route.booking]:rowData.id
              })
            }
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
          <TableCellBase
            className="font-semibold underline cursor-pointer"
            {...props}
            onClick={() =>
              setParams({
                [route.customer]:rowData.party_id
              })
            }
          />
          </>
        );
      },
    },

    {
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
      size: 180,
    },
    {
      accessorKey: "total_price",
      header: t("form.amount"),
      size: 90,
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellPrice
            i18n={i18n}
            price={rowData.total_price - rowData.discount}
            {...props}
          />
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Saldo",
      size: 90,
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellPrice
            i18n={i18n}
            price={rowData.total_price - rowData.discount - rowData.paid}
            {...props}
          />
        );
      },
    },
    {
      id: "received",
      header: "Pagado",
      size: 90,
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellProgress
            {...props}
            current={rowData.paid}
            total={rowData.total_price - rowData.discount}
            label="% Pagado:"
          />
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Fecha",
      size: 80,
      cell: ({ ...props }) => (
        <TableCellDate {...props} i18n={i18n} formatDate="medium" />
      ),
    },
    {
      id: "booking_hours",
      header: "Horas Reservadas",
      size: 160,
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <div className="flex whitespace-nowrap gap-2">
            <Badge variant="outline" className="flex items-center">
              {format(parseISO(rowData.start_date), "p")}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              {format(parseISO(rowData.end_date), "p")}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "court_name",
      header: "Cancha",
      // cell: ({ ...props }) => {
      //   const rowData = props.row.original;
      //   return (
      //     <TableCellBase
      //     className="font-semibold underline cursor-pointer"
      //     {...props}
      //     onClick={() =>
      //       setParams({
      //         [route.court]:rowData.court_id
      //       })
      //     }
      //   />
      //   );
      // },
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
    },
  ];
};
