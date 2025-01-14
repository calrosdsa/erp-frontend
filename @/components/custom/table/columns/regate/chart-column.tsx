
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { ChartType, chartTypeToJSON, TimeUnit } from "~/gen/common";
import TableCellPrice from "../../cells/table-cell-price";
import { DEFAULT_CURRENCY } from "~/constant";
import { getChartName } from "~/routes/home._regate.bookingDashboard.$chart/util";

export const chartColumns = ({chartType,timeUnit}:{
    chartType:ChartType,
    timeUnit:TimeUnit,
}):ColumnDef<components["schemas"]["ChartDataDto"]>[] =>{

    let columns:ColumnDef<components["schemas"]["ChartDataDto"]>[] = [];
    const r= route
    const {t,i18n} = useTranslation("common")
    columns.push({
        accessorKey: "name",
        header:t("form.name"),
        cell:({...props})=>{
            const rowData = props.row.original
            return (
                <div>
                    {getChartName(chartType,timeUnit,rowData.name,i18n.language)}
                </div>
            )
    }
    });
    columns.push({
        accessorKey:"value",
        header:t("form.amount"),
        cell:({...props})=><TableCellPrice
        {...props}
        i18n={i18n}
        currency={DEFAULT_CURRENCY}
        />
    });

    columns.push({
        accessorKey:"value2",
        header:t("form.amount"),
        cell:({...props})=><TableCellPrice
        {...props}
        i18n={i18n}
        currency={DEFAULT_CURRENCY}
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
