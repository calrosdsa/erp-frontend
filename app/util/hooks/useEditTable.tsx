
import { useRevalidator } from "@remix-run/react";
import { TableMeta } from "@tanstack/react-table";
import { useState } from "react";

interface Props<T> {
  form: any;
  name:string
  onAddRow:()=>void
}
export default function useEditTable<T>({ form,name,onAddRow }: Props<T>) {
  const revalidator = useRevalidator();
  const [editedRows, setEditedRows] = useState<number[]>([]);
  const updateUpperOrdinals = (index: number) => {
    const upper = editedRows.filter((t) => t > index).map((item) => item - 1);
    setEditedRows([...editedRows.slice(0, index), ...upper]);
    const v = form.getValues()[name];
    const upperAttr = v
      .filter((t: any) => t.ordinal > index)
      .map((t: any) => {
        t.ordinal--;
        return t;
      });
    form.setValue(name, [...v.slice(0, index), ...upperAttr]);
    revalidator.revalidate();
  };
  const options:TableMeta<any> | undefined = {
    editedRows,
    setEditedRows,
    addRow: onAddRow,
    removeRow: (rowIndex: number) => {
      const f = editedRows.filter((item) => item != rowIndex);
      const c = form.getValues();
      const n = c.filter((item: any) => item.ordinal != rowIndex);
      form.setValue("name", n);
      setEditedRows(f);
      updateUpperOrdinals(rowIndex);
    },
  };
  return [options] as const;
}
