import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import TableCellPrice from "../../cells/table-cell-price";

export const purchaseRecordColumn = ({}: {}): ColumnDef<
  components["schemas"]["PurchaseRecordDto"]
>[] => {
  const r = routes;
  const { i18n } = useTranslation();
  return [
  
    {
      accessorKey: "invoice_no",
      header: "Número de factura",
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.purchaseRecord,
                routePrefix: [r.invoicing],
                routeSufix: [name],
                q: {
                  tab: "info",
                  id: rowData.uuid,
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "authorization_code",
      header: "Código de autorización",
    },
    {
      accessorKey: "cf_base_amount",
      header: "Monto base para débito fiscal",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "consolidation_status",
      header: "Estado de consolidación",
    },
    {
      accessorKey: "control_code",
      header: "Código de control",
    },
    {
      accessorKey: "discounts_bonus_rebates_subject_to_vat",
      header: "Descuentos, bonos y rebajas sujetos a IVA",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "dui_dim_no",
      header: "Número de D.U.I.",
    },
    {
      accessorKey: "exempt_amounts",
      header: "Montos exentos",
    },
    {
      accessorKey: "gift_card_amount",
      header: "Monto de tarjeta de regalo",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "ice_amount",
      header: "Monto de ICE",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "iehd_amount",
      header: "Monto de IEHD",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "invoice_dui_dim_date",
      header: "Fecha de D.U.I.",
    },
    {
      accessorKey: "ipj_amount",
      header: "Monto de IPJ",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "other_not_subject_to_tax_credit",
      header: "Otros no sujetos a crédito fiscal",
    },
    {
      accessorKey: "purchase_type",
      header: "Tipo de compra",
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "supplier",
      header: "Proveedor",
    },
    {
      accessorKey: "supplier_business_name",
      header: "Nombre del negocio del proveedor",
    },
    {
      accessorKey: "supplier_id",
      header: "ID del proveedor",
    },
    {
      accessorKey: "supplier_nit",
      header: "NIT del proveedor",
    },
    {
      accessorKey: "supplier_uuid",
      header: "UUID del proveedor",
    },
    {
      accessorKey: "tax_credit",
      header: "Crédito fiscal",
    },
    {
      accessorKey: "tax_rates",
      header: "Tasas de impuesto",
    },
    {
      accessorKey: "total_purchase_amount",
      header: "Monto total de la compra",
      cell: ({ ...props }) => {
        return <TableCellPrice {...props} i18n={i18n} />;
      },
    },
    {
      accessorKey: "uuid",
      header: "UUID",
    },
    {
      accessorKey: "with_tax_credit_right",
      header: "Derecho a crédito fiscal",
    },
    {
      accessorKey: "zero_rate_taxable_purchases_amount",
      header: "Compras gravadas a tasa cero",
    },
  ];
};