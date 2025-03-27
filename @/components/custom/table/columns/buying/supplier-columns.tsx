
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import TableCellStatus from "../../cells/table-cell-status";

export const supplierColumns = ({}:{
}):ColumnDef<components["schemas"]["SupplierDto"]>[] =>{

    let columns:ColumnDef<components["schemas"]["SupplierDto"]>[] = [];
    const r= route
    const {t,i18n} = useTranslation("common")
    columns.push({
        accessorKey: "name",
        header:t("form.name"),
        cell:({...props})=>{
            const rowD = props.row.original
            return (
                <TableCellNameNavigation
                {...props}
                navigate={(name)=>{
                    return r.toRoute({
                        main:partyTypeToJSON(PartyType.supplier),
                        routePrefix:[r.buyingM],
                        routeSufix:[name],
                        q:{
                            tab:"info",
                            id:rowD.id.toString(),
                        }
                    })
                }}
                />
            )
    }
    });
    columns.push({
        accessorKey: "status",
        header: t("form.status"),
        cell: TableCellStatus,
    })

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
