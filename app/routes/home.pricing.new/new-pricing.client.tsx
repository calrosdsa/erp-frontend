"use client";

import React, { useRef, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { action } from "./route";
import { route } from "~/util/route";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  pricingChargeDataSchema,
  pricingDataSchema,
  pricingLineItemDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import PricingData from "./compoments/pricing-data";
import CreateLayout from "@/components/layout/create-layout";

type PricingDataType = z.infer<typeof pricingDataSchema>;
type LineItemType = z.infer<typeof pricingLineItemDataSchema>;
type PricingChargeType = z.infer<typeof pricingChargeDataSchema>;

interface ColumnConfigOption {
  fn: string;
  args: string[];
  columns: string[];
}
const defaultPricingCharges = [
  { name: "Flete", rate: 0.07 },
  { name: "Importacion", rate: 0.13 },
  { name: "Margen", rate: 0.2509825 },
  { name: "Impuestos", rate: 0.192 },
  { name: "Retencion", rate: 0.1429 },
  { name: "TVA", rate: 0.7 },
  { name: "TC", rate: 7.5 },
  { name: "Descuento", rate: 0.45 },
];
export default function NewPricingClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const r = route;
  const inputRef = useRef<HTMLInputElement>(null);
  // const formRef = useRef<HTMLFormElement | null>(null)

  const form = useForm<PricingDataType>({
    resolver: zodResolver(pricingDataSchema),
    defaultValues: {
      pricing_charges: defaultPricingCharges,
      pricing_line_items: [],
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit((values: PricingDataType) => {
      console.log("onsubmit", values);
      fetcher.submit(
        { action: "create", pricingData: values },
        { method: "POST", encType: "application/json" }
      );
    })(e);
  };

  setUpToolbar(
    () => ({
      titleToolbar: t("f.add-new", { o: t("pricing") }),
      onSave: () => inputRef.current?.click(),
    }),
    [t]
  );

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
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
    <CreateLayout>
      {/* {JSON.stringify(form.getValues().pricing_charges)} */}
      <PricingData
        form={form}
        fetcher={fetcher}
        onSubmit={onSubmit}
        inputRef={inputRef}
      />
    </CreateLayout>
  );
}
