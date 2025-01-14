import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import {
  FetcherWithComponents,
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { z } from "zod";
import { GlobalState } from "~/types/app";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax";
import { create } from "zustand";
import { route } from "~/util/route";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import {
  ItemAutocompleteForm,
  useItemDebounceFetcher,
} from "~/util/hooks/fetchers/useItemDebounceFetcher";
import { useTaxDebounceFetcher } from "~/util/hooks/fetchers/useTaxDebounceFetcher";
import { PriceListAutocompleteForm, usePriceListDebounceFetcher } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";
import { useForm, UseFormReturn } from "react-hook-form";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import CustomFormField from "@/components/custom/form/CustomFormField";
import AmountInput from "@/components/custom/input/AmountInput";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { UomAutocompleteForm, useUomDebounceFetcher } from "~/util/hooks/fetchers/useUomDebounceFetcher";
import { action, loader } from "../route";
import { useCreatePriceList } from "~/routes/home.stock.priceList_/components/add-price-list";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

export default function ItemPriceForm({
  form,
  globalState,
  className,
}: {
  form: UseFormReturn<z.infer<typeof createItemPriceSchema>>;
  globalState: GlobalState;
  className?: string;
}) {
  const { t } = useTranslation("common");
  const data = useLoaderData<typeof loader>();

  const r = route;
  const navigate = useNavigate();
  const loaderFetcher = useFetcher<typeof loader>();
  const associatedActions =
    data.associatedActions || loaderFetcher.data?.associatedActions;

  const [priceListPermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.priceList],
    roleActions: globalState.roleActions,
  });
  const loadData = () => {
    if (associatedActions == undefined) {
      console.log("LOAD DATA...");
      loaderFetcher.submit(
        {},
        {
          action: r.toRoute({
            main: partyTypeToJSON(PartyType.itemPrice),
            routePrefix: [r.stockM],
            routeSufix: ["new"],
          }),
        }
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Typography variant="title2" className=" col-span-full">
        {t("f.and", { o: t("form.quantity"), p: t("form.rate") })}
      </Typography>
      <CustomFormFieldInput
        name="rate"
        required={true}
        label={t("form.rate")}
        control={form.control}
        inputType="input"
      />

      <CustomFormFieldInput
        name="itemQuantity"
        label={t("form.itemQuantity")}
        required={true}
        control={form.control}
        inputType="input"
      />

      <Separator className=" col-span-full" />
      <Typography variant="title2" className=" col-span-full">
        {t("item")}
      </Typography>

      <ItemAutocompleteForm
        control={form.control}
        label={t("item")}
        required={true}
        onSelect={(e) => {
          form.setValue("itemID", e.id);
        }}
      />
      <UomAutocompleteForm
        control={form.control}
        label={t("form.uom")}
        onSelect={(e) => {
          form.setValue("uomID", e.id);
        }}
      />

      {priceListPermission?.view && priceListPermission.create && (
        <>
          <Separator className=" col-span-full" />
          <Typography variant="title2" className=" col-span-full">
            {t("priceList")}
          </Typography>
          <PriceListAutocompleteForm
          control={form.control}
          label={t("priceList")}
          required={true}
          onSelect={(e)=>{
            form.setValue("priceListID",e.id)
          }}
          />
          
        </>
      )}
    </>
  );
}
