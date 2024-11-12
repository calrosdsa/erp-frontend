import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route-admin";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { PartyAdminType, partyAdminTypeFromJSON, partyAdminTypeToJSON } from "~/gen/common";
import TableCellDate from "../../cells/table-cell-date";

export const roleTemplateColumns = (): ColumnDef<components["schemas"]["RoleTemplateDto"]>[] => {
    const { t,i18n } = useTranslation("common");
    const r = routes
    return [
      {
        header:t("table.no"),
        cell:TableCellIndex
       },
      {
        header:t("form.name"),
        accessorKey: "name",
        cell:({...props})=>{
          const rowData = props.row.original
          return(
            <TableCellNameNavigation
            {...props}
            navigate={(name)=>r.toRoute({
                main:partyAdminTypeToJSON(PartyAdminType.roleTemplate),
                routeSufix:[rowData.name],
                q:{
                    tab:"info",
                    id:rowData.id.toString()
                }
            })}
            />
          )
        }
      },
      {
        header:t("table.createdAt"),
        accessorKey: "created_at",
        cell:({...props})=>{
          const rowData = props.row.original
          return(
            <TableCellDate
            {...props}
            i18n={i18n}
            formatDate="medium"
            />
          )
        }
      },
    ];
  };