import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export interface DisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  getValue: Getter<any>;
  row: Row<any>;
  column: Column<any, unknown>;
  table: Table<any>;
  name?: string;
  cellType?: "date" | "datetime" | "text" | "boolean";
  displayValueFormatter?: (value: any) => React.ReactNode;
}

const TableCellBase = React.forwardRef<HTMLDivElement, DisplayProps>(
  ({ className, displayValueFormatter, cellType="text", ...props }, ref) => {
    const renderDisplayValue = (value: any) => {
      if (displayValueFormatter) {
        return displayValueFormatter(value);
      }

      if (value === undefined || value === null || value === "") {
        return <span className="text-muted-foreground">No proporcionado</span>;
      }

      switch (cellType) {
        case "boolean":
          return value ? "Si" : "No";
        case "date":
          return format(toZonedTime(value, "UTC"), "yyyy-MM-dd");
        case "datetime":
          return format(toZonedTime(value, "UTC"), "PPp");
        default:
          return value;
      }
    };
    return (
      <div className={cn(className, "flex flex-col")} ref={ref} {...props}>
        <span className="text-xs truncate">
          {renderDisplayValue(props.getValue() || props.name || "-")}
        </span>
      </div>
    );
  }
);

TableCellBase.displayName = "TableCellBase";

export { TableCellBase };
