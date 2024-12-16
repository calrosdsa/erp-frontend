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
import { ItemLineType, itemLineTypeToJSON, StockEntryType } from "~/gen/common";
import { Separator } from "@/components/ui/separator";
import { createStockEntrySchema } from "~/util/data/schemas/stock/stock-entry-schema";
import AccordationLayout from "@/components/layout/accordation-layout";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useWarehouseDebounceFetcher, WarehouseAutocompleteForm } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { GlobalState } from "~/types/app";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";
import LineItems from "@/components/custom/shared/item/line-items";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { format } from "date-fns";
import { useFormErrorToast } from "~/util/hooks/ui/use-form-error-toast";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { Card } from "@/components/ui/card";

export default function NewStockEntryClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const r = routes;
  const lineItemsStore = useLineItems();
  const entryTypes: SelectItem[] = [
    {
      name: t(StockEntryType[StockEntryType.MATERIAL_RECEIPT]),
      value: StockEntryType[StockEntryType.MATERIAL_RECEIPT],
    },
  ];
  const form = useForm<z.infer<typeof createStockEntrySchema>>({
    resolver: zodResolver(createStockEntrySchema),
    defaultValues: {
      items: [],
      currency: companyDefaults?.currency,
      postingDate: new Date(),
      postingTime: format(new Date(), "HH:mm:ss"),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  const formValues = form.getValues();
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

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

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

  useFormErrorToast(form.formState.errors);

  useEffect(() => {
    lineItemsStore.onLines(formValues.items);
  }, [formValues.items]);
  return (
    <Card>
      <FormLayout className="p-3">
        <Form {...form}>
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="create-grid">
              <SelectForm
                form={form}
                data={entryTypes}
                label={t("form.entryType")}
                keyName={"name"}
                keyValue={"value"}
                name="entryType"
              />
              <CustomFormDate
                control={form.control}
                name="postingDate"
                label={t("form.date")}
              />
              <CustomFormTime
                control={form.control}
                name="postingTime"
                label={t("form.postingTime")}
                description={formValues.tz}
              />
              <CurrencyAutocompleteForm
                control={form.control}
                name="currency"
                label={t("form.currency")}
              />
              {/* <WarehouseAutocompleteForm
                control={form.control}
                label={t("warehouse")}
                name="sourceWarehouse"
                onSelect={(e) => {
                  form.setValue("sourceWarehouseID", e.id);
                }}
                isGroup={false}
              /> */}
              <WarehouseAutocompleteForm
                control={form.control}
                label={t("warehouse")}
                name="targetWarehouse"
                onSelect={(e) => {
                  form.setValue("targetWarehouseID", e.id);
                }}
                isGroup={false}
              />

              <Separator className=" col-span-full" />

              {/* <CurrencyAndPriceList form={form} /> */}

              {/* <AccordationLayout
                title={t("warehouse")}
                open={true}
                containerClassName=" col-span-full"
                className="create-grid"
              >
                <FormAutocomplete
                  onValueChange={onSourceWarehouseChange}
                  form={form}
                  name="sourceWarehouse"
                  nameK={"name"}
                  label={"Origen"}
                  data={sourceWarehouse.data?.warehouses || []}
                  onSelect={(e) => {
                    form.setValue("sourceWarehouseID", e.id);
                  }}
                />
                <FormAutocomplete
                  onValueChange={onTargetWarehouseChange}
                  form={form}
                  name="targetWarehouse"
                  nameK={"name"}
                  label={"Destino"}
                  data={targetWarehouse.data?.warehouses || []}
                  onSelect={(e) => {
                    form.setValue("targetWarehouseID", e.id);
                  }}
                />
              </AccordationLayout> */}

              <LineItems
                onChange={(e) => {
                  form.setValue("items", e);
                  form.trigger("items");
                }}
                lineType={itemLineTypeToJSON(
                  ItemLineType.ITEM_LINE_STOCK_ENTRY
                )}
                docPartyType={r.stockEntry}
                allowEdit={true}
                currency={formValues.currency}
                isNew={true}
              />
              <AccountingDimensionForm form={form} />

            </div>
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </Card>
  );
}
