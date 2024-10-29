import { useState, useEffect, ChangeEvent } from "react";
import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { i18n } from "i18next";
import { Badge } from "@/components/ui/badge";
import { components } from "~/sdk";


interface TableCellProps<TData> {
    getValue:Getter<any>
    row:Row<TData>,
    column: Column<TData, unknown>
    table:Table<TData>
    roleActions:number[]
}

export default function TableCellEntityActions<TData>({ getValue, row, column, table,roleActions }:TableCellProps<TData>) {
  const initialValue = getValue();
  const [actions,setActions] = useState<components["schemas"]["ActionDto"][]>([])
  const parseActions = () =>{
    try{
        // const d = JSON.parse(initialValue) as components["schemas"]["Action"][]
        setActions(initialValue)
    }catch(err){
        console.log(err)
    }
  }
  useEffect(()=>{
    parseActions()
  },[initialValue])
  return (
    <div className=" flex-wrap gap-x-3 space-x-2">
        {typeof initialValue != "undefined" &&
        (initialValue as components["schemas"]["ActionDto"][] || []).map((item,idx)=>{
            return (
                <Badge
                key={idx}
                variant={roleActions.includes(item.id)?"default":"outline"}
                >{item.name}</Badge>
            )
        })
        }
    </div>
  );
};