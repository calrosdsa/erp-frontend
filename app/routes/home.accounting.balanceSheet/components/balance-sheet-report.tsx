import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type BalanceSheetEntry = {
  account_name: string;
  account_root_type: string;
  account_type: string;
  credit: number;
  debit: number;
};

interface BalanceSheetProps {
  data: BalanceSheetEntry[];
}

export const BalanceSheetReport: React.FC<BalanceSheetProps> = ({ data }) => {
  const groupedData = useMemo(() => {
    return data.reduce((acc, entry) => {
      const group = entry.account_root_type === "ASSET" ? "ASSET" : "LIABILITY_EQUITY";
      if (!acc[group]) {
        acc[group] = {};
      }
      if (!acc[group][entry.account_type]) {
        acc[group][entry.account_type] = [];
      }
      acc[group][entry.account_type]?.push(entry);
      return acc;
    }, {} as Record<string, Record<string, BalanceSheetEntry[]>>);
  }, [data]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateNetAmount = (entry: BalanceSheetEntry) => {
    return (entry.debit - entry.credit) / 100;
  };

  const calculateGroupTotal = (group: Record<string, BalanceSheetEntry[]>) => {
    return Object.values(group)
      .flat()
      .reduce((sum, entry) => sum + calculateNetAmount(entry), 0);
  };

  const assetTotal = calculateGroupTotal(groupedData["ASSET"] || {});
  const liabilityEquityTotal = calculateGroupTotal(
    groupedData["LIABILITY_EQUITY"] || {}
  );

  const liabilityTotal = Object.values(groupedData["LIABILITY_EQUITY"] || {})
    .flat()
    .filter(entry => entry.account_root_type === "LIABILITY")
    .reduce((sum, entry) => sum + calculateNetAmount(entry), 0);

  const equityTotal = Object.values(groupedData["LIABILITY_EQUITY"] || {})
    .flat()
    .filter(entry => entry.account_root_type === "EQUITY")
    .reduce((sum, entry) => sum + calculateNetAmount(entry), 0);

  const chartData = [
    { name: "Assets", value: Math.abs(assetTotal) },
    { name: "Liabilities & Equity", value: Math.abs(liabilityEquityTotal) },
  ];

  const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Balance Sheet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatAmount(assetTotal)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatAmount(Math.abs(liabilityTotal))}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatAmount(Math.abs(equityTotal))}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Provisional P&L (Credit)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatAmount(Math.abs(assetTotal-(-liabilityEquityTotal)))}
                </p>
            </CardContent>
          </Card>
        </div>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatAmount(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Account Type</TableHead>
              <TableHead className="w-[200px]">Account Name</TableHead>
              <TableHead className="text-right" colSpan={3}>Net Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedData).map(([group, accountTypes]) => (
              <React.Fragment key={group}>
                <TableRow>
                  <TableCell colSpan={5} className="font-bold bg-muted">
                    {group === "ASSET" ? "Assets" : "Liabilities & Equity"}
                  </TableCell>
                </TableRow>
                {Object.entries(accountTypes).map(([accountType, entries]) => (
                  <React.Fragment key={accountType}>
                    {entries.map((entry, index) => (
                      <TableRow key={`${group}-${accountType}-${index}`}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={entries.length}
                            className="font-medium"
                          >
                            {entry.account_type}
                          </TableCell>
                        )}
                        <TableCell colSpan={3}>{entry.account_name}</TableCell>
                        <TableCell className="text-right">
                          {formatAmount(calculateNetAmount(entry))}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="font-semibold">
                        Total {accountType}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatAmount(
                          entries.reduce(
                            (sum, entry) => sum + calculateNetAmount(entry),
                            0
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="font-bold">
                    Total{" "}
                    {group === "ASSET" ? "Assets" : "Liabilities & Equity"}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatAmount(calculateGroupTotal(accountTypes))}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};