import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatCurrency } from "~/util/format/formatCurrency";
import { formatLongDate } from "~/util/format/formatDate";
import TableCellDate from "../../cells/table-cell-date";
import { DEFAULT_CURRENCY } from "~/constant";
import { route } from "~/util/route";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const itemPriceColumns = ({
  includeItem,
}: {
  includeItem?: boolean;
}): ColumnDef<components["schemas"]["ItemPriceDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  let columns: ColumnDef<components["schemas"]["ItemPriceDto"]>[] = [];
  const r = route;
  
  if (includeItem) {
    columns.push({
      accessorKey: "item_name",
      header: t("item.code"),
      cell: ({ ...props }) => {
        const rowData =props.row.original
        return (
          <TableCellNameNavigation
          {...props}
          navigate={(e)=>r.toRoute({
            main:r.itemPrice,
            routeSufix:[rowData.item_name],
            q:{
              tab:"info",
              id:rowData.id.toString()
            }
          })}
          />
        );
      },
    });

    columns.push({ accessorKey: "item_code", id: "itemCode" });
  }

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: ({ row }) => {
      const rowData = row.original;
      const currency = rowData.price_list_currency;
      return (
        <div className="">
          {formatCurrency(
            Number(rowData.rate),
            currency || DEFAULT_CURRENCY,
            i18n.language
          )}
        </div>
      );
    },
  });
  // columns.push({
  //   accessorKey: "price_list_currency",
  //   header:t("form.currency"),

  // });
  columns.push({
    accessorKey: "item_quantity",
    header: t("form.itemQuantity"),
  });
  columns.push({
    accessorKey: "created_at",
    header: t("table.createdAt"),
    cell: ({ ...props }) => {
      return <TableCellDate {...props} i18n={i18n} />;
    },
  });


  columns.push({
    accessorKey: "price_list_name",
    header: t("priceList"),
    cell: ({ ...props }) => {
      const rowData =props.row.original
      return (
        <TableCellNameNavigation
        {...props}
        navigate={(e)=>r.toRoute({
          main:r.priceList,
          routePrefix:[r.stockM],
          routeSufix:[e],
          q:{
            tab:"info",
            id:rowData.price_list_uuid
          }
        })}
        />
      );
    },
  });

  return columns;
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
