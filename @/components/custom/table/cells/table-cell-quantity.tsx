import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { BoxesIcon, SquareCheckIcon, SquareIcon } from "lucide-react";
import Typography, { labelF, sm } from "@/components/typography/Typography";

type Option = {
  label: string;
  value: string;
};
interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
}

export default function TableCellQuantity<TData>({ getValue, row, column, table }:TableCellProps<TData>) {
  const initialValue = getValue();
  return (
    <div>
        {typeof initialValue == "number" ?(
            <div className="flex space-x-2">
                <Typography fontSize={labelF}>
                {initialValue}
                </Typography>
                <BoxesIcon className="h-5 w-5" strokeWidth={1}/>
            </div>
        ):"-"

        }
    </div>
  );
};