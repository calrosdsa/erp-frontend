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
import { TableCellBase } from "../../cells/table-cell";
import { openEventModal } from "~/routes/home._regate.event.$id/route";

export const eventBookingsColumns = ({
  openModal,
}: {
  openModal: (key: string, value: string) => void;
}): ColumnDef<components["schemas"]["EventBookingDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellBase
            className="font-semibold underline cursor-pointer line-clamp-1"
            {...props}
            onClick={() => openEventModal(rowData.id.toString(), openModal)}
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
    },
  ];
};
