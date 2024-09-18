  import { Link } from "@remix-run/react";
  import { ColumnDef } from "@tanstack/react-table";
  import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
  import { formatCurrency } from "~/util/format/formatCurrency";
  import { formatLongDate } from "~/util/format/formatDate";
import TableCellDate from "../../cells/table-cell-date";

  export const itemPriceColumns = ({
    includeItem,
  }: {
    includeItem?: boolean;
  } ): ColumnDef<components["schemas"]["ItemPriceDto"]>[] => {
    const { t, i18n } = useTranslation("common");
    let columns: ColumnDef<components["schemas"]["ItemPriceDto"]>[] = [];

    columns.push({
      id: "index",
      cell: ({ row }) => {
        const index = row.index;
        return <div className="">{index + 1}.-</div>;
      },
    });
    columns.push({
      accessorKey: "uuid",
      header: t("table.ID"),
      cell: ({ row }) => {
        const code = row.getValue("uuid") as string;
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
      accessorKey: "rate",
      header: t("form.rate"),
      cell: ({ row }) => {
        const rowData = row.original;
        const currency = rowData.price_list_currency;
        return (
          <div className="">
            {formatCurrency(Number(rowData.rate), currency, i18n.language)}
          </div>
        );
      },
    })
    columns.push({ 
      accessorKey: "price_list_currency",
      header:t("form.currency"),
      
    });
    columns.push({
      accessorKey: "item_quantity",
      header: t("form.itemQuantity"),
    })
    columns.push({
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => {
        return <TableCellDate
        {...props}
        i18n={i18n}
        />;
      },
    })

    if (includeItem) {
      columns.push({ accessorKey: "item_code", id: "itemCode" });

      columns.push({
        accessorKey: "item_name",
        header: t("item.code"),
        cell: ({ row }) => {
          const itemName = row.getValue("item_name") as string
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
