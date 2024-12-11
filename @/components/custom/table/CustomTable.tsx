"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableMeta,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTablePagination } from "./DataTablePagination"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { DataTableToolbar } from "./data-table-toolbar"
import { useTranslation } from "react-i18next"
import DataTableEditFooter from "./data-table-edit-footer"
import { useSearchParams } from "@remix-run/react"
import { create } from "zustand"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { TableVirtuoso } from "react-virtuoso"
import React from "react"

export interface PaginationOptions {
  rowCount?: number
}

export interface ExpandedRowOptions<T> {
  getSubRows?: (t: T) => T[]
}

export interface TableMetaOptions<TData> {
  meta: TableMeta<TData> | undefined
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  hiddenColumns?: VisibilityState
  paginationOptions?: PaginationOptions
  expandedOptions?: ExpandedRowOptions<TData>
  metaOptions?: TableMetaOptions<TData>
  metaActions?: TableMetaOptions<TData>
  enableRowSelection?: boolean
  onSelectionChange?: (selectedRows: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns: userColumns,
  data,
  hiddenColumns,
  paginationOptions,
  expandedOptions,
  metaOptions,
  metaActions,
  enableRowSelection = false,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
    pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
  })
  const [tableWidth, setTableWidth] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)
  // Add checkbox column if row selection is enabled
  const columns = useMemo(() => {
    if (!enableRowSelection) return userColumns

    const selectionColumn: ColumnDef<TData, any> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    return [selectionColumn, ...userColumns]
  }, [userColumns, enableRowSelection])

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    hiddenColumns || {}
  )
  const {rowSelection,setRowSelection} = useTable()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    let newState: PaginationState | undefined = undefined
    if (paginationOptions == undefined) return
    if (typeof updaterOrValue === "function") {
      newState = updaterOrValue(paginationState)
    } else {
      newState = updaterOrValue
    }
    if (newState != undefined) {
      setPaginationState(newState)
      searchParams.set("page", newState.pageIndex.toString())
      searchParams.set("size", newState.pageSize.toString())
      setSearchParams(searchParams, {
        preventScrollReset: true,
      })
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: paginationState,
      columnVisibility,
      expanded,
      rowSelection,
      columnFilters,
      sorting,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: onPaginationChange,
    onExpandedChange: setExpanded,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: expandedOptions?.getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    rowCount: Number(paginationOptions?.rowCount),
    autoResetPageIndex: false,
    manualPagination: true,
    meta: {
      ...metaOptions?.meta,
      ...metaActions?.meta,
    },
  })

  // Update selected rows when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, table])

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

  const fixedHeaderContent = () => {
    return (
      <TableRow>
        {table.getFlatHeaders().map((header) => (
          <TableHead
            key={header.id}
            className="text-xs whitespace-nowrap py-2 px-4"
            style={{ width: header.getSize() }}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    )
  }

  const rowContent = (_index: number, row: TData) => {
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
  }

  return (
    <div className="py-3 space-y-4 w-full">
      {metaActions != undefined && <DataTableToolbar table={table} />}
      <ScrollArea className="rounded-md border">
        <div ref={tableRef}>
          <TableVirtuoso
            style={{ height: '500px', width: '100%' }}
            data={data}
            components={TableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex justify-between items-center">
        {metaOptions != undefined && <DataTableEditFooter table={table} />}
        {paginationOptions != undefined && <DataTablePagination table={table} />}
      </div>
    </div>
  )
} 

interface TableStore {
  rowSelection:{}
  setRowSelection:(updaterOrValue: Updater<RowSelectionState>)=>void
}
export const useTable = create<TableStore>((set)=>({
  //Complete and take row selection from here
  rowSelection: {},
  setRowSelection: (updaterOrValue) => {
    return set((state)=>{
      let newState: RowSelectionState | undefined = undefined
      if (typeof updaterOrValue === "function") {
        newState = updaterOrValue(state.rowSelection)
      } else {
        newState = updaterOrValue
      }
      return {
        rowSelection:newState
      }
    })
  },
}))