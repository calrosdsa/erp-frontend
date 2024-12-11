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
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  maxTableHeight?: number;
}
export const useTableSelectionStore = create<{
  selection: Set<string>;
  toggle: (id: string) => void;
  clear: () => void;
  setAll: (ids: string[]) => void;
}>((set) => ({
  selection: new Set(),
  toggle: (id) =>
    set((state) => {
      const newSelection = new Set(state.selection);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      console.log("SELECTION",newSelection)
      return { selection: newSelection };
    }),
  clear: () => set({ selection: new Set() }),
  setAll: (ids) => set({ selection: new Set(ids) }),
}));

const MemoizedRow = React.memo(
  ({ row, rowContent }: { row: any; rowContent: any }) => {
    return rowContent(row.index, row.original);
  }
);

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
  maxTableHeight = 480,
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

  const { selection, toggle, clear, setAll } = useTableSelectionStore();

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
      size:50,
    };

    return [selectionColumn, ...userColumns];
  }, [selection,data]);

  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updaterOrValue) => {
      if (paginationOptions == undefined) return;
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
    [paginationOptions, paginationState, searchParams]
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
    if (onSelectionChange) {
      const selectedRows = table
        .getRowModel()
        .rows.filter((row) => selection.has(row.id))
        .map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [selection]);

  const TableComponents = useMemo(
    () => ({
      Table: ({ style, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <Table
          {...props}
          style={{ ...style, width: "100%", tableLayout: "fixed" }}
        />
      ),
      TableHead: TableHeader,
      TableRow: TableRow,
      TableBody: React.forwardRef<
        HTMLTableSectionElement,
        React.HTMLAttributes<HTMLTableSectionElement>
      >(({ style, ...props }, ref) => (
        <TableBody
          {...props}
          ref={ref}
          style={{ ...style, overflow: "visible" }}
        />
      )),
    }),
    []
  );

  const fixedHeaderContent = useCallback(
    () => (
      <TableRow>
        {table.getFlatHeaders().map((header) => (
          <TableHead
            key={header.id}
            className="text-xs whitespace-nowrap py-2 px-4 bg-background sticky top-0 z-10 "
            style={{ width: header.getSize() }}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
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
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className="border-r last:border-r-0 p-2 text-xs"
        >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ));
    },
    [table,selection,data]
  );
  return (
    <div className="py-3 space-y-4 w-full">
      {metaActions != undefined && <DataTableToolbar table={table} />}
      <ScrollArea className="rounded-md border">
        <div className="w-full">
          <TableVirtuoso
            style={{
              height: `${Math.min(data.length * 44 + 50, maxTableHeight)}px`,
              width: "100%",
            }}
            data={table.getRowModel().rows}
            components={TableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={(index, row) => (
              <MemoizedRow row={row} rowContent={rowContent} />
            )}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex justify-between items-center">
        {metaOptions != undefined && <DataTableEditFooter table={table} />}
        {paginationOptions != undefined && (
          <DataTablePagination table={table} />
        )}
      </div>
    </div>
  );
  // return (
  //   <div className="py-3 space-y-4 w-full">
  //     {metaActions != undefined && <DataTableToolbar table={table} />}
  //     <ScrollArea className="rounded-md border">
  //       <div className="w-full">
  //         <TableVirtuoso
  //           style={{ height: `${Math.min(data.length * 44 + 50, maxTableHeight)}px`, width: '100%' }}
  //           data={data}
  //           components={TableComponents}
  //           fixedHeaderContent={fixedHeaderContent}
  //           itemContent={rowContent}
  //         />
  //       </div>
  //       <ScrollBar orientation="horizontal" />
  //     </ScrollArea>
  //     <div className="flex justify-between items-center">
  //       {metaOptions != undefined && <DataTableEditFooter table={table} />}
  //       {paginationOptions != undefined && <DataTablePagination table={table} />}
  //     </div>
  //   </div>
  // )
}

interface TableStore {
  rowSelection: {};
  setRowSelection: (updaterOrValue: Updater<RowSelectionState>) => void;
}
export const useTable = create<TableStore>((set) => ({
  //Complete and take row selection from here
  rowSelection: {},
  setRowSelection: (updaterOrValue) => {
    return set((state) => {
      let newState: RowSelectionState | undefined = undefined;
      if (typeof updaterOrValue === "function") {
        newState = updaterOrValue(state.rowSelection);
      } else {
        newState = updaterOrValue;
      }
      return {
        rowSelection: newState,
      };
    });
  },
}));
