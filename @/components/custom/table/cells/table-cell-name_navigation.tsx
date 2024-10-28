import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { Link } from "@remix-run/react";
import Typography from "@/components/typography/Typography";


interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
    name?:string
    navigate:(name:string)=>string
}

export default function TableCellNameNavigation<TData>({ getValue, row, column, table,navigate,name}:TableCellProps<TData>) {
  const nameR = getValue();
  return (
    <div>
          <div className=" uppercase">
          <Link to={navigate(nameR)}>
            <Typography className=" text-primary underline cursor-pointer">
              {name ? name :
              typeof  nameR == "string" ? nameR : "-"}
            </Typography>
          </Link>
        </div>
    </div>
  );
};