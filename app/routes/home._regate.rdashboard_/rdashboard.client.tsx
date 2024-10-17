import { ChartConfig } from "@/components/ui/chart";
import { Link, useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import BarChartComponent from "@/components/custom/chart/bar-chart";
import { formatterValue, getChartName } from "../home._regate.rdashboard.$chart/util";
import { ChartType, TimeUnit } from "~/gen/common";
import { useTranslation } from "react-i18next";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ReactNode } from "react";
import { routes } from "~/util/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartNoAxesColumn, MoreVertical } from "lucide-react";
import IconButton from "@/components/custom-ui/icon-button";

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
const chartConfig2 = {
  value: {
    label: "Local",
    color: "hsl(var(--chart-4))",
  },
  value2: {
    label: "Eventos",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;
export default function DashboardClient() {
  const { income, incomeAvg, bookingHors, bookingHorsAvg } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const start = format(startOfMonth(new Date()), "MMM d");
  const end = format(endOfMonth(new Date()).toLocaleDateString(), "MMM d");
  return (
    <div className="grid xl:grid-cols-5 gap-3">
      <BarChartComponent
        to={r.torChart(ChartType.INCOME)}
        className="col-span-full"
        title="Ingresos por mes"
        description={`Ingresos recibidos (${start} - ${end})`}
        chartData={income as any[]}
        chartConfig={chartConfig}
        tickFormatter={(value) =>
          getChartName(ChartType.INCOME, TimeUnit.day, value, i18n.language)
        }
        labelFormatter={(value) =>
          getChartName(ChartType.INCOME, TimeUnit.day, value, i18n.language)
        }
        formatter={(value)=>formatterValue(ChartType.INCOME,value.toString(),i18n.language)}

      />

      <BarChartComponent
        title="Ingresos por día"
        className="xl:col-span-2"
        to={r.torChart(ChartType.INCOME_AVG)}
        description={`Ingresos por día (${start} - ${end})`}
        chartData={incomeAvg as any[]}
        chartConfig={chartConfig2}
        tickFormatter={(value) =>
          getChartName(ChartType.INCOME_AVG, TimeUnit.day, value, i18n.language)
        }
        labelFormatter={(value) =>
          getChartName(ChartType.INCOME_AVG, TimeUnit.day, value, i18n.language)
        }
        formatter={(value)=>formatterValue(ChartType.INCOME_AVG,value.toString(),i18n.language)}
      />

      <BarChartComponent
        className="xl:col-span-3"
        to={r.torChart(ChartType.BOOKING_HOUR_AVG)}
        title="Horas reservadas"
        description={`Promedio de horas reservadas (${start} - ${end})`}
        chartData={bookingHorsAvg as any[]}
        chartConfig={chartConfig}
        tickFormatter={(value) =>
          getChartName(ChartType.BOOKING_HOUR_AVG, TimeUnit.hour, value, i18n.language)
        }
        labelFormatter={(value) =>
          getChartName(ChartType.BOOKING_HOUR_AVG, TimeUnit.hour, value, i18n.language)
        }
        formatter={(value)=>formatterValue(ChartType.BOOKING_HOUR_AVG,value.toString(),i18n.language)}

      />

      <BarChartComponent
        to={r.torChart(ChartType.BOOKING_HOUR)}
        className="col-span-full"
        title="Horas reservadas"
        description={`Total de horas reservadas (${start} - ${end})`}
        chartData={bookingHors as any[]}
        chartConfig={chartConfig2}
        tickFormatter={(value) =>
          getChartName(ChartType.BOOKING_HOUR, TimeUnit.day, value, i18n.language)
        }
        labelFormatter={(value) =>
          getChartName(ChartType.BOOKING_HOUR, TimeUnit.day, value, i18n.language)
        }
        formatter={(value)=>formatterValue(ChartType.BOOKING_HOUR,value.toString(),i18n.language)}

      />
    </div>
  );
}
