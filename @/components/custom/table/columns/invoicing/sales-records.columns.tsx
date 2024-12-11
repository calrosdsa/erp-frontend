import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import TableCellPrice from "../../cells/table-cell-price";

export const salesRecordColumn = ({}: {}): ColumnDef<
  components["schemas"]["SalesRecordDto"]
>[] => {
  const r = routes;
  const {i18n} = useTranslation()
  return [
    {
      header: "No.",
      cell: TableCellIndex,
      size:30,
    },
    {
      accessorKey: "invoice_no",
      header: "Número de factura",
      cell: ({ ...props }) => {
        const rowData = props.row.original
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.salesRecord,
                routePrefix: [r.invoicing],
                routeSufix: [name],
                q: {
                  tab: "info",
                  id:rowData.uuid
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "customer_name",
      header: "Nombre del cliente",
    },
    {
      accessorKey: "name_or_business_name",
      header: "Nombre o razón social",
    },
    {
      accessorKey: "customer_nit_ci",
      header: "NIT/CI del cliente",
    },
    {
      accessorKey: "authorization_code",
      header: "Código de autorización",
    },
    {
      accessorKey: "base_amount_for_tax_debit",
      header: "Monto base para débito fiscal",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
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
      accessorKey: "discounts_bonus_and_rebates_subject_to_vat",
      header: "Descuentos, bonos y rebajas sujetos a IVA",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
    {
      accessorKey: "exports_and_exempt_operations",
      header: "Exportaciones y operaciones exentas",
      
    },
    {
      accessorKey: "gift_card_amount",
      header: "Monto de tarjeta de regalo",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
    {
      accessorKey: "ice_amount",
      header: "Monto de ICE",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
    {
      accessorKey: "iehd_amount",
      header: "Monto de IEHD",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
    {
      accessorKey: "ipj_amount",
      header: "Monto de IPJ",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
   
    {
      accessorKey: "other_not_subject_to_vat",
      header: "Otros no sujetos a IVA",
    },
    {
      accessorKey: "sale_type",
      header: "Tipo de venta",
    },
    {
      accessorKey: "state",
      header: "Estado",
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
    {
      accessorKey: "supplement",
      header: "Suplemento",
    },
    {
      accessorKey: "tax_debit",
      header: "Débito fiscal",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
    {
      accessorKey: "tax_rates",
      header: "Tasas de impuesto",
      
    },
    {
      accessorKey: "total_sale_amount",
      header: "Monto total de la venta",
      cell:({...props})=>{
        return <TableCellPrice
        {...props}
        i18n={i18n}
        />
      }
    },
    {
      accessorKey: "with_tax_credit_right",
      header: "Derecho a crédito fiscal",
    },
    {
      accessorKey: "zero_rate_taxable_sales",
      header: "Ventas gravadas a tasa cero",
    },
  ];
};