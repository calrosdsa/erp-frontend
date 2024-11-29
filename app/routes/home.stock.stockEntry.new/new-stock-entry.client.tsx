import FormLayout from "@/components/custom/form/FormLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Navigate,
  useFetcher,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { routes } from "~/util/route";
import { action } from "./route";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import SelectForm from "@/components/custom/select/SelectForm";
import {
  ItemLineType,
  PartyType,
  partyTypeToJSON,
  StockEntryType,
} from "~/gen/common";
import { Separator } from "@/components/ui/separator";
import { createStockEntrySchema } from "~/util/data/schemas/stock/stock-entry-schema";
import AccordationLayout from "@/components/layout/accordation-layout";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { GlobalState } from "~/types/app";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";
import LineItems from "@/components/custom/shared/item/line-items";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";

export default function NewStockEntryClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const [priceListFetcher, onPriceListChange] = usePriceListDebounceFetcher();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const navigate = useNavigate();
  const r = routes;
  const lineItemsStore = useLineItems();
  const [sourceWarehouse, onSourceWarehouseChange] =
    useWarehouseDebounceFetcher({ isGroup: false });
  const [targetWarehouse, onTargetWarehouseChange] =
    useWarehouseDebounceFetcher({ isGroup: false });
  const entryTypes: SelectItem[] = [
    {
      name: t(StockEntryType[StockEntryType.MATERIAL_RECEIPT]),
      value: StockEntryType[StockEntryType.MATERIAL_RECEIPT],
    },
  ];
  const form = useForm<z.infer<typeof createStockEntrySchema>>({
    resolver: zodResolver(createStockEntrySchema),
    defaultValues: {
      lines: [],
      currency: companyDefaults?.currency,
    },
  });
  const formValues = form.getValues()
  const onSubmit = (e: z.infer<typeof createStockEntrySchema>) => {
    fetcher.submit(
      {
        createStockEntry: e as any,
        action: "create-stock-entry",
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", { o: t("stockEntry") }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onShowMessage: () => {
        if (fetcher.data) {
          navigate(
            r.toRoute({
              main: r.stockEntry,
              routePrefix: [r.stockM],
              routeSufix: [fetcher.data.stockEntry?.code || ""],
              q: {
                tab: "info",
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
  }, [formValues.lines]);
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            <CustomFormDate
              control={form.control}
              name="postingDate"
              label={t("form.date")}
            />
            <SelectForm
              form={form}
              data={entryTypes}
              label={t("form.entryType")}
              keyName={"name"}
              keyValue={"value"}
              name="stockEntryType"
            />
            <Separator className=" col-span-full" />

            <AccordationLayout
              title={t("form.currency")}
              containerClassName=" col-span-full"
              className="create-grid"
            >
              <FormAutocomplete
                data={currencyDebounceFetcher.data?.currencies || []}
                form={form}
                name="currency"
                required={true}
                nameK={"code"}
                onValueChange={onCurrencyChange}
                label={t("form.currency")}
                onSelect={(v) => {
                  form.setValue("currency", v.code);
                  form.trigger("currency");
                }}
              />
            </AccordationLayout>

            <AccordationLayout
              title={t("warehouse")}
              open={true}
              containerClassName=" col-span-full"
              className="create-grid"
            >
              <FormAutocomplete
                onValueChange={onSourceWarehouseChange}
                form={form}
                name="sourceWarehouseName"
                nameK={"name"}
                label={t("f.source", { o: t("warehouse") })}
                data={sourceWarehouse.data?.warehouses || []}
                onSelect={(e) => {
                  form.setValue("sourceWarehouse", e.id);
                }}
              />
              <FormAutocomplete
                onValueChange={onTargetWarehouseChange}
                form={form}
                name="targetWarehouseName"
                nameK={"name"}
                label={t("f.target", { o: t("warehouse") })}
                data={targetWarehouse.data?.warehouses || []}
                onSelect={(e) => {
                  form.setValue("targetWarehouse", e.id);
                }}
              />
            </AccordationLayout>

            <LineItems
                onChange={(e) => {
                  form.setValue("lines", e);
                  form.trigger("lines");
                }}
                itemLineType={ItemLineType.ITEM_LINE_STOCK_ENTRY}
                partyType={r.stockEntry}
                currency={formValues.currency}
              />

          
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
