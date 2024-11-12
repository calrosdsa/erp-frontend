import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route-admin";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import TableCellDate from "../../cells/table-cell-date";
import TableCellIndex from "../../cells/table-cell-index";

export const aCompanyColumns = (): ColumnDef<components["schemas"]["CompanyDto"]>[] => {
    const { t,i18n } = useTranslation("common");
    const r = routes
    return [
     {
      header:t("form.no"),
      cell:TableCellIndex
     },
      {
        header: "Name",
        accessorKey: "name",
        cell:({...props})=>{
          const rowData = props.row.original
          return(
            <TableCellNameNavigation
            {...props}
            navigate={(name)=> r.toRoute({
                main:partyTypeToJSON(PartyType.company),
                routeSufix:[name],
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
        accessorKey: "created_at",
        header: t("table.createdAt"),
        cell:({...props})=><TableCellDate
        {...props}
        i18n={i18n}
        />
      },
    ];
  };
  

export const aCompanyModulesColumns = (): ColumnDef<components["schemas"]["CompanyEntityDto"]>[] => {
    const { t,i18n } = useTranslation("common");
    const r = routes
    return [
      {
        header:t("form.no"),
        cell:TableCellIndex
       },
      {
        header:t("form.name"),
        accessorKey: "name",
        cell:({...props})=>{
          const rowData = props.row.original
          return(
            <div>
              {rowData.entity_name}
            </div>
          )
        }
      },
    ];
  };


  export const aCompanyUserColumns = (): ColumnDef<components["schemas"]["UserDto"]>[] => {
    const { t,i18n } = useTranslation("common");
    const r = routes
    return [
      {
        header:t("form.no"),
        cell:TableCellIndex
       },
      {
        header:t("form.email"),
        accessorKey: "identifier",
        cell:({...props})=>{
          const rowData = props.row.original
          return(
            <div>
              {rowData.identifier}
            </div>
          )
        }
      },
    ];
  };
  
  