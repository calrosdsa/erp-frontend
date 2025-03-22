import {
  Control,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import {
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
import {
  convertToPascalCase,
  convertToSnakeCase,
  FormulaEngine,
  removeFromList,
} from "../util/formula";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/custom/table/CustomTable";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FetcherWithComponents, useOutletContext } from "@remix-run/react";
import PalettePicker from "./palette-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/typography";
import { CustomerAutoCompleteForm } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app-types";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";

type EditData = z.infer<typeof pricingDataSchema>;
type LineItemType = z.infer<typeof pricingLineItemDataSchema>;
type PricingChargeType = z.infer<typeof pricingChargeDataSchema>;

const defaultLineItem: LineItemType = {
  part_number: "",
  description: "",

  fob_unit_fn: "Pl_Unit * (1-Descuento)",
  retention_fn: "",
  cost_zf_fn: "Fob_Unit * (1+Flete)",
  cost_alm_fn: "Cost_Zf * (1+Importacion)",
  tva_fn: "",
  cantidad_fn: "Quantity",
  precio_unitario_fn: "(Cost_Alm/(1-Margen)+TVA)/(1-Impuestos)",
  precio_total_fn: "Cantidad * Precio_Unitario",
  precio_unitario_tc_fn: "Precio_Unitario * TC",
  precio_total_tc_fn: "Precio_Unitario_TC * Cantidad",
  fob_total_fn: "Fob_Unit * Cantidad",
  gpl_total_fn: "Pl_Unit * Cantidad",
  tva_total_fn: "TVA * Cantidad",

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
  inputRef,
  form,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<EditData>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
}) {
  const { t } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
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
  const [rowActions] = useTableRowActions({
    onDelete(rowIndex) {
      removeCharge(rowIndex);
    },
  });

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
      console.log("CHARGE OB", chargesObject);
      const record: Record<string, any> = {};
      const d = { ...line, ...chargesObject };
      words?.forEach((w) => {
        console.log("SNAKE CASE", convertToSnakeCase(w));
        record[w] = d[convertToSnakeCase(w) as keyof LineItemType];
      });
      console.log("RECORD", record, d);
      // console.log(line, words, record);
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
      // console.log(key, value);
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

  const totals = useMemo(() => {
    const total = form.getValues().pricing_line_items.reduce(
      (acc, item: LineItemType) => {
        acc.fob_total = (acc.fob_total || 0) + (item.fob_total || 0);
        acc.gpl_total = (acc.gpl_total || 0) + (item.gpl_total || 0);
        acc.tva_total = (acc.tva_total || 0) + (item.tva_total || 0);
        acc.precio_total = (acc.precio_total || 0) + (item.precio_total || 0);
        acc.precio_total_tc =
          (acc.precio_total_tc || 0) + (item.precio_total_tc || 0);
        acc.cantidad = (acc.cantidad || 0) + (item.cantidad || 0);
        return acc;
      },
      {
        fob_total: 0,
        gpl_total: 0,
        tva_total: 0,
        precio_total: 0,
        precio_total_tc: 0,
        cantidad: 0,
      }
    );
    return total;
  }, [form.getValues()]);

  useEffect(() => {
    console.log("UPDATE LINES ....");
    updateLines();
  }, [chargesObject]);

  return (
    <>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form onSubmit={onSubmit} className={cn("gap-y-3 grid p-3")}>
            {/* <PalettePicker/> */}
            <PricingTable
              columns={pricingLineItemColumns()}
              data={form.getValues("pricing_line_items")}
              // enableRowSelection={true}
              fixedHeight={400}
              control={form.control}
              roleActions={roleActions}
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-full md:col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Pricing Charges</CardTitle>
                </CardHeader>
                <CardContent className=" max-w-[450px]">
                  <DataTable
                    columns={pricingChargeColumns({})}
                    data={form.getValues("pricing_charges")}
                    metaOptions={{
                      meta: {
                        updateCell: handleChargeUpdate,
                        ...rowActions,
                      },
                    }}
                  />
                  <Button
                    type="button"
                    className=" w-min flex space-x-2 "
                    variant={"outline"}
                    onClick={() => appendCharge({ name: "", rate: 0 })}
                  >
                    <PlusIcon />
                    <span>Agregar fila</span>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(totals).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b last:border-b-0 text-sm"
                      >
                        <span className="font-medium ">
                          {key.replace(/_/g, " ").toUpperCase()}:
                        </span>
                        <span className="font-semibold">
                          {Number(value).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Separator className=" col-span-full" />
              <div className=" create-grid col-span-full">
                <CustomerAutoCompleteForm
                  control={form.control}
                  label={t("customer")}
                  roleActions={roleActions}                  
                  name="customer"
                />
                <AccountingDimensionForm form={form} />
              </div>
            </div>

            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </>
  );
}
