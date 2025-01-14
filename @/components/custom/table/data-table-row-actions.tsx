import React, { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CornerLeftDownIcon, CornerRightUpIcon, Pencil, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

interface TableCellProps<TData> {
  getValue: Getter<any>;
  row: Row<TData>;
  column: Column<TData, unknown>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({
  getValue,
  row,
  column,
  table,
}: TableCellProps<TData>) {
  const { t } = useTranslation("common");
  const tableMeta: any = table.options.meta;
  const rowLength = table.getCoreRowModel().rows.length
  const [open,setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-6 w-6 p-0 data-[state=open]:bg-muted rounded-full"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-min">
        <div className="flex flex-col space-y-1">
          {tableMeta.onEdit != undefined && (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                tableMeta.onEdit(row.index)
                setOpen(false)
              }}
            >
              <Pencil size={12} className="mr-2" />
              {t("actions.edit")}
            </Button>
          )}
          {/* {(tableMeta.onDelete != undefined || tableMeta.removeRow != undefined) && (
            <Separator className="my-1" />
          )} */}
          {tableMeta.onDelete != undefined && (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                tableMeta.onDelete(row.index)
                setOpen(false)
              }}
            >
              <TrashIcon size={12} className="mr-2" />
              Eliminar
            </Button>
          )}
          {tableMeta.removeRow != undefined && (
            <Button
              variant="ghost"
              className="justify-start "
              onClick={() => {
                tableMeta.removeRow(row.index)
                setOpen(false)
              }}
            >
              <TrashIcon size={12} className="mr-2" />
              Remove
            </Button>
          )}
       
          {tableMeta.moveRow != undefined && (
            <Button
              variant="ghost"
              disabled={row.index == 0}
              className="justify-start "
              onClick={() => {
                tableMeta.moveRow(row.index,row.index-1)
                setOpen(false)
              }}
            >
              <CornerRightUpIcon size={12} className="mr-2" />
              Insertar hacia arriba
            </Button>
          )}
          {tableMeta.moveRow != undefined && (
            <Button
              variant="ghost"
              disabled={(rowLength-1) == row.index}
              className="justify-start "
              onClick={() => {
                tableMeta.moveRow(row.index,row.index+1)
                setOpen(false)
              }}
            >
              <CornerLeftDownIcon size={12} className="mr-2" />
              Insertar hacia abajo 
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
