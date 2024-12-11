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
import { PartyType, partyTypeToJSON } from "~/gen/common";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellStatus from "../../cells/table-cell-status";

export const receiptColumns = ({
  receiptPartyType
}:{
  receiptPartyType:string
}): ColumnDef<
  components["schemas"]["ReceiptDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
        header:t("table.no"),
        cell:TableCellIndex,
        size:30,
    },
    {
      accessorKey: "code",
      header: t("form.code"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) => r.toReceiptDetail(receiptPartyType,name)}
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
            {rowData.party_type == PartyType[PartyType.supplier] && (
              <TableCellNameNavigation
                {...props}
                navigate={(name) => r.toRoute({
                  main:partyTypeToJSON(PartyType.supplier),
                  routePrefix:[r.buyingM],
                  routeSufix:[name],
                  q:{
                    tab:"info",
                    id:rowData.party_uuid
                  }
                })
              }
              />
            )}
            {rowData.party_type == PartyType[PartyType.customer] && (
              <TableCellNameNavigation
                {...props}
                navigate={(name) => r.toRoute({
                  main:partyTypeToJSON(PartyType.customer),
                  routePrefix:[r.sellingM],
                  routeSufix:[name],
                  q:{
                    tab:"info",
                    id:rowData.party_uuid
                  }
                })
              }
              />
            )}
          </>
        );
      },
    },
    {
      accessorKey:"status",
      header:t("form.status"),
      cell:TableCellStatus
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
    },
  ];
};
