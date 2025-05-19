import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { route } from "~/util/route";
import TableCellStatus from "../../cells/table-cell-status";
import { TableCellBase } from "../../cells/table-cell";

export const workspaceColumns = ({
  openModal,
}: {
  openModal: (key: string, value: string) => void;
}): ColumnDef<components["schemas"]["WorkSpaceDto"]>[] => {
  const { t, i18n } = useTranslation("common");
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
            onClick={() => openModal(route.workspace, rowData.id.toString())}
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
