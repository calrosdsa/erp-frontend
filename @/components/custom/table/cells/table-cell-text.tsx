import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { BoxesIcon, SquareCheckIcon, SquareIcon } from "lucide-react";
import Typography, { labelF, sm } from "@/components/typography/Typography";
import { Link } from "@remix-run/react";

interface TableCellProps<TData> {
  getValue: Getter<any>;
  row: Row<TData>;
  column: Column<TData, unknown>;
  table: Table<TData>;
  text: string;
  navigate?: () => string;
}

export default function TableCellText<TData>({
  text,
  navigate,
  getValue,
  row,
  column,
  table,
}: TableCellProps<TData>) {
  //   const initialValue = getValue();
  return (
    <div>
      {typeof text == "string" ? (
        <Typography fontSize={labelF}>
          {navigate == undefined ? text : <Link to={navigate()} className=" underline">{text}</Link>}
        </Typography>
      ) : (
        "-"
      )}
    </div>
  );
}
