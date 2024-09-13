import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const itemVariantColumns = (): ColumnDef<
  components["schemas"]["ItemVariantDto"]
>[] => {
  const { t } = useTranslation("common");
  const r = routes;
  return [
    {
      header: t("form.code"),
      accessorKey: "name",
      cell: ({ ...props }) => {
        const rowData = props.row.original
        return <TableCellNameNavigation
        {...props}
        navigate={(name)=>r.toItemDetailPrices(name,rowData.uuid)}
        />
      },
    },
    {
      header: t("form.name"),
      accessorKey: "code",
    },
  ];
};
