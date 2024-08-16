import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  TableOptions,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { DEFAULT_SIZE } from "~/constant";

export interface PaginationOptions {
  onPaginationChange: (d: PaginationState) => void;
  rowCount: number;
  paginationState:PaginationState
}

export interface ExpandedRowOptions<T> {
  getSubRows?:(t:T)=>T[]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hiddenColumns?: VisibilityState;
  paginationOptions?: PaginationOptions;
  expandedOptions?:ExpandedRowOptions<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hiddenColumns,
  paginationOptions,
  expandedOptions
}: DataTableProps<TData, TValue>) {
  // const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(hiddenColumns|| {})
  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: Number(DEFAULT_SIZE),
  // });
  const onPaginationChange: OnChangeFn<PaginationState> = (
    updaterOrValue
  ) => {
    let newState: PaginationState | undefined = undefined;
    if (paginationOptions == undefined) return;
    if (typeof updaterOrValue === "function") {
      newState = updaterOrValue(paginationOptions.paginationState);
    } else {
      newState = updaterOrValue;
    }
    if (newState != undefined) {
      paginationOptions.onPaginationChange(newState);
    }
  };

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const table = useReactTable({
    data,
    state: {
      columnVisibility: hiddenColumns,
      pagination:paginationOptions?.paginationState,
      expanded,
    },
    columns,
    onPaginationChange:onPaginationChange,
    onExpandedChange:setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: expandedOptions?.getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount:paginationOptions?.rowCount,
    autoResetPageIndex: false,
    manualPagination:true,
  });

 
  return (
    <div className="rounded-md border">
      <Table>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginationOptions != undefined &&
        <DataTablePagination table={table} />
      }

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
  );
}
