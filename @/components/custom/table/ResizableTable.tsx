import React, { useState } from 'react'
import {
  useReactTable,
  ColumnResizeMode,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  ColumnResizeDirection,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function ResizableTable<TData, TValue>({
  columns,
  data
}: Props<TData, TValue>) {
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>("onChange")
  const [columnResizeDirection, setColumnResizeDirection] = useState<ColumnResizeDirection>('ltr')

  const defaultColumn: Partial<ColumnDef<TData, unknown>> = {
    minSize: 500,
    size: 500,
    maxSize: 500,
  }

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    // defaultColumn,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <div style={{ direction: table.options.columnResizeDirection }}>
        <div className="rounded-lg border">
          <Table className=' overflow-auto '>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        position: 'relative',
                      }}
                      className="border-r last:border-r-0 bg-gray-100 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute ${
                          columnResizeDirection === 'rtl' ? 'left-0' : 'right-0'
                        } top-0 h-full w-[1px] hover:w-[5px] hover:bg-primary bg-gray-200 cursor-col-resize select-none touch-none ${
                          header.column.getIsResizing() ? "bg-gray-500" : ''
                        }`}
                        style={{
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  (columnResizeDirection === 'rtl' ? -1 : 1) *
                                  (table.getState().columnSizingInfo.deltaOffset ?? 0)
                                }px)`
                              : '',
                        }}
                      />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="border-b last:border-b-0 ">
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      className="border-r last:border-r-0 whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}