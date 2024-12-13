import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { formatCurrency } from "~/util/format/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

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

export default function TableCellStatus<TData>({ getValue, row, column, table}:TableCellProps<TData>) {
  const initialValue = getValue();
  const {t} = useTranslation("common")
  return (
    <div className="flex justify-center">
        {typeof initialValue == "string" &&(
            <Badge variant={"outline"} className="">{t(initialValue)}</Badge>
        )
        }
    </div>
  );
};