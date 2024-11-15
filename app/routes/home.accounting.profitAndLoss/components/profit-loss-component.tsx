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
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";
import { AccountType, accountTypeToJSON } from "~/gen/common";
import { Separator } from "@/components/ui/separator";
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

type GroupingOption = "month" | "year";

type AccountEntry = {
  account_type: string;
  account_name: string;
  posting_date: string;
  credit: number;
  debit: number;
};

interface ProfitLossStatementProps {
  data: AccountEntry[];
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
  const [grouping, setGrouping] = useState<GroupingOption>(
    timeUnit as GroupingOption
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const group = (groupBy: GroupingOption) => {
    const groupedData = data.reduce<{
      [key: string]: { [key: string]: { debit: number; credit: number } };
    }>((acc, entry) => {
      const date = new Date(entry.posting_date);
      let groupKey: string;

      if (groupBy === "month") {
        groupKey = entry.posting_date.slice(0, 7); // "YYYY-MM"
      } else {
        groupKey = entry.posting_date.slice(0, 4); // "YYYY"
      }

      if (!acc[entry.account_type]) {
        acc[entry.account_type] = {};
      }

      if (!acc[entry.account_type][groupKey]) {
        acc[entry.account_type][groupKey] = { debit: 0, credit: 0 };
      }

      acc[entry.account_type][groupKey].debit += entry.debit;
      acc[entry.account_type][groupKey].credit += entry.credit;

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
      console.log(period);
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
              {accountType}
            </div>
          </TableCell>
          {periods.map((period) => (
            <TableCell key={period} className="text-right">
              {formatAmount(
                groupedData[accountType]?.[period]?.credit -
                  groupedData[accountType]?.[period]?.debit || 0
              )}
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
                        ? formatAmount(entry.credit - entry.debit)
                        : "-"
                      : period === entry.posting_date.slice(0, 4)
                      ? formatAmount(entry.credit - entry.debit)
                      : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
      </React.Fragment>
    );
  };

  const calculateTotalForPeriod = (accountType: string, period: string) => {
    return (
      groupedData[accountType]?.[period]?.credit -
        groupedData[accountType]?.[period]?.debit || 0
    );
  };

  const calculateGrossProfit = (period: string) => {
    const revenue = calculateTotalForPeriod(
      accountTypeToJSON(AccountType.SALES_REVENUE),
      period
    );
    const costOfSales = calculateTotalForPeriod(
      accountTypeToJSON(AccountType.COST_OF_GOODS_SOLD),
      period
    );
    return revenue - (-costOfSales);
  };

  const chartData = useMemo(() => {
    return periods.map((period) => ({
      name: grouping === "month" ? period.slice(0, 7) : period,
      revenue: calculateTotalForPeriod(
        accountTypeToJSON(AccountType.SALES_REVENUE),
        period
      ),
      costOfSales: calculateTotalForPeriod(
        accountTypeToJSON(AccountType.COST_OF_GOODS_SOLD),
        period
      ),
      grossProfit: calculateGrossProfit(period),
    }));
  }, [periods, grouping, groupedData]);

  return (
    <ScrollArea className=" max-w-[1500px] whitespace-nowrap  border ">
      <Card className="">
      

        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profit & Loss Statement</CardTitle>
          <Select
            value={grouping}
            onValueChange={(value: GroupingOption) => setGrouping(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
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
                <TableHead className="w-[200px]">Account</TableHead>
                {periods.map((period) => (
                  <TableHead key={period} className="text-right">
                    {grouping === "month" ? period.slice(0, 7) : period}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={periods.length + 1} className="font-bold">
                  Direct Income (Net Sales)
                </TableCell>
              </TableRow>
              {renderAccountTypeRow(
                accountTypeToJSON(AccountType.SALES_REVENUE)
              )}

              <TableRow>
                <TableCell colSpan={periods.length + 1} className="font-bold">
                  Cost of Sales
                </TableCell>
              </TableRow>
              {renderAccountTypeRow(
                accountTypeToJSON(AccountType.COST_OF_GOODS_SOLD)
              )}

              <TableRow className="font-bold">
                <TableCell>Gross Profit</TableCell>
                {periods.map((period) => (
                  <TableCell key={period} className="text-right">
                    {formatAmount(calculateGrossProfit(period))}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell colSpan={periods.length + 1} className="font-bold">
                  Operating Expenses
                </TableCell>
              </TableRow>
              {accountTypes
                .filter(
                  (type) =>
                    type !== accountTypeToJSON(AccountType.SALES_REVENUE) &&
                    type !== accountTypeToJSON(AccountType.COST_OF_GOODS_SOLD)
                )
                .map(renderAccountTypeRow)}

              <TableRow className="font-bold">
                <TableCell>Net Profit/Loss</TableCell>
                {periods.map((period) => (
                  <TableCell key={period} className="text-right">
                    {formatAmount(
                      Object.values(groupedData).reduce(
                        (sum, accountType) =>
                          sum +
                          (accountType[period]?.credit || 0) -
                          (accountType[period]?.debit || 0),
                        0
                      )
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
