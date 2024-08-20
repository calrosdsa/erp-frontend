import ButtonExpandRow from "@/components/custom/button/ButtonExpandRow";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRight, FolderIcon, FolderOpenIcon } from "lucide-react";
import { components } from "~/sdk";
import TableCell from "../../table-cell";
import { useTranslation } from "react-i18next";
import { DataTableRowActions } from "../../data-table-row-actions";
import { Link } from "@remix-run/react";
import { routes } from "~/util/route";

export const itemAttributeColumns = ():ColumnDef<components["schemas"]["ItemAttribute"]>[] =>{
    const {t} = useTranslation()
    const r = routes
    return [
        {
            header: t("form.name"),
            accessorKey:"Name",
            cell:({row}) =>{
                const name = row.getValue("Name") as string
                return (
                    <Link to={r.toItemAttributeDetail(name)} className="underline">
                        {name}
                    </Link>
                )
            }
        },
        {
            header: t("table.createdAt"),
            accessorKey:"CreatedAt"
        },
    ]
}

export const itemAttributeValuesColumns = (): ColumnDef<
  components["schemas"]["ItemAttributeValue"]
>[] => {
  const { t } = useTranslation();
  return [
    {
      header: t("table.no"),
      accessorKey: "Ordinal",
    },
    {
      accessorKey: "Value",
      header: t("table.attributeValue"),
    },
    {
      accessorKey: "Abbreviation",
      header: t("table.abbreviation"),
    },
    {
      id: "actions",
      cell: ({ row,table }) => {
        const tableMeta: any = table.options.meta;
        return <DataTableRowActions row={row} onDelete={() =>tableMeta.removeRow(row.index)} />;
      },
    },
  ];
};


export const itemAttributeValuesDtoColumns = (): ColumnDef<
  components["schemas"]["ItemAttributeValueDto"]
>[] => {
  const { t } = useTranslation();
  return [
    {
      header: t("table.no"),
      accessorKey: "ordinal",
    },
    {
      accessorKey: "value",
      header: t("table.attributeValue"),
      cell: TableCell,
    },
    {
      accessorKey: "abbreviation",
      header: t("table.abbreviation"),
      cell: TableCell,
    },
    {
      id: "actions",
      cell: ({ row,table }) => {
        const tableMeta: any = table.options.meta;
        return <DataTableRowActions row={row} onDelete={() =>tableMeta.removeRow(row.index)} />;
      },
    },
  ];
};
