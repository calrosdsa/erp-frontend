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
    },
    {
      accessorKey: "rate",
      header: "Tasa",
      size: 100,
    },
  ];
};

export const pricingLineItemColumns = (): ColumnDef<
  z.infer<typeof pricingLineItemDataSchema>
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
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
      cell: TableCell,
    },
    {
      accessorKey: "pl_unit",
      header: "PL Unit",
      cell: TableCell,
    },

    {
      accessorKey: "fob_unit",
      header: "Fob Unit",
      cell: TableCell,
    },
    {
      accessorKey: "retention",
      header: "Retencion",
      cell: TableCell,
    },
    {
    accessorKey: "cost_zf",
      header: "Costo ZF",
      cell: TableCell,
    },
    {
      accessorKey: "cost_alm",
      header: "Costo Alm",
      cell: TableCell,
    },
    {
      id: "tva",
      header: "TVA",
      cell: TableCell,
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      cell: TableCell,
    },
    {
      accessorKey: "precio_unitario",
      header: "Precio Unitario($us)",
      cell: TableCell,
    },
    {
      accessorKey: "precio_total",
      header: "Precio Total ($us)",
      cell: TableCell,
    },
    {
      accessorKey: "precio_unitario_tc",
      header: "Precio Unitario (BS)",
      cell: TableCell,
    },
    {
      accessorKey: "precio_total_tc",
      header: "Precio Total (BS)",
      cell: TableCell,
    },
    {
      accessorKey: "fob_total",
      header: "Fob Total ($us)",
      cell: TableCell,
    },
    {
      accessorKey: "gpl_total",
      header: "Gpl Total ($us)",
      cell: TableCell,
    },
    {
      accessorKey: "tva_total",
      header: "Tva Total ($us)",
      cell: TableCell,
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
    {
      accessorKey: "status",
      header: t("created_at"),
      cell: ({ ...props }) => {
        return <TableCellDate i18n={i18n} {...props} />;
      },
    },
  ];
};
