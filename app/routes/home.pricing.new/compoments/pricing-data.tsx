import {
  Control,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import {
  editPricingSchema,
  pricingChargeDataSchema,
  pricingDataSchema,
  pricingLineItemDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { PricingTable } from "./pricing-table";
import {
  pricingChargeColumns,
  pricingLineItemColumns,
} from "@/components/custom/table/columns/pricing/pricing-columns";
import {
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { FormulaEngine, removeFromList } from "../util/formula";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/custom/table/CustomTable";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FetcherWithComponents } from "@remix-run/react";
import PalettePicker from "./palette-picker";

type EditData = z.infer<typeof pricingDataSchema>;
type LineItemType = z.infer<typeof pricingLineItemDataSchema>;
type PricingChargeType = z.infer<typeof pricingChargeDataSchema>;

const defaultLineItem: LineItemType = {
  part_number: "",
  description: "",

  fob_unit_fn: "pl_unit * (1-descuento)",
  retention_fn: "",
  cost_zf_fn: "fob_unit * (1+flete)",
  cost_alm_fn: "cost_zf * (1+importacion)",
  tva_fn: "",
  cantidad_fn: "quantity",
  precio_unitario_fn: "(cost_alm/(1-margen)+tva)/(1-impuestos)",
  precio_total_fn: "cantidad * precio_unitario",
  precio_unitario_tc_fn: "precio_unitario * tc",
  precio_total_tc_fn: "precio_unitario_tc * cantidad",
  fob_total_fn: "fob_unit * cantidad",
  gpl_total_fn: "pl_unit * cantidad",
  tva_total_fn: "tva * cantidad",

  pl_unit: undefined,
  quantity: undefined,
  cantidad: undefined,
  tva: undefined,
  fob_unit: undefined,
  retention: undefined,
  cost_zf: undefined,
  cost_alm: undefined,
  precio_unitario: undefined,
  precio_total: undefined,
  precio_unitario_tc: undefined,
  precio_total_tc: undefined,
  fob_total: undefined,
  gpl_total: undefined,
  tva_total: undefined,
};

const lineItemWithTitle: LineItemType = {
  is_title: true,
};

export default function PricingData({
  fetcher,
  onSubmit,
  defaultValues,
  inputRef,
  form,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<EditData>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  defaultValues?: EditData;
  inputRef: MutableRefObject<HTMLInputElement | null>;
}) {
  // const form = useForm<EditData>({
  //   resolver: zodResolver(pricingDataSchema),
  //   defaultValues: defaultValues,
  // });
  const {
    fields: lineItems,
    append,
    update,
    replace,
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
  // const formValues = form.getValues();
  const formula = new FormulaEngine();

  const chargesObject = useMemo(() => {
    console.log("RE RENDER ...");
    const values: Record<string, number> = {};
    form.getValues().pricing_charges?.map((item) => {
      const formattedName = item.name.replace(/\s+/g, "_").toLowerCase(); // Replace spaces with underscores and convert to lowercase
      values[formattedName] = item.rate;
      // return {
      //   [formattedName]: item.rate, // Dynamic key with formatted name and rate as value
      // };
    });
    return values;
  }, [form.getValues().pricing_charges]);

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
    const lines = form.getValues().pricing_line_items.map((t) => {
      const updateLine = updateValues(t);
      return updateLine;
    });
    form.setValue("pricing_line_items", lines);
    form.trigger("pricing_line_items");
  };

  const updateValues = (line: any): LineItemType => {
    // let item = line;
    Object.entries(line).forEach(([key, value]) => {
      console.log(key, value);
      if (key.endsWith("_fn")) {
        const values = getValues(value as string, line);
        const result = formula.calculate(value as string, values);
        // console.log("REPLACE KEY", key.replace(/_fn$/, ""));
        line[key.replace(/_fn$/, "") as keyof any] = result || "";
      }
    });
    return line;
  };

  const handleCellUpdate = useCallback(
    (row: number, column: string, value: string) => {
      // update(row,)
      console.log("UPDARE CELL ", row, column, value, lineItems);

      form.setValue(`pricing_line_items.${row}.${column}` as any, value);
      let updateLines = form.getValues().pricing_line_items;
      const f = updateLines[row];
      if (f) {
        const n = updateValues(f);
        updateLines[row] = n;
        form.setValue("pricing_line_items", updateLines);
        // form.setValue(`pricing_line_items.${row}` as any, n);
        // form.trigger(`pricing_line_items.${row}`);

        // update(row, n);
      }
    },
    [form.getValues().pricing_line_items]
  );

  const handleChargeUpdate = useCallback(
    (row: number, column: string, value: string) => {
      form.setValue(`pricing_charges.${row}.${column}` as any, value);
      let updateLines = form.getValues().pricing_charges;
      console.log("EDITING", row, column, value);
      const f = updateLines[row];
      if (f) {
        updateLines[row] = f;
        form.setValue("pricing_charges", updateLines);
        // updateCharge(row, f);
      }
    },
    [form.getValues().pricing_charges]
  );

  useEffect(() => {
    console.log("UPDATE LINES ....");
    updateLines();
  }, [chargesObject]);

  return (
    <>
      <FormLayout>
        <Form {...form}>
          {/* {JSON.stringify(form.getValues().pricing_line_items)} */}
          <fetcher.Form onSubmit={onSubmit} className={cn("gap-y-3 grid p-3")}>
            {/* <PalettePicker/> */}
            <PricingTable
              columns={pricingLineItemColumns()}
              data={form.getValues("pricing_line_items")}
              // enableRowSelection={true}
              fixedHeight={400}
              control={form.control}
              metaOptions={{
                meta: {
                  updateCell: handleCellUpdate,
                  removeRow: (index?: number | number[]) => {
                    const res = removeFromList(
                      form.getValues().pricing_line_items,
                      index
                    );
                    form.setValue("pricing_line_items", res);
                    // remove(index);
                    // form.trigger("pricing_line_items");
                  },
                  moveRow: move,
                },
              }}
            />
            <div className=" flex space-x-2">
              <Button
                type="button"
                className=" w-min flex space-x-2 "
                variant={"outline"}
                onClick={() => append(defaultLineItem)}
              >
                <PlusIcon />
                <span>Agregar fila</span>
              </Button>
              <Button
                type="button"
                className=" w-min flex space-x-2 "
                variant={"outline"}
                onClick={() => append(lineItemWithTitle)}
              >
                <PlusIcon />
                <span>Agregar Titulo</span>
              </Button>
            </div>
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
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </>
  );
}
