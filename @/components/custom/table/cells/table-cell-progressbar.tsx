import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { formatCurrency } from "~/util/format/formatCurrency";
import ProgressBarWithTooltip from "@/components/custom-ui/progress-bar-with-tooltip";


interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
    total?:number
    current:number
}

export default function TableCellProgress<TData>({ getValue, row, column, table,total,current}:TableCellProps<TData>) {
  return (
    <div className=" max-w-20">
       <ProgressBarWithTooltip
        current={current}
        total={total}
        />
    </div>
  );
};