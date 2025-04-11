import ButtonExpandRow from "@/components/custom/button/ButtonExpandRow";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRight, FolderIcon, FolderOpenIcon } from "lucide-react";
import TableCellEditable from "../../cells/table-cell-editable";
import { useTranslation } from "react-i18next";
import { DataTableRowActions } from "../../data-table-row-actions";
import { Link } from "@remix-run/react";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const itemAttributeColumns = (): ColumnDef<
  components["schemas"]["ItemAttributeDto"]
>[] => {
  const { t } = useTranslation("common");
  const r = route;
  return [
    {
      header: t("form.name"),
      accessorKey: "name",
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRouteDetail(r.itemAttributes, name, {
                id: rowData.uuid,
              })
            }
          />
        );
      },
    },
    {
      header: t("table.createdAt"),
      accessorKey: "created_at",
    },
  ];
};

export const itemAttributeValuesColumns = (): ColumnDef<
  components["schemas"]["ItemAttributeValueDto"]
>[] => {
  const { t } = useTranslation("common");
  return [
    {
      header: t("table.no"),
      accessorKey: "ordinal",
    },
    {
      accessorKey: "value",
      header: t("table.attributeValue"),
    },
    {
      accessorKey: "abbreviation",
      header: t("table.abbreviation"),
    },
    {
      id: "actions",
      cell: DataTableRowActions,
    },
  ];
};

export const itemAttributeValuesDtoColumns = (): ColumnDef<
  components["schemas"]["ItemAttributeValueDto"]
>[] => {
  const { t } = useTranslation("common");
  return [
    {
      header: t("table.no"),
      accessorKey: "ordinal",
    },
    {
      accessorKey: "value",
      header: t("table.attributeValue"),
      cell: TableCellEditable,
    },
    {
      accessorKey: "abbreviation",
      header: t("table.abbreviation"),
      cell: TableCellEditable,
    },
    {
      id: "actions",
      cell: DataTableRowActions,
    },
  ];
};
