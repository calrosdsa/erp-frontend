import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellPrice from "../../cells/table-cell-price";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { routes } from "~/util/route";
import TableCellStatus from "../../cells/table-cell-status";
import TableCellDate from "../../cells/table-cell-date";

export const quotationColumns = ({quotationType}:{
  quotationType:string
}): ColumnDef<components["schemas"]["QuotationDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["QuotationDto"]>[] = [];
  const { t, i18n } = useTranslation("common");
  const r = routes;
  columns.push({
    accessorKey: "code",
    header: t("form.code"),
    cell: ({ ...props }) => {
      return (
        <TableCellNameNavigation
          {...props}
          navigate={(name) =>
            r.toRoute({
              main: quotationType,
              routePrefix: [r.quotation],
              routeSufix: [name],
              q: {
                tab: "info",
              },
            })
          }
        />
      );
    },
  });


  columns.push({
    accessorKey: "party_name",
    header: t("form.party"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <>
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toParty(rowData.party_type, name, {
                tab: "info",
                id: rowData.party_uuid,
              })
            }
          />
        </>
      );
    },
  });

  columns.push({
    accessorKey: "status",
    header: t("form.status"),
    cell: TableCellStatus,
  });

  columns.push({
    accessorKey: "posting_date",
    header: t("form.postingDate"),
    cell: ({ ...props }) => (
      <TableCellDate {...props} i18n={i18n} formatDate="medium" />
    ),
  });

  return [...columns];
};
