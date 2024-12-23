"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
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
  pricingChargeDataSchema,
  pricingDataSchema,
  pricingLineItemDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { FormulaEngine } from "./util/formula";
import { cn } from "@/lib/utils";
import { PricingTable } from "./compoments/pricing-table";
import { PlusIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DataTable } from "@/components/custom/table/CustomTable";
import PricingData from "./compoments/pricing-data";

type PricingData = z.infer<typeof pricingDataSchema>;
type LineItemType = z.infer<typeof pricingLineItemDataSchema>;
type PricingChargeType = z.infer<typeof pricingChargeDataSchema>;

interface ColumnConfigOption {
  fn: string;
  args: string[];
  columns: string[];
}
const defaultPricingCharges = [
  { name: "Flete", rate: 0.07, orderID: 1 },
  { name: "Importacion", rate: 0.13, orderID: 2 },
  { name: "Margen", rate: 0.2509825, orderID: 3 },
  { name: "Impuestos", rate: 0.192, orderID: 4 },
  { name: "Retencion", rate: 0.1429, orderID: 5 },
  { name: "TVA", rate: 0.7, orderID: 6 },
  { name: "TC", rate: 7.5, orderID: 7 },
  { name: "Descuento", rate: 0.45, orderID: 8 },
];
export default function NewPricingClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const r = routes;
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PricingData>({
    resolver: zodResolver(pricingDataSchema),
    defaultValues: {
      pricing_charges: defaultPricingCharges,
      pricing_line_items: [],
    },
  });



  const onSubmit = (values: PricingData) => {
    console.log("onsubmit", values);
    fetcher.submit(
      { action: "create", pricingData: values },
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

  

  return (
    <Card>
      <FormLayout>
        <Form {...form}>
          {/* {JSON.stringify(formValues.pricing_line_items)} */}
          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("gap-y-3 grid p-3")}
          >
            <PricingData
            form={form}
            />

            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </Card>
  );
}
