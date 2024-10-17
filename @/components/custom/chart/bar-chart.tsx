
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { ReactNode } from "react"
export const description = "A stacked bar chart with a legend"
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
    chartData,chartConfig,className,
    tickFormatter,
    labelFormatter,
}:{
    chartData:any[],
    chartConfig:any 
    className?:string
    tickFormatter: ((value: any, index: number) => string) | undefined
    labelFormatter?: ((label: any, payload: Payload<ValueType, NameType>[]) => ReactNode) | undefined
}){
    const {i18n} = useTranslation()
    return (
        <div className={cn(className,"")}>

        <Card className="">
      {/* <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent>
            <ResponsiveContainer  height={350} width="100%" >
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
            <ChartTooltip content={<ChartTooltipContent 
             labelFormatter={labelFormatter}
            />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="value"
              stackId="a"
              fill="var(--color-value)"
              radius={[0, 0, 4, 4]}
              />
            <Bar
              dataKey="value2"
              stackId="a"
              fill="var(--color-value2)"
              radius={[4, 4, 0, 0]}
              />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
              </div>
    )
}