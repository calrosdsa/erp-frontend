

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const orderColumns = ({}:{
}):ColumnDef<components["schemas"]["OrderDto"]>[] =>{
    let columns:ColumnDef<components["schemas"]["OrderDto"]>[] = [];
    const r= routes
    const {t,i18n} = useTranslation("common")
    columns.push({
        accessorKey: "code",
        header:t("form.name"),
        cell:({...props})=>{
            const rowD = props.row.original
            return (
                <TableCellNameNavigation
                {...props}
                navigate={(name)=>{
                    return r.toPurchaseOrderDetail(name,rowD.uuid)
                }}
                />
            )
    }
    });
    columns.push({
        accessorKey: "created_at",
        header:t("table.createdAt"),
        cell:({...props})=><TableCellDate
        {...props}
        i18n={i18n}
        />
    });
    // columns.push({
    //     id: "actions-row",
    //     cell: DataTableRowActions,
    //   })
    return [
        ...columns
    ]
}
