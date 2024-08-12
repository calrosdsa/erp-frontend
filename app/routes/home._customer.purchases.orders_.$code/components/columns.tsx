import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import {
  formatCurrency,
  formatTax,
  getTaxPorcent,
} from "~/util/format/formatCurrency";
import { formatLongDate } from "~/util/format/formatDate";

export const itemLineColumns = (): ColumnDef<
  components["schemas"]["SalesItemLine"]
>[] => {
  const { t, i18n } = useTranslation();

  return [
    // {
    //   accessorKey: "CreatedAt",
    //   header: t("table.createdAt"),
    //   cell: ({ row }) => {
    //     const date = row.getValue("CreatedAt");
    //     const longDate = formatLongDate(date as string, i18n.language);
    //     return <div className="">{longDate}</div>;
    //   },
    // },
    {
      accessorKey: "ItemPrice.Item.Name",
      header: t("form.name"),
    },
    {
      accessorKey: "ItemQuantity",
      header: t("form.itemQuantity"),
    },
    {
      accessorKey: "Currency",
      header: t("form.currency"),
    },
    {
      accessorKey: "ItemPrice.Tax",
      id:"tax",
      header: t("form.tax"),
      cell: ({ row }) => {
        const tax =row.getValue("tax") as components["schemas"]["Tax"]
        const rate = row.getValue("Rate")
        const currency = row.getValue("Currency") as string;
        return (
            <div>
                {formatTax(tax,Number(rate),currency,i18n.language)}
            </div>
        )
      }
    },
    {
      accessorKey: "Rate",
      header: t("form.rate"),
      cell: ({ row }) => {
        const rate = row.getValue("Rate");
        const currency = row.getValue("Currency") as string;
        return (
          <div className="">
            {formatCurrency(Number(rate), currency, i18n.language)}
          </div>
        );
      },
    },
  ];
};
