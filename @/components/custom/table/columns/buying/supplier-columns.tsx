
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import TableCellStatus from "../../cells/table-cell-status";
import { TableCellBase } from "../../cells/table-cell";

export const supplierColumns = ({
    setParams,
  }: {
    setParams: (params: Record<string, any>) => void
  }):ColumnDef<components["schemas"]["SupplierDto"]>[] =>{

    let columns:ColumnDef<components["schemas"]["SupplierDto"]>[] = [];
    const r= route
    const {t,i18n} = useTranslation("common")
    columns.push( {
        accessorKey: "name",
        header: t("form.name"),
        cell: ({ ...props }) => {
          const rowData = props.row.original;
          return (
            <TableCellBase
              className="font-semibold underline cursor-pointer"
              {...props}
              onClick={() =>
                  setParams({
                    [route.supplier]:rowData.id
                  })
              }
            />
          )
        },
      },);
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
