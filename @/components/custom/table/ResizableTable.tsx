import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  useReactTable,
  ColumnResizeMode,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  ColumnResizeDirection,
} from '@tanstack/react-table'
import { TableVirtuoso } from 'react-virtuoso'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ResizableVirtualizedTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function ResizableVirtualizedTable<TData, TValue>({
  columns,
  data
}: ResizableVirtualizedTableProps<TData, TValue>) {
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange")
  const [columnResizeDirection] = useState<ColumnResizeDirection>('ltr')
  const [tableWidth, setTableWidth] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),    
  })

  useEffect(() => {
    const updateTableWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth)
      }
    }

    updateTableWidth()
    window.addEventListener('resize', updateTableWidth)

    return () => {
      window.removeEventListener('resize', updateTableWidth)
    }
  }, [])

  const TableComponents = {
    Table: ({ style, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <Table {...props} style={{ ...style, width: `${tableWidth}px`, tableLayout: 'fixed' }} />
    ),
    TableHead: TableHeader,
    TableRow: TableRow,
    TableBody: React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
      ({ style, ...props }, ref) => (
        <TableBody {...props} ref={ref} style={{ ...style, overflow: 'visible' }} />
      )
    ),
  }

  const fixedHeaderContent = useCallback(() => {
    return (
      <TableRow>
        {table.getFlatHeaders().map(header => (
          <TableHead
            key={header.id}
            style={{
              width: header.getSize(),
              position: 'relative',
            }}
            className="border-r last:border-r-0 bg-muted  p-2 text-xs"
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
              } top-0 h-full w-[1px] hover:w-[5px] hover:bg-primary bg-border cursor-col-resize select-none touch-none ${
                header.column.getIsResizing() ? "bg-primary" : ''
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
    )
  }, [table, columnResizeMode, columnResizeDirection])

  const rowContent = useCallback((_index: number, row: TData) => {
    const tableRow = table.getRowModel().rows[_index]
    return tableRow?.getVisibleCells().map(cell => (
      <TableCell
        key={cell.id}
        style={{
          width: cell.column.getSize(),
        }}
        className="border-r last:border-r-0 p-2 text-xs"
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))
  }, [table])

  return (
    <div className="rounded-md border" ref={tableRef}>
      <TableVirtuoso
        style={{ height: '70vh'}}
        data={data}
        components={TableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </div>
  )
}