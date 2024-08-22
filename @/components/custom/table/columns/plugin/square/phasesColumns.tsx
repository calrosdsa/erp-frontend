import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Phase } from "~/types/plugin/square/catalog";
import { formatCurrency } from "~/util/format/formatCurrency";
import { formatLongDate } from "~/util/format/formatDate";


export const phaseColumns = (): ColumnDef<Phase>[] => {
  const { t, i18n } = useTranslation("common");
  let columns: ColumnDef<Phase>[] = [];

  
  columns.push({
    accessorKey: "ordinal",
    header: t("table.ordinal"),
  });
  columns.push({
    accessorKey: "cadence",
    header: t("table.cadence"),
  })
  columns.push({
    accessorKey: "periods",
    header: t("table.periods"),
})

columns.push({
  accessorKey: "pricing.price.currency",
  header: t("form.currency"),
  id:"currency"
});

  columns.push({
    accessorKey: "pricing.price.amount",
    id:"amount",
    header: t("form.rate"),
    cell: ({ row }) => {
      const rate = row.getValue("amount");
      const currency = row.getValue("currency") as string;
      return (
        <div className="">
          {formatCurrency(Number(rate), currency, i18n.language)}
        </div>
      );
    },
  })
  return columns
};
