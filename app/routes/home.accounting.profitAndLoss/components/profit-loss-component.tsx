import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { useOutletContext, useSearchParams } from "@remix-run/react";
import { GlobalState } from "~/types/app";
import { DEFAULT_CURRENCY } from "~/constant";
import { formatCurrency } from "~/util/format/formatCurrency";
import { AccountType, accountTypeToJSON } from "~/gen/common";

type GroupingOption = "month" | "year";

interface ProfitLossEntry {
  account_type: string;
  account_name: string;
  posting_date: string;
  balance: number;
}

interface ProfitLossStatementProps {
  data: ProfitLossEntry[];
  startDate: string;
  endDate: string;
  timeUnit: string;
}

export const ProfitLossStatement: React.FC<ProfitLossStatementProps> = ({
  data,
  startDate,
  endDate,
  timeUnit,
}) => {
  const { t,i18n } = useTranslation("common");
  const {companyDefaults} = useOutletContext<GlobalState>()
  const currency = companyDefaults?.currency || DEFAULT_CURRENCY
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams()
  const grouping = searchParams.get("timeUnit") || "month"

  const group = (groupBy: string) => {
    const groupedData = data.reduce<{
      [key: string]: { [key: string]: number };
    }>((acc, entry) => {
      const groupKey =
        groupBy === "month"
          ? entry.posting_date.slice(0, 7) // "YYYY-MM"
          : entry.posting_date.slice(0, 4); // "YYYY"

      if (!acc[entry.account_type]) {
        acc[entry.account_type] = {};
      }

      if (!acc[entry.account_type]![groupKey]) {
        acc[entry.account_type]![groupKey] = 0;
      }

      if (acc[entry.account_type]) {
        acc[entry.account_type]![groupKey] =
          (acc[entry.account_type]![groupKey] ?? 0) + entry.balance;
      }

      return acc;
    }, {});

    return groupedData;
  };

  const toggleGroup = (accountType: string) => {
    setExpandedGroups((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(accountType)) {
        newExpanded.delete(accountType);
      } else {
        newExpanded.add(accountType);
      }
      return newExpanded;
    });
  };

  const periods = useMemo(() => {
    const periods: string[] = [];
    const currentDate = new Date(startDate);
    const toDate = new Date(endDate);
    while (currentDate <= toDate) {
      const period =
        grouping === "month"
          ? currentDate.toISOString().slice(0, 7)
          : currentDate.getFullYear().toString();
      if (!periods.includes(period)) {
        periods.push(period);
      }

      currentDate.setMonth(
        currentDate.getMonth() + (grouping === "month" ? 1 : 12)
      );
    }

    return periods;
  }, [startDate, endDate, grouping]);

  const groupedData = useMemo(() => group(grouping), [data, grouping]);

  const accountTypes = useMemo(() => {
    return Array.from(new Set(data.map((entry) => entry.account_type)));
  }, [data]);

  // const formatAmount = (amount: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(amount);
  // };

  const renderAccountTypeRow = (accountType: string) => {
    const isExpanded = expandedGroups.has(accountType);
    return (
      <React.Fragment key={accountType}>
        <TableRow
          className="hover:bg-muted/50 cursor-pointer"
          onClick={() => toggleGroup(accountType)}
        >
          <TableCell className="font-medium">
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="mr-2 h-4 w-4" />
              ) : (
                <ChevronRight className="mr-2 h-4 w-4" />
              )}
              {t(accountType)}
            </div>
          </TableCell>
          {periods.map((period) => (
            <TableCell key={period} className="text-right">
              {formatCurrency(groupedData[accountType]?.[period] || 0,currency,i18n.language)}
            </TableCell>
          ))}
        </TableRow>
        {isExpanded &&
          data
            .filter((entry) => entry.account_type === accountType)
            .map((entry, index) => (
              <TableRow key={`${accountType}-${index}`} className="bg-muted/50">
                <TableCell className="pl-8">{entry.account_name}</TableCell>
                {periods.map((period) => (
                  <TableCell key={period} className="text-right">
                    {grouping === "month"
                      ? period === entry.posting_date.slice(0, 7)
                        ? formatCurrency(entry.balance,currency,i18n.language)
                        : "-"
                      : period === entry.posting_date.slice(0, 4)
                      ? formatCurrency(entry.balance,currency,i18n.language)
                      : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
      </React.Fragment>
    );
  };

  const calculateTotalForPeriod = (accountType: string, period: string) => {
    return groupedData[accountType]?.[period] || 0;
  };

  const calculateGrossProfit = (period: string) => {
    const revenue = calculateTotalForPeriod("SALES_REVENUE", period);
    const costOfSales = calculateTotalForPeriod("COST_OF_GOODS_SOLD", period);
    return revenue + costOfSales; // Note: costOfSales is negative
  };

  const calculateOperatingProfit = (period: string) => {
    const grossProfit = calculateGrossProfit(period);
    const operatingExpenses = calculateTotalForPeriod(
      "OPERATING_EXPENSES",
      period
    );
    return grossProfit + operatingExpenses; // Note: operatingExpenses is negative
  };

  const chartData = useMemo(() => {
    return periods.map((period) => ({
      name: grouping === "month" ? period.slice(0, 7) : period,
      revenue: calculateTotalForPeriod("SALES_REVENUE", period),
      costOfSales: calculateTotalForPeriod("COST_OF_GOODS_SOLD", period),
      grossProfit: calculateGrossProfit(period),
    }));
  }, [periods, grouping, groupedData]);

  return (
    <ScrollArea className="max-w-[1500px] whitespace-nowrap border">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("profitAndLoss")}</CardTitle>
          
        </CardHeader>
        <CardContent>
          <ScrollBar orientation="horizontal" />

          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              costOfSales: {
                label: "Cost of Sales",
                color: "hsl(var(--chart-2))",
              },
              grossProfit: {
                label: "Gross Profit",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px] w-full mb-8"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="costOfSales"
                  stroke="var(--color-costOfSales)"
                  name="Cost of Sales"
                />
                <Line
                  type="monotone"
                  dataKey="grossProfit"
                  stroke="var(--color-grossProfit)"
                  name="Gross Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Cuenta</TableHead>
                {periods.map((period) => (
                  <TableHead key={period} className="text-right">
                    {grouping === "month" ? period.slice(0, 7) : period}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderAccountTypeRow("SALES_REVENUE")}
              {renderAccountTypeRow("COST_OF_GOODS_SOLD")}

              <TableRow className="font-bold">
                <TableCell>Utilidad o pérdida bruta</TableCell>
                {periods.map((period) => (
                  <TableCell key={period} className="text-right">
                    {formatCurrency(calculateGrossProfit(period),currency,i18n.language)}
                  </TableCell>
                ))}
              </TableRow>

              {renderAccountTypeRow("OPERATING_EXPENSES")}

              <TableRow className="font-bold">
                <TableCell>Utilidad o pérdida en operaciones  (EBIT)</TableCell>
                {periods.map((period) => (
                  <TableCell key={period} className="text-right">
                    {formatCurrency(calculateOperatingProfit(period),currency,i18n.language)}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="font-bold">
                <TableCell>Utilidad antes de Impuesto (EBT)</TableCell>
                {periods.map((period) => (
                  <TableCell key={period} className="text-right">
                    {formatCurrency(calculateOperatingProfit(period),currency,i18n.language)}
                  </TableCell>
                ))}
              </TableRow>


              {renderAccountTypeRow(accountTypeToJSON(AccountType.TAX_EXPENSE))}
              
              <TableRow className="font-bold">
                <TableCell>Ganancia/pérdida neta</TableCell>
                {periods.map((period) => (
                  <TableCell key={period} className="text-right">
                    {formatCurrency(
                      Object.values(groupedData).reduce(
                        (sum, accountType) => sum + (accountType[period] || 0),
                        0
                      ),currency,i18n.language
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ProfitLossStatement;
