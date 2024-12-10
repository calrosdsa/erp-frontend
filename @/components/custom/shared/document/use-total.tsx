import { create } from "zustand";
import { useLineItems } from "../item/use-line-items";
import { useTaxAndCharges } from "../accounting/tax/use-tax-charges";
import { useEffect, useMemo } from "react";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { z } from "zod";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

type TaxLine = z.infer<typeof taxAndChargeSchema>;
type LineItem = z.infer<typeof lineItemSchema>;

interface TotalStore {
  total: number;
  setTotal: (total: number) => void;
}

interface TotalCalculator {
  calculateTaxLineAmount: (taxLine: TaxLine, totalItemAmount: number) => number;
  calculateTotalFromTaxLines: (
    taxLines: TaxLine[],
    baseTotal: number
  ) => number;
  calculateTotalFromLineItems: (lineItems: LineItem[]) => number;
  calculateTotalQuantity: (lineItems: LineItem[]) => number;
}

const createTotalCalculator = (): TotalCalculator => ({
  calculateTaxLineAmount: (
    taxLine: TaxLine,
    totalItemAmount: number
  ): number => {
    if (
      taxLine.type === taxChargeLineTypeToJSON(TaxChargeLineType.ON_NET_TOTAL)
    ) {
      return totalItemAmount * ((taxLine.taxRate || 1) / 100);
    }
    return Number(taxLine.amount) || 0;
  },

  calculateTotalFromTaxLines: (
    taxLines: TaxLine[],
    baseTotal: number
  ): number => {
    const totalDeducted = taxLines
      .filter((t) => t.isDeducted)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalAdded = taxLines
      .filter((t) => !t.isDeducted)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return baseTotal + (totalAdded - totalDeducted);
  },

  calculateTotalFromLineItems: (lineItems: LineItem[]): number => {
    return lineItems.reduce(
      (prev, curr) => prev + curr.rate * (curr.quantity || 0),
      0
    );
  },

  calculateTotalQuantity: (lineItems: LineItem[]): number => {
    return lineItems.reduce((prev, curr) => prev + (curr.quantity || 0), 0);
  },
});

const useTotalStore = create<TotalStore>((set) => ({
  total: 0,
  setTotal: (total) => set({ total }),
}));

export function useTotal() {
  const { total: totalItemAmount, lines: lineItems } = useLineItems();
  const { total: totalTaxAndCharges, lines: taxLines } = useTaxAndCharges();
  const { total, setTotal } = useTotalStore();
  const calculator = useMemo(() => createTotalCalculator(), []);

  useEffect(() => {
    setTotal(totalItemAmount + totalTaxAndCharges);
  }, [totalItemAmount, totalTaxAndCharges, setTotal]);

  const processTaxLines = (taxLines: TaxLine[]): TaxLine[] => {
    return taxLines.map((t) => ({
      ...t,
      amount: calculator.calculateTaxLineAmount(t, totalItemAmount),
    }));
  };

  const processTaxLinesWithAmount = (
    taxLines: TaxLine[],
    amount: number
  ): TaxLine[] => {
    return taxLines.map((t) => ({
      ...t,
      amount: calculator.calculateTaxLineAmount(t, amount),
    }));
  };

  const onEditTaxLine = (editedLine: TaxLine): number => {
    const updatedTaxLines = processTaxLines(
      taxLines.map((t) =>
        t.taxLineID === editedLine.taxLineID ? editedLine : t
      )
    );
    return calculator.calculateTotalFromTaxLines(
      updatedTaxLines,
      totalItemAmount
    );
  };

  const onAddTaxLine = (newLine: TaxLine): number => {
    const updatedTaxLines = processTaxLines([...taxLines, newLine]);
    return calculator.calculateTotalFromTaxLines(
      updatedTaxLines,
      totalItemAmount
    );
  };

  const onDeleteTaxLine = (deletedLine: TaxLine): number => {
    const updatedTaxLines = processTaxLines(
      taxLines.filter((t) => t.taxLineID !== deletedLine.taxLineID)
    );
    return calculator.calculateTotalFromTaxLines(
      updatedTaxLines,
      totalItemAmount
    );
  };

  const onEditLineItem = (lineItem: LineItem): [number, number, number] => {
    const updatedLineItems = lineItems.map((t) =>
      t.itemLineID === lineItem.itemLineID ? lineItem : t
    );
    const totalLineItemAmount =
      calculator.calculateTotalFromLineItems(updatedLineItems);
    const totalQuantity = calculator.calculateTotalQuantity(updatedLineItems);
    return [
      calculator.calculateTotalFromTaxLines(
        processTaxLinesWithAmount(taxLines, totalLineItemAmount),
        totalLineItemAmount
      ),
      totalQuantity,
      totalLineItemAmount,
    ];
  };

  const onAddLineItem = (lineItem: LineItem): [number, number, number] => {
    const updatedLineItems = [...lineItems, lineItem];
    const totalLineItemAmount =
      calculator.calculateTotalFromLineItems(updatedLineItems);
    const totalQuantity = calculator.calculateTotalQuantity(updatedLineItems);
    return [
      calculator.calculateTotalFromTaxLines(
        processTaxLinesWithAmount(taxLines, totalLineItemAmount),
        totalLineItemAmount
      ),
      totalQuantity,
      totalLineItemAmount,
    ];
  };

  const onDeleteLineItem = (lineItem: LineItem): [number, number, number] => {
    const updatedLineItems = lineItems.filter(
      (t) => t.itemLineID !== lineItem.itemLineID
    );
    const totalLineItemAmount =
      calculator.calculateTotalFromLineItems(updatedLineItems);
    const totalQuantity = calculator.calculateTotalQuantity(updatedLineItems);
    return [
      calculator.calculateTotalFromTaxLines(
        processTaxLinesWithAmount(taxLines, totalLineItemAmount),
        totalLineItemAmount
      ),
      totalQuantity,
      totalLineItemAmount,
    ];
  };

  const getTotalAndQuantity = (
    actionType: string,
    lineItem: LineItem
  ): [number, number, number] => {
    switch (actionType) {
      case "edit-line-item":
        return onEditLineItem(lineItem);
      case "add-line-item":
        return onAddLineItem(lineItem);
      case "delete-line-item":
        return onDeleteLineItem(lineItem);
      default:
        throw new Error(`Invalid action type: ${actionType}`);
    }
  };

  return {
    total,
    totalItemAmount,
    taxLines,
    onEditTaxLine,
    onAddTaxLine,
    onDeleteTaxLine,
    onAddLineItem,
    onEditLineItem,
    onDeleteLineItem,
    getTotalAndQuantity,
  };
}
