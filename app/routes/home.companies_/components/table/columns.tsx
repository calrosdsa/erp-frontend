import ButtonExpandRow from "@/components/custom/button/ButtonExpandRow";
import TableCellDate from "@/components/custom/table/cells/table-cell-date";
import TableCellNameNavigation from "@/components/custom/table/cells/table-cell-name_navigation";
import TableCellNavigate from "@/components/custom/table/cells/table-cell-navigate";
import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRight, FolderIcon, FolderOpenIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";

export const companyColumns = (): ColumnDef<components["schemas"]["CompanyDto"]>[] => {
  const { t,i18n } = useTranslation("common");
  const r = routes
  return [
   
    {
      header: "Name",
      accessorKey: "name",
      cell:({...props})=>{
        const rowData = props.row.original
        return(
          <TableCellNameNavigation
          {...props}
          navigate={(name)=> r.toCompanyDetail(name,rowData.uuid)}
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
