import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellProgress from "../../cells/table-cell-progressbar";
import TableCellStatus from "../../cells/table-cell-status";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";
import TableCellIndex from "../../cells/table-cell-index";

export const orderColumns = ({
  orderPartyType,
}: {
  orderPartyType: PartyType;
}): ColumnDef<components["schemas"]["OrderDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["OrderDto"]>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");

  columns.push({
    header: t("table.no"),
    cell: TableCellIndex,
  });
  columns.push({
    accessorKey: "code",
    header: t("form.code"),
    cell: ({ ...props }) => {
      return (
        <TableCellNameNavigation
          {...props}
          navigate={(name) => r.toOrderDetail(orderPartyType, name)}
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
              navigate={(name) => r.toPartyDetail(rowData.party_type,name,{
                id:rowData.uuid,
                tab:"info"
              })}
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
    id: "received",
    header: t("table.received"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellProgress
          {...props}
          current={rowData.received_items}
          total={rowData.total_items}
        />
      );
    },
  });
  columns.push({
    id: "billed",
    header: t("table.billed"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellProgress
          {...props}
          current={rowData.billed_amount}
          total={rowData.total_amount}
        />
      );
    },
  });
  columns.push({
    accessorKey: "created_at",
    header: t("table.createdAt"),
    cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
  });
  // columns.push({
  //     id: "actions-row",
  //     cell: DataTableRowActions,
  //   })
  return [...columns];
};
