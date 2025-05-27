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
import { PartyAutocompleteField } from "../home.order.$partyOrder.new/components/party-autocomplete";
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
import UpdateStock from "@/components/custom/shared/document/update-stock";
import { receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { cn } from "@/lib/utils";
import { DocumentRegisters } from "@/components/custom/shared/document/document-registers";
import { useModalNav } from "~/util/hooks/app/use-open-modal";

type Data = z.infer<typeof receiptDataSchema>;

export const ReceiptData = ({
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
  const partyReceipt = params.partyReceipt || "";
  const { t } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const formValues = form.getValues();
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const p = party;
  const { openModal } = useModalNav();

  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.taxLines]);

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.lines]);

  DocumentRegisters({form})

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            // isNew ? "create-grid" : "detail-grid"
            "create-grid"
          )}
        >
          <PartyAutocompleteField
            partyType={partyReceipt}
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

          <CurrencyAndPriceList
            form={form}
            allowEdit={allowEdit}
            isSelling={partyReceipt == p.salesQuotation}
            isBuying={partyReceipt == p.supplierQuotation}
          />

          <Separator className=" col-span-full" />

          <UpdateStock
            form={form}
            updateStock={true}
            allowEdit={allowEdit}
            partyType={partyReceipt}
          />
          <LineItems
            onChange={(e) => {
              form.setValue("lines", e);
              form.trigger("lines");
            }}
            allowEdit={allowEdit}
            allowCreate={allowCreate}
            currency={formValues.currency}
            lineType={itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT)}
            docPartyType={partyReceipt}
            roleActions={roleActions}
            priceListID={formValues.priceList?.id || undefined}
            // complement={
            //   <UpdateStock
            //     form={form}
            //     updateStock={true}
            //     partyType={partyReceipt}
            //   />
            // }
          />
          <TaxAndChargesLines
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
          <TaxBreakup currency={formValues.currency} />

          <AccountingDimensionForm form={form} allowEdit={allowEdit} 
          openModal={openModal}/>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
