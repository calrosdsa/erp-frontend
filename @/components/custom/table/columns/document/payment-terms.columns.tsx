import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { route } from "~/util/route";
import TableCellStatus from "../../cells/table-cell-status";
import { PaymentTermsLineType } from "~/util/data/schemas/document/payment-terms-template.schema";
import TableCellEditable from "../../cells/table-cell-editable";
import { DataTableRowActions } from "../../data-table-row-actions";
import { PaymentTermAutocomplete } from "~/util/hooks/fetchers/docs/use-payment-term-fetcher";
import { dueDateBaseOnOptions } from "~/data";

export const paymentTermsColumns = (): ColumnDef<
  components["schemas"]["PaymentTermsDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["PaymentTermsDto"]>[] = [];
  const { t, i18n } = useTranslation("common");
  columns.push({
    accessorKey: "name",
    header: t("form.name"),
    size: 250,
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellNameNavigation
          {...props}
          navigate={(name) =>
            route.toRoute({
              main: route.paymentTerms,
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

export const paymentTermsLineColumns = ({
  allowEdit,
}: {
  allowEdit: boolean;
}): ColumnDef<PaymentTermsLineType>[] => {
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "payment_term_name",
      header: "Termino de Pago",
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        const tableMeta: any = props.table.options.meta;
        return (
          <PaymentTermAutocomplete
            allowEdit={allowEdit}
            defaultValue={rowData.payment_term}
            onSelect={(e) => {
              tableMeta?.updateCell(props.row.index, "payment_term_name", e.name);
              tableMeta?.updateCell(props.row.index, "payment_term_id", e.id);
              tableMeta?.updateCell(props.row.index, "invoice_portion", e.invoice_portion);
              tableMeta?.updateCell(props.row.index, "credit_days", e.credit_days);
              tableMeta?.updateCell(props.row.index, "due_date_base_on", e.due_date_base_on);
              tableMeta?.updateCell(props.row.index, "description", e.description);
            }}
          />
        );
      },
    },
    {
      accessorKey: "description",
      header: t("form.description"),
      cell: TableCellEditable,
    },
    {
      accessorKey: "invoice_portion",
      header: "Porción de factura",
      cell: TableCellEditable,

    },
    {
      accessorKey: "due_date_base_on",
      header: "Fecha de vencimiento basada en",
      cell: ({...props})=>{
        return (
            <TableCellEditable
            {...props}
            data={dueDateBaseOnOptions}
            />
        )
      },
      meta:{
        inputType: "select",
      }
    },
    {
      accessorKey: "credit_days",
      header: "Días de crédito",
      cell: TableCellEditable,
    },
    {
      id: "actions-row",
      cell: DataTableRowActions,
    },
  ];
};
