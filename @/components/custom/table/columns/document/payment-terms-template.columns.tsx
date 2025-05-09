import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { route } from "~/util/route";
import TableCellStatus from "../../cells/table-cell-status";

export const paymentTermsTemplateColumns = (): ColumnDef<
  components["schemas"]["PaymentTermsTemplateDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["PaymentTermsTemplateDto"]>[] = [];
  const { t, i18n } = useTranslation("common");
  columns.push({
    accessorKey: "name",
    header: t("form.name"),
    size:250,
    cell: ({ ...props }) => {
        const rowData = props.row.original
      return (
        
        <TableCellNameNavigation
          {...props}
          navigate={(name) =>
            route.toRoute({
              main: route.paymentTermsTemplate,
              routeSufix: [name],
              q: {
                tab: "info",
                id: rowData.id.toString(),
              },
            })
          }
        />
      );
    },
  });

  columns.push({
    accessorKey: "status",
    header: t("form.status"),
    cell: TableCellStatus,
  });

  return [...columns];
};
