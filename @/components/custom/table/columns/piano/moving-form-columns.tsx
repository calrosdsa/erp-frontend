
import { ColumnDef, NoInfer } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { ChartType, chartTypeToJSON, TimeUnit } from "~/gen/common";
import TableCellPrice from "../../cells/table-cell-price";
import { DEFAULT_CURRENCY } from "~/constant";
import { getChartName } from "~/routes/home._regate.rdashboard.$chart/util";
import { fullName } from "~/util/convertor/convertor";

export const movingFormColumns = ({}:{
}):ColumnDef<components["schemas"]["PianoForm"]>[] =>{

    let columns:ColumnDef<components["schemas"]["PianoForm"]>[] = [];
    const r= routes
    const {t,i18n} = useTranslation("common")

    columns.push({
        id:"customer",
        header: t("form.name"),
        cell:({...props})=>{
            const rowData = props.row.original
            const customer =  fullName(rowData.first_name,rowData.last_name)
            return (
                <TableCellNameNavigation {...props} 
                navigate={(name)=>r.toPartyDetail("relocationAndMoving",customer,{
                    id:rowData.id.toString(),
                    info:"info"
                })}         
                name={customer}
                />
            )
        }
    });

    columns.push({
        accessorKey: "email",
        header: t("form.email"),
    });

    columns.push({
        accessorKey: "phone_number",
        header: t("form.phoneNumber"),
    });

    columns.push({
        accessorKey: "dropoff_city",
        header: t("form.dropoffCity"),
    });

    columns.push({
        accessorKey: "pickup_city",
        header: t("form.pickupCity"),
    });


    columns.push({
        accessorKey: "moving_date",
        header: t("form.movingDate"),
        cell:({...props}) => {
            return <TableCellDate
            {...props}
            i18n={i18n}
            formatDate="medium"
            />
        }
    });

  

    
    return [
        ...columns
    ]
}
