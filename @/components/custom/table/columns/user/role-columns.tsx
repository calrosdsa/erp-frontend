import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import i18n from "~/i18n";
import TableCellNavigate from "../../cells/table-cell-navigate";
import { routes } from "~/util/route";
import TableCellEntityActions from "../../cells/table-cell-entity-actions";
import { DataTableRowActions } from "../../data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { z } from "zod";
import { roleActionSelected } from "~/util/data/schemas/manage/role-schema";
import { components } from "~/sdk";

export const roleEntitiesActionColumns = ({roleActions}:{
    roleActions:components["schemas"]["RoleActions"][]
}):ColumnDef<components["schemas"]["EntityActions"]>[] =>{

    let roleActionsIds= roleActions.map(item=>item.ActionID)
    let columns:ColumnDef<components["schemas"]["EntityActions"]>[] = [];
    const r= routes
    const {t} = useTranslation("common")
    columns.push({
        accessorKey: "entity.Name",
        header:t("entity"),
        id: "entityName",
    });
    columns.push({
        accessorKey: "actions",
        header:t("action"),
        cell:({...props})=><TableCellEntityActions
        {...props}
        roleActions={roleActionsIds}
        />
    });
    columns.push({
        id: "actions-row",
        cell: DataTableRowActions,
      })
    return [
        ...columns
    ]
}

export const roleActionColumns = ({selected,setSelected}:{
    selected:z.infer<typeof roleActionSelected>[]
    setSelected:(e:z.infer<typeof roleActionSelected>[])=>void
}):ColumnDef<components["schemas"]["Action"]>[] =>{

    let columns:ColumnDef<components["schemas"]["Action"]>[] = [];
    
    const r= routes
    const {t} = useTranslation("common")
    columns.push({
        accessorKey: "ID",
        id: "id",
    });
    columns.push({
        accessorKey: "Name",
        header:t("action"),
        id: "name",
    });
    columns.push({
        id: "select",
        cell: ({ row }) =>  {
            const id = row.getValue("id") as number
            return (
                <Checkbox
                checked={selected.find(t=>t.actionId == id)?.selected}
                onCheckedChange={(value) =>{
                    const n = selected.map(t=>{
                        if(t.actionId == id){
                            if(typeof value == "boolean"){
                                t.selected = value
                            }
                        }
                        return t
                    })
                    setSelected(n)
                    }}
                aria-label="Select row"
                />
            )
        }
    })
    return [
        ...columns
    ]
}

export const roleDefinitionColumns = ({}):ColumnDef<components["schemas"]["RoleActions"]>[] =>{
    let columns:ColumnDef<components["schemas"]["RoleActions"]>[] = [];
    const r= routes
    const {t} = useTranslation("common")
    columns.push({
        accessorKey: "Action.Entity.Name",
        header:t("entity"),
        id: "entityName",
    });

    columns.push({
        accessorKey: "Action.Name",
        header:t("action"),
        id: "actionName",
    });
    return [
        ...columns
    ]
}

export const roleColumns = ({}):ColumnDef<components["schemas"]["Role"]>[] =>{
    let columns:ColumnDef<components["schemas"]["Role"]>[] = [];
    const r= routes
    const {t,i18n} = useTranslation("common")
    columns.push({
        accessorKey: "ID",
        id:"id"
    });
    columns.push({
        accessorKey: "Code",
        header:t("_role.base"),
        id: "code",
        cell:({...props}) => <TableCellNavigate
        {...props}
        navigate={(name,id)=>r.toRoleDetail(name,id)}
        id="id"
        />
    });

    columns.push({
        accessorKey: "Description",
    });
    columns.push({
        accessorKey: "CreatedAt",
        header:t("table.createdAt"),
        cell: ({...props}) => <TableCellDate {...props} i18n={i18n}/>
    });
    return [
        ...columns
    ]
}