import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { formatCurrency, formatCurrencyAmount } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";

type Option = {
  label: string;
  value: string;
};
interface TableCellProps<TData> {
  getValue: Getter<any>;
  row: Row<TData>;
  column: Column<TData, unknown>;
  table: Table<TData>;
  i18n: i18n;
  currency?: string;
  price?: number;
  isAmount?:boolean
}

export default function TableCellPrice<TData>({
  getValue,
  row,
  column,
  table,
  i18n,
  currency = DEFAULT_CURRENCY,
  price,
  isAmount,
}: TableCellProps<TData>) {
  const initialValue = getValue();
  const format = (amount:number)=>{
    if(isAmount) {
      return formatCurrencyAmount(amount,currency,i18n.language)
    }
    return formatCurrency(amount, currency, i18n.language)
  }
  return (
    <div className=" whitespace-nowrap truncate">
      {price != undefined
        ? format(price)
        : typeof initialValue == "number" &&
          format(initialValue)}
    </div>
  );
}
