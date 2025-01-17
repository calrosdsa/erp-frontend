import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import {
  FetcherWithComponents,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { MutableRefObject, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PartyAutocompleteField } from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { Separator } from "@/components/ui/separator";
import LineItems from "@/components/custom/shared/item/line-items";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { ItemLineType, itemLineTypeToJSON, StockEntryType } from "~/gen/common";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import { party } from "~/util/party";
import UpdateStock from "@/components/custom/shared/document/update-stock";
import { receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";
import SelectForm from "@/components/custom/select/SelectForm";
import { stockEntryDataSchema } from "~/util/data/schemas/stock/stock-entry-schema";
import { WarehouseAutocompleteFormField } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { Typography } from "@/components/typography";

type Data = z.infer<typeof stockEntryDataSchema>;

export const StockEntryData = ({
  fetcher,
  onSubmit,
  inputRef,
  form,
  allowEdit,
  allowCreate,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<Data>;
  onSubmit: (e: Data) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  allowCreate?: boolean;
}) => {
  const params = useParams();
  const { t } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const formValues = form.getValues();
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const p = party;

  const entryTypes: SelectItem[] = [
    {
      name: t(StockEntryType[StockEntryType.MATERIAL_RECEIPT]),
      value: StockEntryType[StockEntryType.MATERIAL_RECEIPT],
    },
  ];

  useEffect(() => {
    
    lineItemsStore.onLines(formValues.items);
    taxLinesStore.updateFromItems(formValues.items);
  }, [formValues.items]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          <div className="create-grid">
            <SelectForm
              form={form}
              data={entryTypes}
              label={t("form.entryType")}
              keyName={"name"}
              keyValue={"value"}
              name="entryType"
              allowEdit={allowEdit}
            />
            <CustomFormDate
              control={form.control}
              name="postingDate"
              allowEdit={allowEdit}
              label={t("form.postingDate")}
            />
            <CustomFormTime
              control={form.control}
              name="postingTime"
              label={t("form.postingTime")}
              allowEdit={allowEdit}
              description={formValues.tz}
            />

            <Separator className=" col-span-full" />
            <Typography variant="subtitle2" className="col-span-full">
              Almacenes
            </Typography>
            <WarehouseAutocompleteFormField
              control={form.control}
              name="sourceWarehouse"
              label={"Almacen de Origen"}
              isGroup={false}
            />
            <WarehouseAutocompleteFormField
              control={form.control}
              name="targetWarehouse"
              label={"Almacen de Destino"}
              isGroup={false}
            />

            {/* <UpdateStock
              form={form}
              updateStock={true}
              partyType={p}
            /> */}
            <LineItems
              onChange={(e) => {
                form.setValue("items", e);
                form.trigger("items");
              }}
              allowEdit={allowEdit}
              allowCreate={allowCreate}
              currency={formValues.currency}
              lineType={itemLineTypeToJSON(ItemLineType.ITEM_LINE_STOCK_ENTRY)}
              docPartyType={p.stockEntry}
              // complement={
              //   <UpdateStock
              //     form={form}
              //     updateStock={true}
              //     partyType={partyReceipt}
              //   />
              // }
            />
            {/* <TaxAndChargesLines
              onChange={(e) => {
                form.setValue("taxLines", e);
                form.trigger("taxLines");
              }}
              docPartyType={partyReceipt}
              allowCreate={allowCreate}
              allowEdit={allowEdit}
              form={form}
              currency={formValues.currency}
            />
            <GrandTotal currency={formValues.currency} />
            <TaxBreakup currency={formValues.currency} /> */}

            <AccountingDimensionForm form={form} allowEdit={allowEdit} />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
