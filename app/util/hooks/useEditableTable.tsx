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
    const v = form.getValues().values;
    const upperAttr = v
      .filter((t: any) => t.ordinal > index)
      .map((t: any) => {
        t.ordinal--;
        return t;
      });
    form.setValue("values", [...v.slice(0, index), ...upperAttr]);
    revalidator.revalidate();
  };
  const options:TableMeta<any> | undefined = {
    editedRows,
    setEditedRows,
    addRow: () => {
      let c = form.getValues().values;
      const n = {
        value: "",
        ordinal: c.length,
        abbreviation: "",
      };
      setEditedRows((t) => [...t, editedRows.length]);
      c.push(n);
      form.setValue("values", c, { shouldValidate: true });
      revalidator.revalidate();
    },
    removeRow: (rowIndex: number) => {
      const f = editedRows.filter((item) => item != rowIndex);
      const c = form.getValues().values;
      const n = c.filter((item: any) => item.ordinal != rowIndex);
      form.setValue("values", n);
      setEditedRows(f);
      updateUpperOrdinals(rowIndex);
    },
    updateData: (rowIndex: number, columnId: string, value: string) => {
      const n = form.getValues().values.map((item: any) => {
        item[columnId] = value;
        //   switch (columnId) {
        //     case "value": {
        //       item.value = value;
        //       break
        //     }
        //     case "value": {
        //       item.abbreviation = value;
        //       break;
        //     }
        //   }
        return item;
      });
      form.setValue("values", n);
      revalidator.revalidate();
    },
  };
  return [options] as const;
}
