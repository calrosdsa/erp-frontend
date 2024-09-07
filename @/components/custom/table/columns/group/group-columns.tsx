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
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const groupColumns = ({}:{
}):ColumnDef<components["schemas"]["GroupDto"]>[] =>{

    let columns:ColumnDef<components["schemas"]["GroupDto"]>[] = [];
    const r= routes
    const {t,i18n} = useTranslation("common")
    columns.push({
        accessorKey: "name",
        header:t("form.name"),
        cell:({...props})=><TableCellNameNavigation
        {...props}
        navigate={(name)=>{
            return r.buying
        }}
        />
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
