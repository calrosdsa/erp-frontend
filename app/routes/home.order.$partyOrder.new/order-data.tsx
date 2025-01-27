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
import { quotationDataSchema } from "~/util/data/schemas/quotation/quotation-schema";
import PartyAutocomplete, {
  PartyAutocompleteField,
} from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { Separator } from "@/components/ui/separator";
import LineItems from "@/components/custom/shared/item/line-items";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import { party } from "~/util/party";
import { orderDataSchema } from "~/util/data/schemas/buying/order-schema";

type Data = z.infer<typeof orderDataSchema>;

export const OrderData = ({
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
  const partyOrder = params.partyOrder || "";
  const { t } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const formValues = form.getValues();
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const p = party;

  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.taxLines]);

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.lines]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
            {/* {JSON.stringify(form.formState.errors)} */}
          <div className="create-grid">
            <PartyAutocompleteField
              partyType={partyOrder}
              roleActions={roleActions}
              control={form.control}
              allowEdit={allowEdit}
            />
            <CustomFormDate
              control={form.control}
              name="postingDate"
              label={t("form.postingDate")}
              allowEdit={allowEdit}
            />
            <CustomFormTime
              control={form.control}
              name="postingTime"
              label={t("form.postingTime")}
              allowEdit={allowEdit}
              description={formValues.tz}
            />

            <CustomFormDate
              control={form.control}
              name="deliveryDate"
              label={t("form.deliveryDate")}
              allowEdit={allowEdit}
            />

            {/* <CurrencyAutocompleteForm
              control={form.control}
              name="currency"
              label={t("form.currency")}
              allowEdit={allowEdit}
            /> */}
            <CurrencyAndPriceList
              control={form.control}
              allowEdit={allowEdit}
              isSelling={partyOrder == p.saleOrder}
              isBuying={partyOrder == p.purchaseOrder}
              
            />

            <Separator className=" col-span-full" />

            {/* <CurrencyAndPriceList form={form} /> */}
            <LineItems
              onChange={(e) => {
                form.setValue("lines", e);
                form.trigger("lines");
              }}
              allowEdit={allowEdit}
              allowCreate={allowCreate}
              currency={formValues.currency}
              lineType={itemLineTypeToJSON(ItemLineType.ITEM_LINE_ORDER)}
              docPartyType={partyOrder}
              priceListID={formValues.priceList?.id || undefined}
            />
            <TaxAndChargesLines
              onChange={(e) => {
                form.setValue("taxLines", e);
                form.trigger("taxLines");
              }}
              docPartyType={partyOrder}
              allowCreate={allowCreate}
              allowEdit={allowEdit}
              form={form}
              currency={formValues.currency}
            />
            <GrandTotal currency={formValues.currency} />
            <TaxBreakup currency={formValues.currency} />

            <AccountingDimensionForm form={form} allowEdit={allowEdit} />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
