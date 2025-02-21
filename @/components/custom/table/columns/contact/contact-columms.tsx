import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { route } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellDate from "../../cells/table-cell-date";

export const contactColumns = (): ColumnDef<
  components["schemas"]["ContactDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) => r.toRoute({
              main:r.contact,
              routeSufix:[name],
              q:{
                tab:"info",
                id:rowData.uuid
              }
            })}
          />
        );
      },
    },
    {
      accessorKey: "email",
      header: t("form.email"),
    },
    {
      accessorKey: "phone_number",
      header: t("form.phoneNumber"),
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
    },
  ];
};
