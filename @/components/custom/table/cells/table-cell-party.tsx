import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
    partyName:string
    partyUuid:string
    partyType:string
}

export default function TableCellStatus<TData>({ getValue, row, column, table,
    partyName,partyUuid
}:TableCellProps<TData>) {
  return (
        <>
        
        </>      
  );
};