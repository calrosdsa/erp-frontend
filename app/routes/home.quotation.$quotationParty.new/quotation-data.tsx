import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import {
  FetcherWithComponents,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { MutableRefObject, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { quotationDataSchema } from "~/util/data/schemas/quotation/quotation-schema";
import PartyAutocomplete, {
  PartyAutocompleteField,
} from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app-types";
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
import { cn } from "@/lib/utils";
import { DocumentRegisters } from "@/components/custom/shared/document/document-registers";

type QuotationData = z.infer<typeof quotationDataSchema>;

export const QuotationData = ({
  fetcher,
  onSubmit,
  inputRef,
  form,
  allowEdit,
  allowCreate,
}: // isNew,
{
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<QuotationData>;
  onSubmit: (e: QuotationData) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  allowCreate?: boolean;
  // isNew?: boolean;
}) => {
  const params = useParams();
  const quotationParty = params.quotationParty || "";
  const { t } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const formValues = form.getValues();
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const [searchParams, setSearchParams] = useSearchParams();
  const p = party;

  const openModal = (key: string, value: any, args?: Record<string, any>) => {
    searchParams.set(key, value);
    if (args) {
      Object.entries(args).forEach(([key, value]) => {
        searchParams.set(key, value);
      });
    }
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.taxLines]);

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.lines]);

  DocumentRegisters({ form });

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          // className={cn(isNew ? "create-grid" : "detail-grid")}
          className={cn("create-grid")}
        >
          <PartyAutocompleteField
            partyType={quotationParty}
            roleActions={roleActions}
            form={form}
            allowEdit={allowEdit}
            openModal={openModal}
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
            name="validTill"
            label={t("form.validTill")}
            allowEdit={allowEdit}
          />

          <CurrencyAndPriceList
            form={form}
            allowEdit={allowEdit}
            isSelling={quotationParty == p.salesQuotation}
            isBuying={quotationParty == p.supplierQuotation}
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
            lineType={itemLineTypeToJSON(ItemLineType.QUOTATION_LINE_ITEM)}
            docPartyType={quotationParty}
            priceListID={formValues.priceList?.id || undefined}
          />
          <TaxAndChargesLines
            onChange={(e) => {
              form.setValue("taxLines", e);
              form.trigger("taxLines");
            }}
            docPartyType={quotationParty}
            allowCreate={allowCreate}
            allowEdit={allowEdit}
            form={form}
            currency={formValues.currency}
          />
          <GrandTotal currency={formValues.currency} />
          <TaxBreakup currency={formValues.currency} />

          <AccountingDimensionForm form={form} allowEdit={allowEdit} />
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
