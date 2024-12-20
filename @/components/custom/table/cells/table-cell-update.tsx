import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

type Option = {
  label: string;
  value: string;
};
interface TableCellProps<TData> {
  getValue: Getter<any>;
  row: Row<TData>;
  column: Column<TData, unknown>;
  table: Table<TData>;
  onCellUpdate: (row: number, column: string, value: string) => void;
}

export default function TableCell<TData>({
  getValue,
  row,
  column,
  table,
  onCellUpdate,
}: TableCellProps<TData>) {
  const initialValue = getValue();
  const columnMeta: any = column.columnDef.meta;
  const tableMeta: any = table.options.meta;
  const [value, setValue] = useState(initialValue);
  //   const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // displayValidationMessage(e);
    onCellUpdate(row.index, column.id, value);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // displayValidationMessage(e);
    setValue(e.target.value);
    onCellUpdate(row.index, column.id, e.target.value);
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
  if (columnMeta?.inputType == "textarea") {
    return (
      <AutosizeTextarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className=" bg-background text-xs border-none"
        maxHeight={100}
        // placeholder={columnMeta?.type}
        required={columnMeta?.required}
      />
    );
  }
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      step={".01"}
      className="h-full bg-background border-none text-xs "
      // placeholder={columnMeta?.type}
      type={columnMeta?.type || "text"}
      required={columnMeta?.required}
      // pattern={columnMeta?.pattern}
      min={0}
      // title={"validationMessage"}
    />
  );
  //   return <span>{value}</span>;
}
