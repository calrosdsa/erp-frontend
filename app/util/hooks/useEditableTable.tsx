import { useRevalidator } from "@remix-run/react";
import { TableMeta } from "@tanstack/react-table";
import { useState } from "react";

interface Props<T> {
  form: any;
}
export default function useEditableTable<T>({ form }: Props<T>) {
  const revalidator = useRevalidator();
  const [editedRows, setEditedRows] = useState<number[]>([]);
  const updateUpperOrdinals = (index: number) => {
    const upper = editedRows.filter((t) => t > index).map((item) => item - 1);
    setEditedRows([...editedRows.slice(0, index), ...upper]);
    const v = form.getValues().lines;
    const upperAttr = v
      .filter((t: any) => t.ordinal > index)
      .map((t: any) => {
        t.ordinal--;
        return t;
      });
    form.setValue("lines", [...v.slice(0, index), ...upperAttr]);
    revalidator.revalidate();
  };
  const options:TableMeta<any> | undefined = {
    editedRows,
    setEditedRows,
    addRow: () => {
      let c = form.getValues().lines;
      const n = {
        value: "",
        ordinal: c.length,
        abbreviation: "",
      };
      setEditedRows((t) => [...t, editedRows.length]);
      c.push(n);
      form.setValue("lines", c, { shouldValidate: true });
      revalidator.revalidate();
    },
    removeRow: (rowIndex: number) => {
      const f = editedRows.filter((item) => item != rowIndex);
      const c = form.getValues().lines;
      const n = c.filter((item: any) => item.ordinal != rowIndex);
      form.setValue("lines", n);
      setEditedRows(f);
      updateUpperOrdinals(rowIndex);
    },
    updateData: (rowIndex: number, columnId: string, value: string) => {
      const n = form.getValues().lines.map((item: any,idx:number) => {
        if(idx == rowIndex){
          item[columnId] = value;
        }
      
        return item;
      });
      form.setValue("lines", n);
      revalidator.revalidate();
    },
  };
  return [options] as const;
}
