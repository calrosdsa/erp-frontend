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
  SortingState,
  TableMeta,
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
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTablePagination } from "./DataTablePagination"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { DataTableToolbar } from "./data-table-toolbar"
import { useTranslation } from "react-i18next"
import DataTableEditFooter from "./data-table-edit-footer"
import { useSearchParams } from "@remix-run/react"

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
  const [rowSelection, setRowSelection] = useState({})
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

  return (
    <div className="py-3 space-y-4 w-full">
      {metaActions != undefined && <DataTableToolbar table={table} />}

      <div className="rounded-md border h-full relative">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs whitespace-nowrap h-9">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center"
                >
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="w-full">
            <TableRow>
              <TableHead colSpan={table.getCenterLeafColumns().length} align="right">
                {metaOptions != undefined && (
                  <DataTableEditFooter table={table} />
                )}
                {paginationOptions != undefined && (
                  <DataTablePagination table={table} />
                )}
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
} 