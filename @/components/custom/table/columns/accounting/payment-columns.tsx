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
import { Module, moduleToJSON, PartyType, partyTypeToJSON } from "~/gen/common";
import { z } from "zod";
import TableCellPrice from "../../cells/table-cell-price";
import TableCellTranslate from "../../cells/table-cell-translate";
import { paymentReferceSchema } from "~/util/data/schemas/accounting/payment-schema";

export const paymentColumns = (): ColumnDef<
  components["schemas"]["PaymentDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      accessorKey: "code",
      header: t("form.code"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toModulePartyDetail(
                moduleToJSON(Module.accounting),
                partyTypeToJSON(PartyType.payment),
                name,
                {
                  tab: "info",
                }
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "party_name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) => {
              return r.toPartyDetailPage(
                name,
                rowData.party_uuid,
                rowData.party_type
              );
            }}
          />
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

    {
      accessorKey: "posting_date",
      header: t("form.postingDate"),
      cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
    },
  ];
};

export const paymentReferencesColumns = (): ColumnDef<
  z.infer<typeof paymentReferceSchema>
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      header: t("table.no"),
      cell: TableCellIndex,
    },
    {
      accessorKey: "partyType",
      header: t("form.type"),
      cell: ({ ...props }) => <TableCellTranslate {...props} t={t}/>,
      // cell:({...props})=>{
      //   const rowData = props.row.original
      //   return(
      //     <TableCellNameNavigation
      //     {...props}
      //     navigate={(name)=>r.toModulePartyDetail(moduleToJSON(Module.accounting),
      //       partyTypeToJSON(PartyType.payment),name,{
      //         tab:"info"
      //       })}
      //     />
      //   )
      // }
    },
    {
      accessorKey: "partyName",
      header: t("form.name"),
      // cell:({...props})=>{
      //   const rowData = props.row.original
      //   return(
      //     <TableCellNameNavigation
      //     {...props}
      //     navigate={(name)=>{
      //       return r.to(name,rowData.party_uuid,rowData.party_type)
      //   }}
      //     />
      //   )
      // }
    },
    {
      accessorKey: "grandTotal",
      header: t("form.total"),
      cell: ({ ...props }) => <TableCellPrice {...props} i18n={i18n} />,
    },
    {
      accessorKey: "outstanding",
      header: t("form.outstandingAmount"),
      cell: ({ ...props }) => <TableCellPrice {...props} i18n={i18n} />,
    },

    {
      accessorKey: "allocated",
      header: t("form.allocated"),
      cell: ({ ...props }) => <TableCellPrice {...props} i18n={i18n} />,
    },
  ];
};
