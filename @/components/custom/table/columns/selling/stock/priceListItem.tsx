import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "index";
import { formatLongDate } from "~/util/format/formatDate";

export const pricelistItemColums = (): ColumnDef<components["schemas"]["ItemPriceList"]>[] => {
  const { t, i18n } = useTranslation("common");

  return [
    {
      accessorKey: "Code",
      header: t("form.code"),
      cell:({row})=>{
        const code = row.getValue("Code") as string;
        return (
          <div className=" uppercase">
            <Link to={`/home/selling/stock/price-list/${encodeURIComponent(code)}`}>
            <Typography className=" text-primary underline cursor-pointer">
            {code}
            </Typography>
            </Link>
          </div>
        )
      }
    },
    {
      accessorKey: "Name",
      header: t("form.name"),
    },
    {
        accessorKey: "Currency",
        header: t("form.currency"),
    },
    {
      accessorKey: "CreatedAt",
      header: t("table.createdAt"),
      cell: ({ row }) => {
        const date = row.getValue("CreatedAt");
        const longDate = formatLongDate(date as string,i18n.language)
        return (
          <div className="">
            {longDate}
          </div>
        );
      },
    },
  ];
};
