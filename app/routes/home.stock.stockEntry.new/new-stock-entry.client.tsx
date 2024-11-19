import FormLayout from "@/components/custom/form/FormLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createJournalEntrySchema } from "~/util/data/schemas/accounting/journal-entry-schema";
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
import { usePriceListDebounceFetcher } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";

export default function NewStockEntryClient() {
  const { t } = useTranslation("common");
  const route = routes;
  const fetcher = useFetcher<typeof action>();
  const [priceListFetcher, onPriceListChange] = usePriceListDebounceFetcher();
  const [sourceWarehouse, onSourceWarehouseChange] =
    useWarehouseDebounceFetcher({ isGroup: false });
  const [targetWarehouse, onTargetWarehouseChange] =
    useWarehouseDebounceFetcher({ isGroup: false });
  const entryTypes: SelectItem[] = [
    {
      name: t(StockEntryType[StockEntryType.MATERIAL_RECEIPT]),
      value: StockEntryType[StockEntryType.MATERIAL_RECEIPT],
    },
    {
      name: t(StockEntryType[StockEntryType.MATERIAL_TRANSFER]),
      value: StockEntryType[StockEntryType.MATERIAL_TRANSFER],
    },
    {
      name: t(StockEntryType[StockEntryType.MATERIAL_ISSUE]),
      value: StockEntryType[StockEntryType.MATERIAL_ISSUE],
    },
  ];
  const form = useForm<z.infer<typeof createStockEntrySchema>>({
    resolver: zodResolver(createStockEntrySchema),
    defaultValues: {
      lines:[]
    },
  });
  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form>
          <div className="create-grid">
            {/* <Typography className=" col-span-full" variant="title2">
              {t("_payment.type")}
            </Typography> */}
            <CustomFormDate
              form={form}
              name="postingDate"
              label={t("form.date")}
            />
            <SelectForm
              form={form}
              data={entryTypes}
              label={t("form.entryType")}
              keyName={"name"}
              keyValue={"value"}
              name="paymentType"
            />
            <Separator className=" col-span-full" />

            <AccordationLayout
              title={t("priceList")}
              containerClassName=" col-span-full"
              className="create-grid"
            >
              <FormAutocomplete
                onValueChange={onPriceListChange}
                form={form}
                name="priceListName"
                nameK={"name"}
                label={t("priceList")}
                data={priceListFetcher.data?.priceLists || []}
                onSelect={(e) => {
                  form.setValue("priceListID", e.id);
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


            <ItemLineForm
              form={form}
              partyType={partyTypeToJSON(PartyType.stockEntry) || ""}
              itemLineType={ItemLineType.ITEM_LINE_STOCK_ENTRY}
            />
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
