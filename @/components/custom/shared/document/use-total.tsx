import { create } from "zustand";
import { useLineItems } from "../item/use-line-items";
import { useTaxAndCharges } from "../accounting/tax/use-tax-charges";
import { useEffect } from "react";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { z } from "zod";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
type TaxLine = z.infer<typeof taxAndChargeSchema>
const calculateTaxLineAmount = (taxLine: TaxLine, totalItemAmount: number): number => {
    if (taxLine.type === taxChargeLineTypeToJSON(TaxChargeLineType.ON_NET_TOTAL)) {
      return totalItemAmount * ((taxLine.taxRate || 1) / 100)
    }
    return Number(taxLine.amount) || 0
  }
  
  const calculateTotalFromTaxLines = (taxLines: TaxLine[], baseTotal: number): number => {
    const totalDeducted = taxLines
      .filter((t) => t.isDeducted)
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const totalAdded = taxLines
      .filter((t) => !t.isDeducted)
      .reduce((sum, t) => sum + Number(t.amount), 0)
    return baseTotal + (totalAdded - totalDeducted)
  }
  interface TotalStore {
  total: number
  setTotal: (total: number) => void
}

const useTotalStore = create<TotalStore>((set) => ({
    total: 0,
    setTotal: (total) => set({ total }),
  }))
  
  
  export function useTotal() {
    const { total: totalItemAmount } = useLineItems()
    const { total: totalTaxAndCharges, lines: taxLines } = useTaxAndCharges()
    const { total, setTotal } = useTotalStore()
  
    useEffect(() => {
      setTotal(totalItemAmount + totalTaxAndCharges)
    }, [totalItemAmount, totalTaxAndCharges, setTotal])
  
    const processTaxLines = (taxLines: TaxLine[]): TaxLine[] => {
      return taxLines.map((t) => ({
        ...t,
        amount: calculateTaxLineAmount(t, totalItemAmount),
      }))
    }
  
    const onEditTaxLine = (editedLine: TaxLine): number => {
        console.log("EDITED LINE",editedLine)
      const updatedTaxLines = processTaxLines(
        taxLines.map((t) => (t.taxLineID === editedLine.taxLineID ? editedLine : t))
      )
      return calculateTotalFromTaxLines(updatedTaxLines, totalItemAmount)
    }
  
    const onAddTaxLine = (newLine: TaxLine): number => {
      const updatedTaxLines = processTaxLines([...taxLines, newLine])
      return calculateTotalFromTaxLines(updatedTaxLines, totalItemAmount)
    }
  
    const onDeleteTaxLine = (deletedLine: TaxLine): number => {
      const updatedTaxLines = processTaxLines(
        taxLines.filter((t) => t.taxLineID !== deletedLine.taxLineID)
      )
      return calculateTotalFromTaxLines(updatedTaxLines, totalItemAmount)
    }
  
    return {
      total,
      totalItemAmount,
      onEditTaxLine,
      onAddTaxLine,
      onDeleteTaxLine,
    }
  }