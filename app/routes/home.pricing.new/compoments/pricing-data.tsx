import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  editPricingSchema,
  pricingChargeDataSchema,
  pricingDataSchema,
  pricingLineItemDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { PricingTable } from "./pricing-table";
import { pricingChargeColumns, pricingLineItemColumns } from "@/components/custom/table/columns/pricing/pricing-columns";
import { useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FormulaEngine } from "../util/formula";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/custom/table/CustomTable";

type EditData = z.infer<typeof pricingDataSchema>;
type LineItemType = z.infer<typeof pricingLineItemDataSchema>;
type PricingChargeType = z.infer<typeof pricingChargeDataSchema>;



const defaultLineItem: LineItemType = {
  part_number: "SV-4040EX-R12-176T-16-410",
  description:
    "Streamvault™ 4040EX Series - 2U 12-Bay Appliance 176TB Raw RAID",

  fob_unit_fn: "pl_unit * (1-descuento)",
  retention_fn: "",
  cost_zf_fn: "fob_unit * (1+flete)",
  cost_alm_fn: "cost_zf * (1+importacion)",
  tva_fn: "quantity",
  cantidad_fn: "quantity",
  precio_unitario_fn: "(cost_alm/(1-margen)+tva)/(1-impuestos)",
  precio_total_fn: "cantidad * precio_unitario",
  precio_unitario_tc_fn: "precio_unitario * tc",
  precio_total_tc_fn: "precio_unitario_tc * cantidad",
  fob_total_fn: "fob_unit * cantidad",
  gpl_total_fn: "pl_unit * cantidad",
  tva_total_fn: "tva * cantidad",

  pl_unit: 0,
  quantity: 0,
  cantidad: 0,
  tva: 0,
  fob_unit: 0,
  retention: 0,
  cost_zf: 0,
  cost_alm: 0,
  precio_unitario: 0,
  precio_total: 0,
  precio_unitario_tc: 0,
  precio_total_tc: 0,
  fob_total: 0,
  gpl_total: 0,
  tva_total: 0,
};

export default function PricingData({
  form,
}: {
  // control?: Control<EditData>
  form: UseFormReturn<EditData, any, undefined>;
}) {
  const {
    fields: lineItems,
    append,
    update,
    remove,
    move,
  } = useFieldArray({
    control: form.control,
    name: "pricing_line_items",
  });

  const {
    fields: charLines,
    append: appendCharge,
    update: updateCharge,
    remove: removeCharge,
    move: moveCharge,
  } = useFieldArray({
    control: form.control,
    name: "pricing_charges",
  });
  const formValues = form.getValues();
  const formula = new FormulaEngine();

  const chargesObject = useMemo(() => {
    const values: Record<string, number> = {};
    formValues.pricing_charges?.map((item) => {
      const formattedName = item.name.replace(/\s+/g, "_").toLowerCase(); // Replace spaces with underscores and convert to lowercase
      values[formattedName] = item.rate;
      // return {
      //   [formattedName]: item.rate, // Dynamic key with formatted name and rate as value
      // };
    });
    return values;
  }, [formValues.pricing_charges]);

  const getValues = useCallback(
    (fn: string, line: LineItemType): Record<string, any> => {
      const words = fn.match(/\b[a-zA-Z_]+\b/g);
      console.log("WORDS", words);
      const record: Record<string, any> = {};
      const d = { ...line, ...chargesObject };
      words?.forEach((w) => {
        record[w] = d[w as keyof LineItemType];
      });
      console.log(line, words, record);
      return record;
    },
    [chargesObject]
  );

  const updateLines = () => {
    const lines = formValues.pricing_line_items.map((t) => {
      const updateLine = updateValues(t);
      return updateLine;
    });
    form.setValue("pricing_line_items", lines);
    form.trigger("pricing_line_items");
  };

  const updateValues = useCallback(
    (line: LineItemType): LineItemType => {
      // let item = line;
      Object.entries(line).forEach(([key, value]) => {
        console.log(key, value);
        if (key.endsWith("_fn")) {
          const values = getValues(value as string, line);
          const result = formula.calculate(value as string, values);
          // console.log("REPLACE KEY", key.replace(/_fn$/, ""));
          line[key.replace(/_fn$/, "") as keyof LineItemType ] = result || "";
        }
      });
      return line;
    },
    [getValues]
  );

  const handleCellUpdate = useCallback(
    (row: number, column: string, value: string) => {
      // update(row,)
      console.log("UPDARE CELL ", row, column, value);

      form.setValue(`pricing_line_items.${row}.${column}` as any, value);
      const f = form.getValues().pricing_line_items[row];
      if (f) {
        const n = updateValues(f);
        update(row, n);
      }
    },
    [formValues]
  );

  const handleChargeUpdate = useCallback(
    (row: number, column: string, value: string) => {
      form.setValue(`pricing_charges.${row}.${column}` as any, value);
      const f = form.getValues().pricing_charges[row];
      if (f) {
        updateCharge(row, f);
      }
    },
    [formValues]
  );

  useEffect(() => {
    console.log("UPDATE LINES ....");
    updateLines();
  }, [chargesObject]);

  return (
    <>
    {/* {JSON.stringify(lineItems)} */}
      <PricingTable
        columns={pricingLineItemColumns()}
        data={lineItems}
        // enableRowSelection={true}
        fixedHeight={400}
        control={form.control}
        metaOptions={{
          meta: {
            updateCell: handleCellUpdate,
            removeRow: remove,
            moveRow: move,
          },
        }}
      />
      <Button
        type="button"
        className=" w-min flex space-x-2 "
        variant={"outline"}
        onClick={() => append(defaultLineItem)}
      >
        <PlusIcon />
        <span>Agregar fila</span>
      </Button>
      <div className="max-w-[225px]">
        <DataTable
          columns={pricingChargeColumns({})}
          data={form.getValues("pricing_charges")}
          rowHeight={20}
          metaOptions={{
            meta: {
              updateCell: handleChargeUpdate,
            },
          }}
        />
      </div>
    </>
  );
}
