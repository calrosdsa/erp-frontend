import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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

export interface OptionsTable {
  onPaginationChange: (d: PaginationState) => void;
  rowCount: number;
  paginationState:PaginationState
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hiddenColumns?: VisibilityState;
  options?: OptionsTable;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hiddenColumns,
  options,
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
    if (options == undefined) return;
    if (typeof updaterOrValue === "function") {
      newState = updaterOrValue(options.paginationState);
    } else {
      newState = updaterOrValue;
    }
    if (newState != undefined) {
      options.onPaginationChange(newState);
    }
  };
  const table = useReactTable({
    data,
    state: {
      columnVisibility: hiddenColumns,
      pagination:options?.paginationState,
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange:onPaginationChange,
    rowCount:options?.rowCount,
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
      {options != undefined &&
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
