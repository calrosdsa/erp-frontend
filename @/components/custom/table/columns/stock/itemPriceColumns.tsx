  import { Link } from "@remix-run/react";
  import { ColumnDef } from "@tanstack/react-table";
  import { useTranslation } from "react-i18next";
  import { components } from "~/sdk";
  import { formatCurrency } from "~/util/format/formatCurrency";
  import { formatLongDate } from "~/util/format/formatDate";

  export const itemPriceColumns = ({
    includeItem,
  }: {
    includeItem?: boolean;
  } ): ColumnDef<components["schemas"]["ItemPrice"]>[] => {
    const { t, i18n } = useTranslation();
    let columns: ColumnDef<components["schemas"]["ItemPrice"]>[] = [];

    columns.push({ accessorKey: "ItemPriceList.Currency", id: "Currency" });
    columns.push({
      id: "index",
      cell: ({ row }) => {
        const index = row.index;
        return <div className="">{index + 1}.-</div>;
      },
    });
    columns.push({
      accessorKey: "Code",
      header: t("table.code"),
      cell: ({ row }) => {
        const code = row.getValue("Code") as string;
        return (
          <Link
            to={`/home/stock/item-prices/${encodeURIComponent(code)}`}
            className="underline font-semibold"
          >
            {code.toString()}
          </Link>
        );
      },
    })
    columns.push({
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
    })
    columns.push({
      accessorKey: "ItemQuantity",
      header: t("form.itemQuantity"),
    })
    columns.push({
      accessorKey: "CreatedAt",
      header: t("table.createdAt"),
      cell: ({ row }) => {
        const date = row.getValue("CreatedAt");
        const longDate = formatLongDate(date as string, i18n.language);
        return <div className="">{longDate}</div>;
      },
    })

    if (includeItem) {
      columns.push({ accessorKey: "Item.Code", id: "itemCode" });

      columns.push({
        accessorKey: "Item.Name",
        id:"itemName",
        header: t("item.code"),
        cell: ({ row }) => {
          const itemName = row.getValue("itemName") as string
          const code = row.getValue("itemCode") as string;
          return (
            <Link
              to={`/home/stock/items/${encodeURIComponent(code)}`}
              className="underline font-semibold"
            >
              {itemName}
            </Link>
          );
        },
      })
    }
    return columns
      // {
      //   accessorKey: "Code",
      //   header: t("table.Code"),
      //   cell:({row})=>{
      //     const code = row.getValue("Code") as string;
      //     return (
      //       <div className=" uppercase">
      //         <Link to={`/home/purchases/orders/${encodeURIComponent(code)}`}>
      //         <Typography className=" text-primary underline cursor-pointer">
      //         {code}
      //         </Typography>
      //         </Link>
      //       </div>
      //     )
      //   }
      // },
      // {
      //   accessorKey: "OrderType",
      //   header: t("table.type"),
      // },
      // {
      //   accessorKey: "CreatedAt",
      //   header: t("table.createdAt"),
      //   cell: ({ row }) => {
      //     const date = row.getValue("CreatedAt");
      //     const longDate = formatLongDate(date as string,i18n.language)
      //     return (
      //       <div className="">
      //         {longDate}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   accessorKey: "DeliveryDate",
      //   header: t("table.deliverdDate"),
      //   cell: ({ row }) => {
      //     const date = row.getValue("DeliveryDate");
      //     const longDate = formatLongDate(date as string,i18n.language)
      //     return (
      //       <div className="">
      //         {longDate}
      //       </div>
      //     );
      //   },
      // },
  };
