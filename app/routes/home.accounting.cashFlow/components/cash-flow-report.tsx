import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

type CashFlowEntry = {
  account_type: string
  account_name: string
  cash_flow_section: string
  amount: number
}

interface CashFlowReportProps {
  data: CashFlowEntry[]
}

export const CashFlowReport: React.FC<CashFlowReportProps> = ({ data }) => {
  const groupedData = useMemo(() => {
    return data.reduce((acc, entry) => {
      if (!acc[entry.cash_flow_section]) {
        acc[entry.cash_flow_section] = {}
      }
      if (!acc[entry.cash_flow_section][entry.account_type]) {
        acc[entry.cash_flow_section][entry.account_type] = []
      }
      acc[entry.cash_flow_section][entry.account_type]?.push(entry)
      return acc
    }, {} as Record<string, Record<string, CashFlowEntry[]>>)
  }, [data])

  const chartData = useMemo(() => {
    return Object.entries(groupedData).map(([section, accountTypes]) => {
      const total = Object.values(accountTypes).flat().reduce((sum, entry) => sum + entry.amount, 0)
      return { name: section, total }
    })
  }, [groupedData])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount/100)
  }

  const calculateSectionTotal = (section: Record<string, CashFlowEntry[]>) => {
    return Object.values(section).flat().reduce((sum, entry) => sum + entry.amount, 0) 
  }

  const calculateGrandTotal = () => {
    return Object.values(groupedData).reduce((sum, section) => sum + (calculateSectionTotal(section)), 0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cash Flow Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barSize={100}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatAmount(value)} />
              <Tooltip 
                formatter={(value) => formatAmount(Number(value))}
                labelFormatter={(label) => `${label} Activities`}
              />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="total" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Section</TableHead>
              <TableHead className="w-[200px]">Account Type</TableHead>
              <TableHead className="w-[200px]">Account Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedData).map(([section, accountTypes]) => (
              <React.Fragment key={section}>
                {Object.entries(accountTypes).map(([accountType, entries]) => (
                  entries.map((entry, index) => (
                    <TableRow key={`${section}-${accountType}-${index}`}>
                      {index === 0 && (
                        <TableCell rowSpan={entries.length} className="font-semibold">
                          {section}
                        </TableCell>
                      )}
                      {index === 0 && (
                        <TableCell rowSpan={entries.length} className="font-medium">
                          {accountType}
                        </TableCell>
                      )}
                      <TableCell>{entry.account_name}</TableCell>
                      <TableCell className="text-right">{formatAmount(entry.amount)}</TableCell>
                    </TableRow>
                  ))
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">Total {section}</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatAmount(calculateSectionTotal(accountTypes))}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            <TableRow className="bg-muted">
              <TableCell colSpan={3} className="font-bold text-lg">Grand Total</TableCell>
              <TableCell className="text-right font-bold text-lg">
                {formatAmount(calculateGrandTotal())}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Demo component to showcase the CashFlowReport
export default function CashFlowReportDemo() {
  const sampleData: CashFlowEntry[] = [
    {"account_type":"INVENTORY","account_name":"Inventory","cash_flow_section":"OPERATING","amount":-475000},
    {"account_type":"INVENTORY","account_name":"Inventory2","cash_flow_section":"OPERATING","amount":-175000},
    {"account_type":"PAYABLE","account_name":"Creditors","cash_flow_section":"OPERATING","amount":680000},
    {"account_type":"RECEIVABLE","account_name":"Debtors","cash_flow_section":"OPERATING","amount":-75000},
    {"account_type":"CASH","account_name":"Bank Account","cash_flow_section":"FINANCING","amount":100000},
    {"account_type":"LOAN","account_name":"Long-term Loan","cash_flow_section":"FINANCING","amount":200000},
    {"account_type":"ASSET","account_name":"Equipment Purchase","cash_flow_section":"INVESTING","amount":-150000},
  ]

  return (
    <div className="container mx-auto p-4">
      <CashFlowReport data={sampleData} />
    </div>
  )
}