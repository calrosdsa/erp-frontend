import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Column, Getter, Row, Table } from "@tanstack/react-table";

export interface DisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  getValue: Getter<any>;
  row: Row<any>;
  column: Column<any, unknown>;
  table: Table<any>;
  name?:string
}

const TableCellBase = React.forwardRef<HTMLDivElement, DisplayProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn(className, "flex flex-col")} ref={ref} {...props}>
        <span className="text-xs">{props.getValue() || props.name || "-"}</span>
      </div>
    );
  }
);

TableCellBase.displayName = "TableCellBase";

export { TableCellBase };
