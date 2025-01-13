import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import TableCellDate from "../../cells/table-cell-date";
import {
  pricingChargeDataSchema,
  pricingLineItemDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { z } from "zod";
import TableCellEditable from "../../cells/table-cell-editable";
import { DataTableRowActions } from "../../data-table-row-actions";

export const pricingChargeColumns = ({}: {}): ColumnDef<
  z.infer<typeof pricingChargeDataSchema>
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell:TableCellEditable,
      
    },
    {
      accessorKey: "rate",
      header: "Tasa",
      cell:TableCellEditable,
    },
    {
      id: "actions-row",
      cell: DataTableRowActions,
      size:50,
    }
  ];
};

export const pricingLineItemColumns = (): ColumnDef<
  z.infer<typeof pricingLineItemDataSchema>
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    // {
    //   id:"no",
    //   accessorKey:"no",
    //   cell:TableCellIndex,
    //   size:50
    // },
    {
      accessorKey:"supplier",
      header:t("supplier"),
      cell:TableCellEditable,
      meta: {
        inputType: "autocomplete",
      },
    },
    {
      accessorKey: "part_number",
      header: "PN",
      size: 160,
      cell: TableCellEditable,
    },
    {
      accessorKey: "description",
      header: "Descripction",
      size: 320,
      cell: TableCellEditable,
      meta: {
        inputType: "textarea",
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      // cell: TableCell,  
    },
    {
      accessorKey: "pl_unit",
      header: "PL_Unit",
      cell: TableCellEditable,
    },

    {
      accessorKey: "fob_unit_fn",
      header: "Fob_Unit",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "retention_fn",
      header: "Retencion",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
    accessorKey: "cost_zf_fn",
      header: "Costo_ZF",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "cost_alm_fn",
      header: "Costo_Alm",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "tva_fn",
      header: "TVA",
      cell: TableCellEditable,
      // meta:{
      //   calculate:true
      // }
    },
    {
      accessorKey: "cantidad_fn",
      header: "Cantidad",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_unitario_fn",
      header: "Precio_Unitario",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_total_fn",
      header: "Precio_Total",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_unitario_tc_fn",
      header: "Precio_Unitario_TC",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_total_tc_fn",
      header: "Precio_Total_TC",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "fob_total_fn",
      header: "Fob_Total",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "gpl_total_fn",
      header: "Gpl_Total",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "tva_total_fn",
      header: "Tva_Total",
      cell: TableCellEditable,
      meta:{
        calculate:true
      }
    },
  ];
};

export const pricingColumns = ({}: {}): ColumnDef<
  components["schemas"]["PricingDto"]
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "code",
      header: "ID",
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.pricing,
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
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
    // {
    //   accessorKey: "",
    //   header: t("created_at"),
    //   cell: ({ ...props }) => {
    //     return <TableCellDate i18n={i18n} {...props} />;
    //   },
    // },
  ];
};
