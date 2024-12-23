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
import TableCell from "../../cells/table-cell";

export const pricingChargeColumns = ({}: {}): ColumnDef<
  z.infer<typeof pricingChargeDataSchema>
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      size: 100,
      cell:TableCell,
    },
    {
      accessorKey: "rate",
      header: "Tasa",
      size: 100,
      cell:TableCell,
    },
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
      cell:TableCell,
      meta: {
        inputType: "autocomplete",
      },
    },
    {
      accessorKey: "part_number",
      header: "PN",
      size: 180,
      cell: TableCell,
    },
    {
      accessorKey: "description",
      header: "Descripction",
      size: 300,
      cell: TableCell,
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
      header: "PL Unit",
      cell: TableCell,
    },

    {
      accessorKey: "fob_unit_fn",
      header: "Fob Unit",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "retention_fn",
      header: "Retencion",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
    accessorKey: "cost_zf_fn",
      header: "Costo ZF",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "cost_alm_fn",
      header: "Costo Alm",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "tva_fn",
      header: "TVA",
      cell: TableCell,
      // meta:{
      //   calculate:true
      // }
    },
    {
      accessorKey: "cantidad_fn",
      header: "Cantidad",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_unitario_fn",
      header: "Precio Unitario($us)",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_total_fn",
      header: "Precio Total ($us)",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_unitario_tc_fn",
      header: "Precio Unitario (BS)",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "precio_total_tc_fn",
      header: "Precio Total (BS)",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "fob_total_fn",
      header: "Fob Total ($us)",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "gpl_total_fn",
      header: "Gpl Total ($us)",
      cell: TableCell,
      meta:{
        calculate:true
      }
    },
    {
      accessorKey: "tva_total_fn",
      header: "Tva Total ($us)",
      cell: TableCell,
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
