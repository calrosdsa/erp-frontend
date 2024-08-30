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
    // name:string
    id:string
    navigate:(r:string)=>string
}

export default function TableCellNavigate<TData>({ getValue, row, column, table ,id,navigate}:TableCellProps<TData>) {
  const nameR = getValue();
  const idN = row.getValue(id);
  // const nameR = row.getValue(name);
  return (
    <div>
        {typeof idN == "string" &&(
          <div className=" uppercase">
          <Link to={navigate(idN)}>
            <Typography className=" text-primary underline cursor-pointer">
              {typeof  nameR == "string" ? nameR : "-"}
            </Typography>
          </Link>
        </div>
        )
        }
    </div>
  );
};