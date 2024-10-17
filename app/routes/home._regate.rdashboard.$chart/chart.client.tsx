import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { ChartConfig } from "@/components/ui/chart";
import BarChartComponent from "@/components/custom/chart/bar-chart";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/custom/table/CustomTable";
import {
  ChartType,
  chartTypeFromJSON,
  chartTypeToJSON,
  timeUnitFromJSON,
} from "~/gen/common";
import { chartColumns } from "@/components/custom/table/columns/regate/chart-column";
import { getChartName } from "./util";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ChartHeader from "./components/chart-header";

export default function ChartDataClient() {
  const { chartData } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation("common");
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const timeUnit = timeUnitFromJSON(searchParams.get("time_unit"));
  const chart = chartTypeFromJSON(params.chart);
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
  return (
    <div className="">
      <Card className="">
        <CardHeader>
            <ChartHeader/>
        </CardHeader>
        <CardContent>
          <BarChartComponent
            chartConfig={chartConfig}
            chartData={chartData as any[]}
            tickFormatter={(value) =>
              getChartName(chart, timeUnit, value, i18n.language)
            }
            labelFormatter={(value) =>
              getChartName(chart, timeUnit, value, i18n.language)
            }
          />
        </CardContent>

        <CardFooter className="w-full">
          <DataTable
            data={chartData || []}
            columns={chartColumns({
              chartType: chart,
              timeUnit: timeUnit,
            })}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
