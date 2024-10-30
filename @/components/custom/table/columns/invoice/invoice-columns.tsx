import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellDate from "../../cells/table-cell-date";
import { PartyType, partyTypeFromJSON } from "~/gen/common";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellStatus from "../../cells/table-cell-status";

export const invoiceColumns = ({
  partyType,
}: {
  partyType: string;
}): ColumnDef<components["schemas"]["InvoiceDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      header: t("table.no"),
      cell: TableCellIndex,
    },
    {
      accessorKey: "code",
      header: t("form.code"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: partyType,
                routePrefix:["invoice"],
                routeSufix: [name],
                q: {
                  tab: "info",
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "party_name",
      header: t("form.party"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <>
            <TableCellNameNavigation
              {...props}
              navigate={(name) =>
                r.toPartyDetail(rowData.party_type, name, {
                  id: rowData.party_uuid,
                  tab: "info",
                })
              }
            />
          </>
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
