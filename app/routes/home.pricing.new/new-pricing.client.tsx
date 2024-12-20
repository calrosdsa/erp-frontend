"use client";

import React, { useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormLayout from "@/components/custom/form/FormLayout";
import {
  pricingChargeColumns,
  pricingLineItemColumns,
} from "@/components/custom/table/columns/pricing/pricing-columns";

import { action } from "./route";
import { routes } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  pricingDataSchema,
  pricingLineItemDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { FormulaEngine } from "./util/formula";
import { cn } from "@/lib/utils";
import { PricingTable } from "./compoments/pricing-table";
import { PlusIcon } from "lucide-react";

type PricingData = z.infer<typeof pricingDataSchema>;
type LineItemType = z.infer<typeof pricingLineItemDataSchema>;

interface ColumnConfigOption {
  fn: string;
  args: string[];
  columns: string[];
}

const defaultPricingCharges = [
  { type: "FLETE", name: "Flete", rate: 0.07, orderID: 1 },
  { type: "IMPORTACION", name: "Importacion", rate: 0.13, orderID: 2 },
  { type: "MARGEN", name: "Margen", rate: 0.2509825, orderID: 3 },
  { type: "IMPUESTOS", name: "Impuestos", rate: 0.192, orderID: 4 },
  { type: "RETENCION", name: "Retencion", rate: 0.1429, orderID: 5 },
  { type: "TVA", name: "TVA", rate: 0.7, orderID: 6 },
  { type: "TC", name: "T/C", rate: 7.5, orderID: 7 },
  { type: "DESCUENTO", name: "Descuento", rate: 0.45, orderID: 8 },
];

const defaultLineItem: LineItemType = {
  part_number: "SV-4040EX-R12-176T-16-410",
  description:
    "Streamvault™ 4040EX Series - 2U 12-Bay Appliance 176TB Raw RAID",
  pl_unit: 0,
  quantity: 0,
  fob_id: 8,
  fob_unit: 0,
  retention: 0,
  cost_zf: 0,
  cost_alm: 0,
  tva: 0,
  cantidad: 0,
  precio_unitario: 0,
  precio_total: 0,
  precio_unitario_tc: 0,
  precio_total_tc: 0,
  fob_total: 0,
  gpl_total: 0,
  tva_total: 0,

  retention_id: 5,
  freight_id: 1,
  importation_id: 2,
  margin_id: 3,
  tc_id: 7,
  taxes_id: 4,
};

export default function NewPricingClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const r = routes;
  const inputRef = useRef<HTMLInputElement>(null);
  const formula = new FormulaEngine();

  const [columnConfigs] = useState<Record<string, ColumnConfigOption>>({
    fob_unit: {
      fn: "pl_unit * (1 - arg1)",
      args: ["fob_id"],
      columns: ["pl_unit"],
    },
    retention: {
      fn: "fob_unit * arg1",
      args: ["retention_id"],
      columns: ["fob_unit"],
    },
    cost_zf: {
      fn: "fob_unit * (1+arg1)",
      args: ["freight_id"],
      columns: ["fob_unit"],
    },
    cost_alm: {
      fn: "cost_zf * (1+arg1)",
      args: ["importation_id"],
      columns: ["cost_zf"],
    },
    cantidad: {
      fn: "quantity",
      args: [],
      columns: ["quantity"],
    },
    precio_unitario: {
      fn: "(cost_alm/(1-arg1)+tva)/(1-arg2)",
      args: ["margin_id", "taxes_id"],
      columns: ["cost_alm", "tva"],
    },
    precio_total: {
      fn: "cantidad * precio_unitario",
      args: [],
      columns: ["cantidad", "precio_unitario"],
    },
    precio_unitario_tc: {
      fn: "precio_unitario * arg1",
      args: ["tc_id"],
      columns: ["precio_unitario"],
    },
    precio_total_tc: {
      fn: "precio_unitario_tc * cantidad",
      args: [],
      columns: ["precio_unitario_tc", "cantidad"],
    },
    fob_total: {
      fn: "fob_unit * cantidad",
      args: [""],
      columns: ["fob_unit", "cantidad"],
    },
    gpl_total: {
      fn: "pl_unit * cantidad",
      args: [""],
      columns: ["pl_unit", "cantidad"],
    },
    tva_total: {
      fn: "tva * cantidad",
      args: [""],
      columns: ["tva", "cantidad"],
    },
  });

  const form = useForm<PricingData>({
    resolver: zodResolver(pricingDataSchema),
    defaultValues: {
      pricing_charges: defaultPricingCharges,
      pricing_line_items: [defaultLineItem],
    },
  });
  const formValues = form.getValues();

  const { fields: lineItems, append: appendLineItem } = useFieldArray({
    control: form.control,
    name: "pricing_line_items",
  });

  const onSubmit = (values: PricingData) => {
    console.log("onsubmit", values);
    fetcher.submit(
      { action: "create", pricingData: JSON.stringify(values) },
      { method: "POST", encType: "application/json" }
    );
  };

  setUpToolbar(
    () => ({
      titleToolbar: t("f.add-new", { o: t("pricing") }),
      onSave: () => inputRef.current?.click(),
    }),
    [t]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        navigate(
          r.toRoute({
            main: r.pricing,
            routeSufix: [fetcher.data?.pricing?.code || ""],
            q: { tab: "info" },
          })
        );
      },
    },
    [fetcher.data]
  );

  const getValues = useCallback(
    (
      args: string[],
      columns: string[],
      line: LineItemType
    ): Record<string, any> => {
      const record: Record<string, any> = {};
      columns.forEach((column) => {
        record[column] = line[column as keyof LineItemType];
      });
      args.forEach((arg, idx) => {
        const argValue = line[arg as keyof LineItemType];
        const charge = form
          .getValues("pricing_charges")
          .find((c) => c.orderID === argValue);
        if (charge) {
          record[`arg${idx + 1}`] = charge.rate;
        }
      });
      return record;
    },
    [formValues]
  );

  const updateValues = useCallback(
    (lines: LineItemType[]): LineItemType[] => {
      return lines.map((line) => {
        Object.entries(columnConfigs).forEach(([key, config]) => {
          console.log(key, config);
          const values = getValues(config.args, config.columns, line);
          console.log("VALUES", values);
          const result = formula.calculate(config.fn, values);
          console.log("RESULT", result);
          if (line[key as keyof LineItemType] !== undefined) {
            line[key as keyof LineItemType] = result as any;
          }
        });
        return line;
      });
    },
    [columnConfigs]
  );

  const handleCellUpdate = useCallback(
    (row: number, column: string, value: string) => {
      form.setValue(`pricing_line_items.${row}.${column}`, value);
      const updatedLines = updateValues(form.getValues("pricing_line_items"));
      form.setValue("pricing_line_items", updatedLines);
    },
    [formValues]
  );

  return (
    <Card>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("gap-y-3 grid p-3")}
          >
            <div className="max-w-[225px]">
              <PricingTable
                columns={pricingChargeColumns({})}
                data={form.getValues("pricing_charges")}
                rowHeight={24}
              />
            </div>
            <PricingTable
              columns={pricingLineItemColumns()}
              data={lineItems}
              enableRowSelection={true}
              fixedHeight={300}
              metaOptions={{
                meta: {
                  updateCell: handleCellUpdate,
                },
              }}
            />
            <Button
              type="button"
              className=" w-min flex space-x-2"
              variant={"outline"}
              onClick={() => appendLineItem(defaultLineItem)}
            >
              <PlusIcon />
              <span>Agregar fila</span>
            </Button>

            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </Card>
  );
}
