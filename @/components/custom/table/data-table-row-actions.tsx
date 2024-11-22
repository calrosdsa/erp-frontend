import React from 'react'
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Column, Getter, Row, Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Pencil, TrashIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Separator } from "@/components/ui/separator"

interface TableCellProps<TData> {
  getValue: Getter<any>
  row: Row<TData>
  column: Column<TData, unknown>
  table: Table<TData>
}

export function DataTableRowActions<TData>({ getValue, row, column, table }: TableCellProps<TData>) {
  const { t } = useTranslation("common")
  const tableMeta: any = table.options.meta

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" >
        <div className="flex flex-col space-y-1">
          {tableMeta.onEdit != undefined && (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => tableMeta.onEdit(row.index)}
            >
              <Pencil size={12} className="mr-2" />
              {t("actions.edit")}
            </Button>
          )}
          {(tableMeta.onDelete != undefined || tableMeta.removeRow != undefined) && (
            <Separator className="my-1" />
          )}
          {tableMeta.onDelete != undefined && (
            <Button
              variant="ghost"
              className="justify-start text-destructive"
              onClick={() => tableMeta.onDelete(row.index)}
            >
              <TrashIcon size={12} className="mr-2" />
              Delete
            </Button>
          )}
          {tableMeta.removeRow != undefined && (
            <Button
              variant="ghost"
              className="justify-start text-destructive"
              onClick={() => tableMeta.removeRow(row.index)}
            >
              <TrashIcon size={12} className="mr-2" />
              Remove
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}