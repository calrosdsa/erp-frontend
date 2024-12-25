"use client";

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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTablePagination } from "./DataTablePagination";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { DataTableToolbar } from "./data-table-toolbar";
import { useTranslation } from "react-i18next";
import DataTableEditFooter from "./data-table-edit-footer";
import { useSearchParams } from "@remix-run/react";
import { create } from "zustand";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableVirtuoso } from "react-virtuoso";
import React from "react";
import { useUnmount } from "usehooks-ts";
import { cn } from "@/lib/utils";

export interface PaginationOptions {
  rowCount?: number;
}

export interface ExpandedRowOptions<T> {
  getSubRows?: (t: T) => T[];
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
  metaActions?: TableMetaOptions<TData>;
  rowHeight?: number;
  enableRowSelection?: boolean;
  enableSizeSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  maxTableHeight?: number;
}
export const useTableSelectionStore = create<{
  selection: Set<string>;
  selectedRowsData: any[];
  toggle: (id: string) => void;
  clear: () => void;
  setAll: (ids: string[]) => void;
  setSelectedRowsData: (data: any[]) => void;
}>((set) => ({
  selectedRowsData: [],
  selection: new Set(),
  toggle: (id) =>
    set((state) => {
      const newSelection = new Set(state.selection);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selection: newSelection };
    }),
  clear: () => set({ selection: new Set(), selectedRowsData: [] }),
  setAll: (ids) =>
    set({
      selection: new Set(ids),
    }),
  setSelectedRowsData: (e) => set({ selectedRowsData: e }),
}));

export function DataTable<TData, TValue>({
  columns: userColumns,
  data,
  hiddenColumns,
  paginationOptions,
  expandedOptions,
  metaOptions,
  metaActions,
  enableRowSelection = false,
  enableSizeSelection = false,
  onSelectionChange,
  maxTableHeight = 480,
  rowHeight = 35,

}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("page") || DEFAULT_PAGE),
    pageSize: Number(searchParams.get("size") || DEFAULT_SIZE),
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    hiddenColumns || {}
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { selection, toggle, clear, setAll, setSelectedRowsData } =
    useTableSelectionStore();

  const columns = useMemo(() => {
    if (!enableRowSelection) return userColumns;

    const selectionColumn: ColumnDef<TData, any> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const ids = table.getRowModel().rows.map((row) => row.id);
            value ? setAll(ids) : clear();
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <div className="px-2">
          <Checkbox
            checked={selection.has(row.id)}
            onCheckedChange={() => toggle(row.id)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        </div>
      ),
      size: 50,
    };

    return [selectionColumn, ...userColumns];
  }, [selection, data, enableRowSelection, userColumns, setAll, clear, toggle]);

  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updaterOrValue) => {
      // if (paginationOptions == undefined) return;
      const newState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(paginationState)
          : updaterOrValue;
      if (newState != undefined) {
        setPaginationState(newState);
        searchParams.set("page", newState.pageIndex.toString());
        searchParams.set("size", newState.pageSize.toString());
        setSearchParams(searchParams, { preventScrollReset: true });
      }
    },
    [paginationOptions, paginationState, searchParams, setSearchParams]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: paginationState,
      columnVisibility,
      expanded,
      columnFilters,
      sorting,
    },
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
  });

  useEffect(() => {
    const selectedRows = table
      .getRowModel()
      .rows.filter((row) => selection.has(row.id))
      .map((row) => row.original);
    onSelectionChange?.(selectedRows);
    setSelectedRowsData(selectedRows);
  }, [selection, table]);

  const TableComponents = useMemo(
    () => ({
      Table: ({ style, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <table
          {...props}
          style={{ ...style, width: "100%", tableLayout: "fixed" }}
        />
      ),
      TableHead: TableHeader,
      // TableRow:TableRow
      TableRow: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr {...props} className="border-b">
          {children}
        </tr>
      ),
    }),
    []
  );

  const fixedHeaderContent = useCallback(
    () => (
      <div className=" bg-muted z-10">
        {table.getFlatHeaders().map((header) => (
          <TableHead
            key={header.id}
            className="text-xs bg-muted whitespace-nowrap truncate "
            style={{
              width: header.getSize(),
              maxWidth: header.getSize(),
              minWidth: header.getSize(),
              height: 40,
            }}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </div>
    ),
    [table]
  );

  const rowContent = useCallback(
    (_index: number, row: TData) => {
      const tableRow = table.getRowModel().rows[_index];
      return tableRow?.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          style={{
            width: cell.column.getSize(),
            maxWidth: cell.column.getSize(),
            minWidth: cell.column.getSize(),
            height: rowHeight,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className={cn(
            "border-r  last:border-r-0 p-2 text-xs ",
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ));
    },
    [table, selection, data]
  );

  return (
    <div className="space-y-4 w-full">
      {metaActions != undefined && <DataTableToolbar table={table} />}
      <div className="rounded-md border w-full">
        <div
          // ref={tableRef}
          className="relative"
          style={{
            height: `${Math.min(data.length * rowHeight + 48, maxTableHeight)}px`,
          }}
        >
          <TableVirtuoso
            style={{
              height: "100%",
              width: "100%",
            }}
            
            data={table.getRowModel().rows}
            components={TableComponents}
            itemContent={(index, row) => (
              <MemoizedRow row={row} rowContent={rowContent} />
            )}
            fixedHeaderContent={fixedHeaderContent}
          />
        </div>
        {/* <ScrollBar orientation="horizontal" /> */}
      </div>
      <div className="flex justify-between items-center">
        {metaOptions != undefined && <DataTableEditFooter table={table} />}
        {enableSizeSelection && <DataTablePagination table={table} />}
      </div>
    </div>
  );
}

const MemoizedRow = React.memo(
  ({ row, rowContent }: { row: any; rowContent: any }) => (
    <TableRow className=" border-0 hover:bg-transparent  w-full">
      {rowContent(row.index, row.original)}
    </TableRow>
  )
);
