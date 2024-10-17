
import {
  ChartConfig,
} from "@/components/ui/chart"
import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import BarChartComponent from "@/components/custom/chart/bar-chart"
import ChartDisplay from "@/components/custom/chart/chart-display"
import { getChartName } from "../home._regate.rdashboard.$chart/util"
import { ChartType, TimeUnit } from "~/gen/common"
import { useTranslation } from "react-i18next"
import { endOfMonth, format, startOfMonth } from "date-fns"

const chartConfig = {
  value: {
    label: "Local",
    color: "hsl(var(--chart-1))",
  },
  value2: {
    label: "Eventos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
export default function DashboardClient(){
  const {income,incomeAvg} =  useLoaderData<typeof loader>()
  const {t,i18n} = useTranslation("common")
  const start = format(startOfMonth(new Date()),"MMM d")
  const end = format(endOfMonth(new Date()).toLocaleDateString(),"MMM d")
    return (
        <div className="grid grid-cols-2 gap-3">
          <ChartDisplay title="Ingresos por mes"
          description={`Ingresos recibidos (${start} - ${end})`}>
            <BarChartComponent
            chartData={income}
            chartConfig={chartConfig}
            tickFormatter={(value)=>getChartName(ChartType.INCOME, TimeUnit.day, value, i18n.language)}
            />
          </ChartDisplay>

          <ChartDisplay title="Ingresos por día" 
          description={`Ingresos por día (${start} - ${end})`}>
            <BarChartComponent
            chartData={incomeAvg}
            chartConfig={chartConfig}
            tickFormatter={(value)=>getChartName(ChartType.INCOME_AVG, TimeUnit.day, value, i18n.language)}
            />
          </ChartDisplay>
        </div>
    )
}