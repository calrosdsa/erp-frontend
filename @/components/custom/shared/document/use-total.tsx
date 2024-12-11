import { create } from "zustand";
import { useLineItems } from "../item/use-line-items";
import { useTaxAndCharges } from "../accounting/tax/use-tax-charges";
import { useEffect, useMemo } from "react";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { z } from "zod";
import {
  TaxChargeLineType,
  taxChargeLineTypeFromJSON,
  taxChargeLineTypeToJSON,
} from "~/gen/common";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

type TaxLine = z.infer<typeof taxAndChargeSchema>;
type LineItem = z.infer<typeof lineItemSchema>;

interface TotalStore {
  total: number;
  setTotal: (total: number) => void;
}

interface TotalCalculator {
  calculateTaxLineAmount: (
    taxLine: TaxLine,
    totalItemAmount: number,
    idx: number,
    taxLines:TaxLine[]
  ) => number;
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
    totalItemAmount: number,
    idx: number,
    taxLines:TaxLine[],
  ): number => {
    const rate = (taxLine.taxRate || 1) / 100;
    switch (taxChargeLineTypeFromJSON(taxLine.type)) {
      case TaxChargeLineType.ON_NET_TOTAL:
        return totalItemAmount * rate;
      case TaxChargeLineType.ON_PREVIOUS_ROW_AMOUNT:
        return (taxLines[idx - 1]?.amount || 0) * rate;
      case TaxChargeLineType.ON_PREVIOUS_ROW_TOTAL:
        return ((taxLines[idx - 1]?.amount || 0) + totalItemAmount) * rate;
    }
    // if (
    //   taxLine.type === taxChargeLineTypeToJSON(TaxChargeLineType.ON_NET_TOTAL)
    // ) {
    //   return totalItemAmount * ((taxLine.taxRate || 1) / 100);
    // }

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
    return taxLines.map((t, idx) => ({
      ...t,
      amount: calculator.calculateTaxLineAmount(t, totalItemAmount, idx,taxLines),
    }));
  };

  const processTaxLinesWithAmount = (
    taxLines: TaxLine[],
    amount: number
  ): TaxLine[] => {
    return taxLines.map((t, idx) => ({
      ...t,
      amount: calculator.calculateTaxLineAmount(t, amount, idx,taxLines),
    }));
  };

  const onEditTaxLine = (editedLine: TaxLine): number => {
    const updatedTaxLines = processTaxLines(
      taxLines.map((t) =>
        t.taxLineID === editedLine.taxLineID ? editedLine : t
      )
    );
    console.log("UPDATE TAX LINES",updatedTaxLines)
    return calculator.calculateTotalFromTaxLines(
      updatedTaxLines,
      totalItemAmount
    );
  };

  const calculateChargeLineAmount = (
    type: string,
    taxRate: number,
    idx: number
  ): [number, string] => {
    const ERROR_MESSAGE = `No se puede seleccionar el tipo de cargo como 'Sobre el total de la fila anterior' o 'Sobre el monto de la fila anterior' para la primera fila.`;
    const rate = (taxRate || 0) / 100;

    // Check if the taxLines array is empty, as it's used in multiple places
    const isFirstRow = taxLines.length === 0;

    switch (taxChargeLineTypeFromJSON(type)) {
      case TaxChargeLineType.ON_NET_TOTAL:
        const amount = rate * totalItemAmount;
        return [amount, ""];

      case TaxChargeLineType.ON_PREVIOUS_ROW_TOTAL:
        if (isFirstRow) {
          return [0, ERROR_MESSAGE];
        }
        const previousRowTotal =
          (taxLines[idx - 1]?.amount || 0) + totalItemAmount;
        return [rate * previousRowTotal, ""];

      case TaxChargeLineType.ON_PREVIOUS_ROW_AMOUNT:
        if (isFirstRow) {
          return [0, ERROR_MESSAGE];
        }
        const previousRowAmount = taxLines[idx - 1]?.amount || 0;
        return [rate * previousRowAmount, ""];
    }

    return [0, ""];
  };

  const onAddTaxLine = (newLine: TaxLine): number => {
    const updatedTaxLines = processTaxLines([...taxLines, newLine]);
    // const totalAmount =  calculator.calculateTotalFromTaxLines(
    //   updatedTaxLines,
    //   totalItemAmount
    // );
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
    calculateChargeLineAmount,
  };
}
