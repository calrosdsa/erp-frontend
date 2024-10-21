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
  TableOptions,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { DataTableToolbar } from "./data-table-toolbar";
import { useTranslation } from "react-i18next";
import DataTableEditFooter from "./data-table-edit-footer";
import { useSearchParams } from "@remix-run/react";

export interface PaginationOptions {
  // onPaginationChange: (d: PaginationState) => void;
  rowCount?: number;
  // paginationState: PaginationState;
}

export interface ExpandedRowOptions<T> {
  getSubRows?: (t: T) => T[];
}

export interface TableMetaOptions<TData> {
  meta: TableMeta<TData> | undefined;
}

export interface TableMetaOptions<TData> {
  meta: TableMeta<TData> | undefined;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hiddenColumns?: VisibilityState;
  paginationOptions?: PaginationOptions;
  expandedOptions?: ExpandedRowOptions<TData>;
  metaOptions?: TableMetaOptions<TData>;
  metaActions?:TableMetaOptions<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hiddenColumns,
  paginationOptions,
  expandedOptions,
  metaOptions,
  metaActions,
}: DataTableProps<TData, TValue>) {
  const [searchParams,setSearchParams] = useSearchParams()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
    pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
  });
  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    let newState: PaginationState | undefined = undefined;
    if (paginationOptions == undefined) return;
    if (typeof updaterOrValue === "function") {
      newState = updaterOrValue(paginationState);
    } else {
      newState = updaterOrValue;
    }
    if (newState != undefined) {
      setPaginationState(newState);
      searchParams.set("page",newState.pageIndex.toString())
      searchParams.set("size",newState.pageSize.toString())
      setSearchParams(searchParams,{
        preventScrollReset:true
      })
    }
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    hiddenColumns || {}
  );
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [expanded, setExpanded] = useState<ExpandedState>({});
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
    enableRowSelection: true,
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
      ...metaActions?.meta
    },
  });

  return (
    <div className=" py-3 space-y-4 w-full">
      {metaActions != undefined ? <DataTableToolbar table={table} />
      :<DataTableToolbar table={table} />}

      <div className="rounded-md border h-full relative">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="w-full">
            <TableRow >
              <TableHead  colSpan={table.getCenterLeafColumns().length} align="right">
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


        {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        >
        Previous
        </Button>
        <Button
        variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          >
          Next
          </Button>
          </div> */}
      </div>
    </div>
  );
}
