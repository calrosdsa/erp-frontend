import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

type GroupingOption = 'monthly' | 'yearly'

type AccountEntry = {
  account_type: string
  account_name: string
  posting_date: string
  credit: number
  debit: number
}

interface ProfitLossStatementProps {
  data: AccountEntry[]
  startDate: Date
  endDate: Date
}

export const ProfitLossStatement: React.FC<ProfitLossStatementProps> = ({
  data,
  startDate,
  endDate
}) => {
  const [grouping, setGrouping] = useState<GroupingOption>('monthly')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = (accountType: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(accountType)) {
      newExpanded.delete(accountType)
    } else {
      newExpanded.add(accountType)
    }
    setExpandedGroups(newExpanded)
  }

  const periods = useMemo(() => {
    const periods: string[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const period = grouping === 'monthly'
        ? currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })
        : currentDate.getFullYear().toString()
      
      if (!periods.includes(period)) {
        periods.push(period)
      }
      
      currentDate.setMonth(currentDate.getMonth() + (grouping === 'monthly' ? 1 : 12))
    }
    
    return periods
  }, [startDate, endDate, grouping])

  const groupedData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {}
    
    data.forEach(entry => {
      const date = new Date(entry.posting_date)
      const period = grouping === 'monthly'
        ? date.toLocaleString('default', { month: 'short', year: 'numeric' })
        : date.getFullYear().toString()
      
      if (!grouped[entry.account_type]) {
        grouped[entry.account_type] = {}
      }
      if (!grouped[entry.account_type][period]) {
        grouped[entry.account_type][period] = 0
      }
      grouped[entry.account_type][period] += entry.credit - entry.debit
    })
    
    return grouped
  }, [data, grouping])

  const accountTypes = useMemo(() => {
    return Array.from(new Set(data.map(entry => entry.account_type)))
  }, [data])

  const renderRow = (accountType: string) => {
    const isExpanded = expandedGroups.has(accountType)
    const accountEntries = data.filter(entry => entry.account_type === accountType)
    
    return (
      <React.Fragment key={accountType}>
        <TableRow>
          <TableCell className="font-medium">
            <div className="flex items-center">
              <button
                onClick={() => toggleGroup(accountType)}
                className="p-1 hover:bg-accent rounded-sm mr-1"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {accountType.replace(/_/g, ' ')}
            </div>
          </TableCell>
          {periods.map(period => (
            <TableCell key={period} className="text-right">
              $ {Math.abs(groupedData[accountType]?.[period] || 0).toFixed(2)}
            </TableCell>
          ))}
        </TableRow>
        {isExpanded && accountEntries.map((entry, index) => (
          <TableRow key={`${accountType}-${index}`} className="bg-muted/50">
            <TableCell className="pl-8">{entry.account_name}</TableCell>
            {periods.map(period => {
              const entryDate = new Date(entry.posting_date)
              const entryPeriod = grouping === 'monthly'
                ? entryDate.toLocaleString('default', { month: 'short', year: 'numeric' })
                : entryDate.getFullYear().toString()
              return (
                <TableCell key={period} className="text-right">
                  $ {period === entryPeriod ? Math.abs(entry.credit - entry.debit).toFixed(2) : '0.00'}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </React.Fragment>
    )
  }

  const totalRow = useMemo(() => {
    const totals: Record<string, number> = {}
    periods.forEach(period => {
      totals[period] = accountTypes.reduce((sum, accountType) => {
        const value = groupedData[accountType]?.[period] || 0
        return accountType === 'SALES_REVENUE' ? sum + value : sum - Math.abs(value)
      }, 0)
    })
    return totals
  }, [periods, accountTypes, groupedData])

  return (
    <Card className="w-full">
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
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              {periods.map(period => (
                <TableHead key={period} className="text-right">{period}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountTypes.map(accountType => renderRow(accountType))}
            <TableRow className="font-bold">
              <TableCell>Net Profit/Loss</TableCell>
              {periods.map(period => (
                <TableCell key={period} className="text-right">
                  $ {totalRow[period].toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}