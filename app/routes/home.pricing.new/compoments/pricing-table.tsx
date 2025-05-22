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
import { Check, SettingsIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormulaEngine } from "../util/formula";
import {
  SupplierAutoCompleteForm,
  useSupplierDebounceFetcher,
} from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { Control } from "react-hook-form";
import PalettePicker from "./palette-picker";
import { components } from "~/sdk";
import { Autocomplete } from "@/components/custom/select/autocomplete";

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
  roleActions?: components["schemas"]["RoleActionDto"][];
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
  onChangeCells: (id: string) => void;
  clearSelectedCells: () => void;
  setSelectedRowsData: (data: any[]) => void;
}>((set) => ({
  selectedCells: new Set(),
  onChangeCells: (e) =>
    set((state) => {
      const newSelectedCells = new Set(state.selectedCells);

      if (newSelectedCells.has(e)) {
        newSelectedCells.delete(e); // Remove the cell from the selected set
      } else {
        newSelectedCells.add(e); // Add the cell to the selected set
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
  control,
  roleActions,
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
  const mainInputRef = useRef<HTMLInputElement | null>(null);
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
  const [mainValue, setMainValue] = useState("");

  const colors = [
    "#FF6900",
    "#FCB900",
    "#7BDCB5",
    "#00D084",
    "#8ED1FC",
    "#0693E3",
    "#ABB8C3",
    "#EB144C",
    "#F78DA7",
    "#9900EF",
    "#F22FFF",
    "#000000",
  ];
  const rowContent = useCallback(
    (_index: number, row: any) => {
      const [fetcher, onChange] = useSupplierDebounceFetcher();
      const tableRow = table.getRowModel().rows[_index];
      const tableMeta: any = table.options.meta;
      const isTitle = row.is_title;
      const [selectedColor, setSelectedColor] = useState<string | null>(null);

      return tableRow?.getVisibleCells().map((cell) => {
        const id = `${cell.column.id}-${cell.row.index}`;
        const columnMeta: any = cell.column.columnDef.meta;
        const [value, setValue] = useState(cell.getValue() as string);
        const onBlur = (
          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          // displayValidationMessage(e);
          tableMeta?.updateCell(cell.row.index, cell.column.id, value);
        };
        useEffect(() => {
          setValue(cell.getValue() as string);
        }, [row]);

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
                  setCurrentCell("");
                  console.debug("Ctrl+click has just happened!");
                  onChangeCells(id);
                  return;
                }
                setMainValue((cell.getValue() as string) || "");
                clearSelectedCells();
                // if (id != currentCell) {
                setCurrentCell(id);
                // }
                e.stopPropagation();
              }}
              className={cn(
                "border-r border-b last:border-r-0 p-2 text-xs",
                selectedCells.has(id) && " bg-muted",
                currentCell == id && " ring-primary ring-2  ring-inset",
                isTitle && "h-6 border-r-0"
                // row.color && `text-[${row.color}]`
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
                {columnMeta?.inputType == "autocomplete" && !isTitle ? (
                  <Autocomplete
                    data={fetcher.data?.suppliers || []}
                    onValueChange={onChange}
                    nameK={"name"}
                    defaultValue={cell.row.original["supplier" as keyof TData] || ""}
                    onSelect={(e) => {
                      tableMeta?.updateCell(cell.row.index, "supplier", e.name);
                      tableMeta?.updateCell(cell.row.index, "supplier_id", e.id);
                    }}
                  />
                ) : currentCell == id ? (
                  <Input
                    className={cn(
                      `text-xs px-0  m-0 rounded-none border-0
                     focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-4`,
                      isTitle && " font-semibold text-sm"
                    )}
                    value={value}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setMainValue(e.target.value);
                    }}
                    onBlur={onBlur}
                  />
                ) : (
                  <div
                    className={cn(
                      "line-clamp-4 ",
                      // row.color != "" && " text-cyan-50",
                      isTitle &&
                        "font-semibold  text-center line-clamp-2 leading-3"
                    )}
                    style={{
                      color: row.color,
                    }}
                  >
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
                  setCurrentCell(`${cell.column.id}-${cell.row.index - 1}`);
                }}
              >
                Subir Fila
              </ContextMenuItem>
              <ContextMenuItem
                disabled={cell.row.index == table.getRowModel().rows.length - 1}
                onSelect={() => {
                  tableMeta?.moveRow(cell.row.index, cell.row.index + 1);
                  setCurrentCell(`${cell.column.id}-${cell.row.index + 1}`);
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
                <>
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
                </>
              )}

              <ContextMenuSub>
                <ContextMenuSubTrigger inset>
                  Cambiar Color
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48 hover:bg-background">
                  <ContextMenuItem className=" flex flex-wrap  gap-3 hover:bg-background">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 relative"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          tableMeta?.updateCell(cell.row.index, "color", color);
                        }}
                      >
                        {selectedColor === color && (
                          <Check
                            className="absolute inset-0 m-auto text-white stroke-2"
                            size={20}
                          />
                        )}
                      </div>
                    ))}
                  </ContextMenuItem>
                  {/* <ContextMenuItem>
                    Save Page As...
                    <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                  <ContextMenuItem>Name Window...</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>Developer Tools</ContextMenuItem> */}
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuContent>
          </ContextMenu>
        );
      });
    },
    [table, selection, data, selectedCells, currentCell, mainInputRef.current]
  );

  const onBlurMainInput = () => {
    const tableMeta: any = table.options.meta;
    const updatedValues = Array.from(selectedCells).map((cellId) => {
      const [column, rowIndex] = cellId.split("-");
      return {
        column,
        rowIndex: parseInt(rowIndex || "0", 10),
      };
    });

    updatedValues.forEach(({ column, rowIndex }) => {
      // Update the table model or your data state
      tableMeta?.updateCell(rowIndex, column, mainValue);
      console.log(`Updating cell at column ${column}, row ${rowIndex}`);
    });
  };
  // useEffect(()=>{
  //   getCurrentValue()
  // },[currentCell])

  return (
    <div className="space-y-4 w-full">
      {/* {JSON.stringify(Array.from(selectedCells))} */}
      <div className="rounded-md border w-full">
        <Input
          ref={mainInputRef}
          value={mainValue}
          onChange={(e) => {
            setMainValue(e.target.value);
            if (!currentCell) return; // Early return if currentCell is empty
            const tableMeta: any = table.options.meta;
            // Destructure the column and row index from the currentCell string
            const [column, rowIndexStr] = currentCell.split("-");
            const rowIndex = Number(rowIndexStr);

            // Check if the column and rowIndex are valid
            if (column && !isNaN(rowIndex)) {
              console.log("INDEX --", rowIndex, column);
              // const row = table.getRowModel()?.rows[rowIndex];
              tableMeta?.updateCell(rowIndex, column, e.target.value);
            }
          }}
          autoFocus
          onBlur={onBlurMainInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className="rounded-none border-0
                     focus-visible:ring-1 focus-visible:ring-offset-0 text-sm  mb-1"
        />
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
