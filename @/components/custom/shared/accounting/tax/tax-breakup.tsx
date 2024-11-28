import React, { useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Typography } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { useLineItems } from "../../item/use-line-items"
import { useTaxAndCharges } from "./use-tax-charges"

interface CalculatedRow {
  item_name: string
  taxableAmount: number
  [key: string]: number | string // For dynamic tax columns
}

export function TaxBreakup({ currency }: { currency: string }) {
  const { lines: lineItems } = useLineItems()
  const { lines: taxLines } = useTaxAndCharges()
  const { t, i18n } = useTranslation("common")

  // Create unique keys for each tax line
  const taxKeys = useMemo(() => {
    const keys = new Map<number, string>()
    const nameCounts = new Map<string, number>()

    taxLines.forEach(tax => {
      const count = nameCounts.get(tax.accountHeadName) || 0
      nameCounts.set(tax.accountHeadName, count + 1)
      
      // If this name appears multiple times, append a number and type
      const key = count > 0 
        ? `${tax.accountHeadName}_${tax.type}_${tax.taxLineID}`
        : tax.accountHeadName
      
      keys.set(Number(tax.taxLineID), key)
    })

    return keys
  }, [taxLines])

  const calculatedData = useMemo(() => {
    if (lineItems.length === 0 || taxLines.length === 0) {
      return []
    }

    const totalTaxableAmount = lineItems.reduce(
      (sum, item) => sum + Number(item.quantity) * item.rate,
      0
    )

    return lineItems.map((item) => {
      const taxableAmount = Number(item.quantity) * item.rate
      const taxAmounts = taxLines.reduce((acc, tax) => {
        let taxAmount: number
        
        if (!tax.taxRate || tax.taxRate === 0) {
          // Distribute fixed amount proportionally based on taxable amount
          const proportion = taxableAmount / totalTaxableAmount
          taxAmount = Number(tax.amount) * proportion
        } else {
          // Calculate percentage-based tax
          taxAmount = (taxableAmount * tax.taxRate) / 100
        }

        const key = taxKeys.get(Number(tax.taxLineID))!
        acc[key] = tax.isDeducted ? -taxAmount : taxAmount
        return acc
      }, {} as Record<string, number>)

      return {
        item_name: item.item_name,
        taxableAmount,
        ...taxAmounts,
      }
    }) as CalculatedRow[]
  }, [lineItems, taxLines, taxKeys])

//   const totals = useMemo(() => {
//     if (calculatedData.length === 0) return null

//     return calculatedData.reduce((acc, row) => {
//       acc.taxableAmount = (acc.taxableAmount || 0) + row.taxableAmount
      
//       taxLines.forEach((tax) => {
//         const key = taxKeys.get(tax.taxLineID)!
//         acc[key] = (acc[key] || 0) + 
//           (typeof row[key] === 'number' ? row[key] as number : 0)
//       })
      
//       return acc
//     }, {} as CalculatedRow)
//   }, [calculatedData, taxLines, taxKeys])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  if (calculatedData.length === 0) {
    return null
  }

  return (
    <>
      <Separator className="col-span-full" />
      <div className="col-span-full">
        <Typography variant="subtitle2" className="pb-3">
        Desglose de impuestos y cargos
        </Typography>
        <Table className="border rounded-xl">
          <TableHeader>
            <TableRow>
              <TableHead>{t("item")}</TableHead>
              <TableHead className="text-right">Monto imponible</TableHead>
              {taxLines.map((tax) => {
                const key = taxKeys.get(Number(tax.taxLineID))!
                return (
                  <TableHead key={tax.taxLineID} className="text-right">
                    <div className="font-medium">
                      {tax.accountHeadName}
                      {/* {taxKeys.get(Number(tax.taxLineID))?.includes('_') && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({tax.type})
                        </span>
                      )} */}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tax.taxRate ? `${tax.taxRate}%` : formatAmount(Number(tax.amount))}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculatedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.item_name}</TableCell>
                <TableCell className="text-right">
                  {formatAmount(row.taxableAmount)}
                </TableCell>
                {taxLines.map((tax) => {
                  const key = taxKeys.get(Number(tax.taxLineID))!
                  return (
                    <TableCell key={tax.taxLineID} className="text-right">
                      {formatAmount(Math.abs(row[key] as number))}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            {/* {totals && (
              <TableRow className="font-medium border-t">
                <TableCell>{t("total")}</TableCell>
                <TableCell className="text-right">
                  {formatAmount(totals.taxableAmount)}
                </TableCell>
                {taxLines.map((tax) => {
                  const key = taxKeys.get(tax.taxLineID)!
                  return (
                    <TableCell key={tax.taxLineID} className="text-right">
                      {formatAmount(Math.abs(totals[key] as number))}
                    </TableCell>
                  )
                })}
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </div>
    </>
  )
}