"use client";

import {
  ColumnDef,
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
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { create } from "zustand";
import { TableVirtuoso } from "react-virtuoso";
import React from "react";
import { SettingsIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormulaEngine } from "../util/formula";
import { SupplierAutoCompleteForm } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { Control } from "react-hook-form";

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
  control?: Control<any, any>;
}
type Cell = {
  column: string;
  value: string;
  row: number;
};
export const useTablePricingStore = create<{
  selection: Set<string>;
  selectedRowsData: any[];
  toggle: (id: string) => void;
  clear: () => void;
  setAll: (ids: string[]) => void;
  // selectedCells:Cell[],
  selectedCells: Set<string>;
  onChangeCells: (e: Cell) => void;
  clearSelectedCells: () => void;
  setSelectedRowsData: (data: any[]) => void;
}>((set) => ({
  selectedCells: new Set(),
  onChangeCells: (e) =>
    set((state) => {
      const cellKey = `${e.column}-${e.row}`; // Generate a unique key for the cell
      const newSelectedCells = new Set(state.selectedCells);

      if (newSelectedCells.has(cellKey)) {
        newSelectedCells.delete(cellKey); // Remove the cell from the selected set
      } else {
        newSelectedCells.add(cellKey); // Add the cell to the selected set
      }

      return {
        selectedCells: newSelectedCells, // Update the state with the new selection
      };
    }),
  clearSelectedCells: () =>
    set({
      selectedCells: new Set(),
    }),
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
  control
}: DataTableProps<TData, TValue>) {
  const {
    selection,
    toggle,
    clear,
    setAll,
    setSelectedRowsData,
    onChangeCells,
    clearSelectedCells,
    selectedCells,
  } = useTablePricingStore();

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
  const [currentCell, setCurrentCell] = useState<string>("");
  const formula = new FormulaEngine();
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
  function getIndexFromString(input: string): number | null {
    const parts = input.split("-");
    return parts.length === 2 && !isNaN(Number(parts[1]))
      ? Number(parts[1])
      : null;
  }

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
      const tableMeta: any = table.options.meta;
      return tableRow?.getVisibleCells().map((cell) => {
        const id = `${cell.column.id}-${cell.row.index}`;
        const [value, setValue] = useState(cell.getValue() as string);
        const onBlur = (
          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          // displayValidationMessage(e);
          tableMeta?.updateCell(
            cell.row.index,
            cell.column.id,
            value,
            e.target.validity.valid
          );
        };

        return (
          <ContextMenu key={cell.id}>
            <TableCell
              style={{
                width: cell.column.getSize(),
                maxWidth: cell.column.getSize(),
                minWidth: cell.column.getSize(),
                height: columnHeight,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setCurrentCell(id);
              }}
              onClick={(e) => {
                if (e.ctrlKey) {
                  console.debug("Ctrl+click has just happened!");
                  onChangeCells({
                    column: cell.column.id,
                    value: cell.getValue() as any,
                    row: cell.row.index,
                  });
                  return;
                }
                clearSelectedCells();
                // if (id != currentCell) {
                  setCurrentCell(id);
                // }
                e.stopPropagation();
              }}
              className={cn(
                "border-r border-b last:border-r-0 p-2 text-xs ",
                selectedCells.has(id) && " bg-muted",
                currentCell==id && " ring-primary ring-2"
              )}
            >
              <ContextMenuTrigger
                style={{
                  display: "flex", // Makes the trigger fill the space
                  width: "100%", // Ensure it takes up full width
                  height: "100%", // Ensure it takes up full height
                  alignItems: "center", // Center content vertically (optional)
                }}
              >
                {cell.column.columnDef.meta?.inputType == "autocomplete" ? (
                  <SupplierAutoCompleteForm
                    className="text-xs h-7"
                    name={`pricing_line_items.${cell.row.index}.${cell.column.id}`}
                    control={control}
                    onSelect={(e) => {
                      tableMeta?.updateCell(cell.row.index, "supplier", e.name);
                      tableMeta?.updateCell(
                        cell.row.index,
                        "supplier_id",
                        e.id
                      );
                    }}
                    roleActions={[]}
                  />
                ) : currentCell == id ? (
                  <Input
                    className="text-xs h-full m-0 rounded-none border-0 ring-0 outline-none border-none 
                     focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={value}
                    autoFocus
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                  />
                ) : (
                  <div>
                    {row[cell.column.id?.replace(/_fn$/, "") as keyof any]}
                  </div>
                )}
              </ContextMenuTrigger>
            </TableCell>
            <ContextMenuContent>
              <ContextMenuItem
                disabled={cell.row.index == 0}
                onSelect={() => {
                  tableMeta?.moveRow(cell.row.index, cell.row.index - 1);
                }}
              >
                Subir Fila
              </ContextMenuItem>
              <ContextMenuItem
                disabled={cell.row.index == (table.getRowModel().rows.length-1)}
                onSelect={() => {
                  tableMeta?.moveRow(cell.row.index, cell.row.index + 1);
                }}
              >
                Bajar Fila
              </ContextMenuItem>
              <ContextMenuItem
                onSelect={() => {
                  tableMeta?.removeRow(cell.row.index);
                }}
              >
                Eliminar Fila
              </ContextMenuItem>
              {selectedCells.size > 1 && (
                <ContextMenuItem
                  onSelect={() => {
                    const indexes = Array.from(selectedCells).map((value) => {
                      return getIndexFromString(value); // Assuming value is a string
                    });
                    tableMeta?.removeRow(indexes);
                  }}
                >
                  Eliminar Filas Seleccionadas
                </ContextMenuItem>
              )}
            </ContextMenuContent>
          </ContextMenu>
        );
      });
    },
    [table, selection, data, selectedCells, currentCell]
  );

  return (
    <div className="space-y-4 w-full">
      {/* {JSON.stringify(Array.from(selectedCells))} */}
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
