import { TableCellBase } from "@/components/custom/table/cells/table-cell";
import TableCellDate from "@/components/custom/table/cells/table-cell-date";
import TableCellNameNavigation from "@/components/custom/table/cells/table-cell-name_navigation";
import TableCellNavigate from "@/components/custom/table/cells/table-cell-navigate";
import TableCellStatus from "@/components/custom/table/cells/table-cell-status";
import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { OpenModalFunc } from "~/types";
import { formatLongDate } from "~/util/format/formatDate";
import { route } from "~/util/route";

export const itemColumns = ({
  openModal,
}: {
  openModal: OpenModalFunc;
}): ColumnDef<components["schemas"]["ItemDto"]>[] => {
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
            className="font-semibold underline cursor-pointer"
            {...props}
            onClick={() => openModal(route.item, rowData.id)}
          />
        );
      },
    },
    {
      accessorKey: "pn",
      header: t("table.code"),
    },
    {
      accessorKey: "item_type",
      header: t("_item.type"),
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
