import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

type Option = {
  label: string;
  value: string;
};
interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
}

export default function TableCell<TData>({ getValue, row, column, table }:TableCellProps<TData>) {
  const initialValue = getValue();
  const columnMeta:any = column.columnDef.meta;
  const tableMeta:any = table.options.meta;
  const [value, setValue] = useState(initialValue);
  //   const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    // displayValidationMessage(e);
    tableMeta?.updateCell(row.index, column.id, value, e.target.validity.valid);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // displayValidationMessage(e);
    setValue(e.target.value);
    tableMeta?.updateCell(row.index, column.id, e.target.value, e.target.validity.valid);
  };

//   const displayValidationMessage = <
//     T extends HTMLInputElement | HTMLSelectElement
//   >(
//     e: ChangeEvent<T>
//   ) => {
//     if (columnMeta?.validate) {
//       const isValid = columnMeta.validate(e.target.value);
//       if (isValid) {
//         e.target.setCustomValidity("");
//         setValidationMessage("");
//       } else {
//         e.target.setCustomValidity(columnMeta.validationMessage);
//         setValidationMessage(columnMeta.validationMessage);
//       }
//     } else if (e.target.validity.valid) {
//       setValidationMessage("");
//     } else {
//       setValidationMessage(e.target.validationMessage);
//     }
//   };

  // if (tableMeta?.editedRows.includes(row.index)) {
  if (tableMeta?.updateCell) {
    return <Input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={onBlur}
    step={".01"}
    className="h-[28px] bg-background"
    // placeholder={columnMeta?.type}
    type={columnMeta?.type || "text"}
    required={columnMeta?.required}
    // pattern={columnMeta?.pattern}
    min={0}
    // title={"validationMessage"}
  />
  }
  return <span>{value}</span>;
};