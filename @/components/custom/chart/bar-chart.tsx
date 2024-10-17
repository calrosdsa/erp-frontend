import { ExternalLinkIcon, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  Formatter,
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
export const description = "A stacked bar chart with a legend";
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]
// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig

export default function BarChartComponent({
  chartData,
  chartConfig,
  className,
  tickFormatter,
  labelFormatter,
  formatter,
  height = 300,
  title,
  description,
  to
}: {
  chartData: any[];
  title?: string;
  to?:string
  description?: string;
  chartConfig: ChartConfig;
  height?: number;
  className?: string;
  tickFormatter?: ((value: any, index: number) => string) | undefined;
  labelFormatter?:
    | ((label: any, payload: Payload<ValueType, NameType>[]) => ReactNode)
    | undefined;
  formatter:(e:ValueType)=>string;
}) {
  const { i18n } = useTranslation();

  const [activeCharts, setActiveCharts] = useState<string[]>([
    "value",
    "value2",
  ]);
  const total = useMemo(
    () => ({
      value: chartData.reduce((acc, curr) => acc + curr.value, 0),
      value2: chartData.reduce((acc, curr) => acc + curr.value2, 0),
    }),
    []
  );
  return (
    <div className={cn(className, "")}>
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3 sm:py-4">
            {title && 
            <div className="flex items-center space-x-3">
              {to ?
              <Link className=" underline" to={to}>
                <CardTitle>{title}</CardTitle>
              </Link>
              :
              <CardTitle>{title}</CardTitle>
            }
            </div>
            }
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex">
            {["value", "value2"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <Button
                  variant={"ghost"}
                  key={chart}
                  size={"display"}
                  data-active={activeCharts.includes(chart)}
                  className={cn(
                    `relative  flex flex-1 flex-col justify-center gap-1 border-t 
                  text-left even:border-l sm:border-l 
                  sm:border-t-0`,
                    activeCharts.includes(chart) && "bg-muted"
                  )}
                  onClick={() => {
                    if (activeCharts.includes(chart)) {
                      const f = activeCharts.filter((t) => t != chart);
                      setActiveCharts(f);
                    } else {
                      setActiveCharts([...activeCharts, chart]);
                    }
                  }}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart]?.label}
                  </span>
                  <span className="text-base font-bold leading-none sm:text-xl">
                    {formatter(total[key as keyof typeof total])}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ResponsiveContainer height={height} width="100%">
            <ChartContainer config={chartConfig satisfies ChartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={tickFormatter}
                />
  
                <ChartTooltip
                  content={
                    <ChartTooltipContent 
                    labelFormatter={labelFormatter} 
                    formatter={(value,name)=>{
                      return (
                        <div className="flex space-x-1">
                         {chartConfig[name]?.label} {formatter(value)}
                        </div>
                      )
                    }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                {activeCharts.includes("value") && (
                  <Bar
                    dataKey="value"
                    stackId="a"
                    fill="var(--color-value)"
                    radius={[0, 0, 4, 4]}
                  />
                )}
                {activeCharts.includes("value2") && (
                <Bar
                  dataKey="value2"
                  stackId="a"
                  fill="var(--color-value2)"
                  radius={[4, 4, 0, 0]}
                />
              )}
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
