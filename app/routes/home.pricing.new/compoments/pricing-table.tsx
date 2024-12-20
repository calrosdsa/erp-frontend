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
  TableMeta,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { create } from "zustand";
import { TableVirtuoso } from "react-virtuoso";
import React from "react";
import { SettingsIcon } from "lucide-react";

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
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  maxTableHeight?: number;
  rowHeight?: number;
  fixedHeight?: number;
  metaOptions?: TableMetaOptions<TData>;
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

export function PricingTable<TData, TValue>({
  columns: userColumns,
  data,
  enableRowSelection = false,
  onSelectionChange,
  maxTableHeight = 480,
  rowHeight: columnHeight = 33.6,
  fixedHeight,
  metaOptions,
}: DataTableProps<TData, TValue>) {
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

  const table = useReactTable({
    data,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // getSubRows: expandedOptions?.getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // rowCount: Number(paginationOptions?.rowCount),
    autoResetPageIndex: false,
    manualPagination: true,
    meta: {
      ...metaOptions?.meta,
    //   ...metaActions?.meta,
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
    //   TableRow: TableRow,
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
              height: 30,
            }}
          >
            {/* <div className="flex justify-between"> */}
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
              {/* <SettingsIcon className="h-4 w-4 hidden hover:block"/> */}
              {/* </div> */}
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
            height: columnHeight,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className="border-r border-b last:border-r-0 p-2 text-[11px] "
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ));
    },
    [table, selection, data]
  );

  return (
    <div className="py-3 space-y-4 w-full">
      <div className="rounded-md border w-full">
        <div
          // ref={tableRef}
          className="relative"
          style={{
            height: fixedHeight
              ? fixedHeight
              : `${Math.min(
                  data.length * columnHeight + 48,
                  maxTableHeight
                )}px`,
            // height: `${Math.min(data.`,
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
    </div>
  );
}

const MemoizedRow = React.memo(
  ({ row, rowContent }: { row: any; rowContent: any }) => (
    <TableRow className=" border-0 hover:bg-transparent">
      {rowContent(row.index, row.original)}
    </TableRow>
  )
);
