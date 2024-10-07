
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
import TableCellIndex from "../../cells/table-cell-index";
import TableCellStatus from "../../cells/table-cell-status";

export const paymentColumns = (): ColumnDef<components["schemas"]["PaymentDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
       header:t("table.no"),
       cell:TableCellIndex,
    },
    {
        accessorKey: "code",
        header: t("form.code"),
        cell:({...props})=>{
          const rowData = props.row.original
          return(
            <TableCellNameNavigation
            {...props}
            navigate={(name)=>r.toPaymentDetail(name)}
            />
          )
        }
      },
    {
      accessorKey: "party_name",
      header: t("form.name"),
      cell:({...props})=>{
        const rowData = props.row.original
        return(
          <TableCellNameNavigation
          {...props}
          navigate={(name)=>{
            return r.toPartyDetailPage(name,rowData.party_uuid,rowData.party_type)
        }}
          />
        )
      }
    },
    {
        accessorKey: "status",
        header: t("form.status"),
        cell: TableCellStatus
      },
    {
        accessorKey: "created_at",
        header: t("table.createdAt"),
        cell: ({ ...props }) => <TableCellDate
        {...props}
        i18n={i18n}
        />
    },

    {
      accessorKey: "posting_date",
      header: t("form.postingDate"),
      cell: ({ ...props }) => <TableCellDate
      {...props}
      i18n={i18n}
      />
    },
  ];
};
