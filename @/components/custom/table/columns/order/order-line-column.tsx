import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { z } from "zod";
import TableCellPrice from "../../cells/table-cell-price";
import TableCellIndex from "../../cells/table-cell-index";
import { formatTax, getTaxPorcent } from "~/util/format/formatCurrency";
import { editLineItemSchema } from "~/util/data/schemas/stock/item-line-schema";
import { ItemLineType } from "~/gen/common";
import { DataTableRowActions } from "../../data-table-row-actions";

export const  orderLineColumns = ({
  currency,
  itemLineType,
}: {
  currency?: string;
  itemLineType:ItemLineType
}): ColumnDef<z.infer<typeof editLineItemSchema>>[] => {
  let columns: ColumnDef<z.infer<typeof editLineItemSchema>>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    header:t("table.no"),
    cell:TableCellIndex
  })
  columns.push({
    accessorKey: "item_code",
    header: t("_item.code"),
  });
  columns.push({
    accessorKey: "item_name",
    header: t("form.name"),
  });
  // columns.push({
  //   accessorKey: "item_price.uom",
  //   header: t("form.uom"),
  // });

  // if(itemLineType == ItemLineType.ITEM_LINE_ORDER) {
    columns.push({
      accessorKey: "quantity",
      header: t("_item.quantity"),
    });
  // }


  if(itemLineType == ItemLineType.ITEM_LINE_RECEIPT) {
    columns.push({
      accessorKey: "lineItemReceipt.acceptedQuantity",
      header: t("f.accepted",{o:t("form.quantity")}),
    });  
    columns.push({
      accessorKey: "lineItemReceipt.rejectedQuantity",
      header: t("f.rejected",{o:t("form.quantity")}),
    });  
  }

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: ({...props})=>{
      return currency ? (
        <TableCellPrice {...props}  currency={currency} i18n={i18n}/>
      ): (
        "-"
      );
    },
  });

  columns.push({
    accessorKey: "amount",
    header: t("form.amount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n}
        price={rowData.rate * Number(rowData.quantity)}
         />
      ) : (
        "-"
      );
    },
  });

  columns.push({
      id: "actions",
      cell: DataTableRowActions,
  })

  // columns.push({
  //   accessorKey: "amount",
  //   header: t("form.tax"),
  //   cell: ({ ...props }) => {
  //     const rowData = props.row.original
  //     const taxPrice = getTaxPorcent(rowData.item_price.tax_value,rowData.item_price.rate,currency,i18n.language)
  //     return currency ? (
  //       <TableCellPrice {...props} currency={currency} i18n={i18n} price={taxPrice}/>
  //     ) : (
  //       "-"
  //     );
  //   },
  // });


  // columns.push({
  //     id: "actions-row",
  //     cell: DataTableRowActions,
  //   })
  return [...columns];
};


//FOR DISPLAY ITEM LINES IN ORDERS,INVOICE AND RECEIPT
export const displayItemLineColumns = ({
  currency,
}: {
  currency?: string;
}): ColumnDef<components["schemas"]["ItemLineDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["ItemLineDto"]>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    header:t("table.no"),
    cell:TableCellIndex
  })
  columns.push({
    accessorKey: "item_code",
    header: t("_item.code"),
  });
  columns.push({
    accessorKey: "item_name",
    header: t("form.name"),
  });
  // columns.push({
  //   accessorKey: "uom",
  //   header: t("form.uom"),
  // });
  columns.push({
    accessorKey: "quantity",
    header: t("_item.quantity"),
  });

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: ({ ...props }) => {
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n} />
      ) : (
        "-"
      );
    },
  });

  columns.push({
    id: "amount",
    header: t("form.amount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original
      const total = rowData.rate * rowData.quantity
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n}
        price={total}/>
      ) : (
        "-"
      );
    },
  });

  // columns.push({
  //   accessorKey: "amount",
  //   header: t("form.tax"),
  //   cell: ({ ...props }) => {
  //     const rowData = props.row.original
  //     const taxPrice = getTaxPorcent(rowData.tax_value,rowData.item_price_rate,currency,i18n.language)
  //     return currency ? (
  //       <TableCellPrice {...props} currency={currency} i18n={i18n} price={taxPrice}/>
  //     ) : (
  //       "-"
  //     );
  //   },
  // });


  columns.push({
      id: "actions-row",
      cell: DataTableRowActions,
    })
  return [...columns];
};
