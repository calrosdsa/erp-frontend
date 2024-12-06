import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { subtitle } from "@/components/typography/Typography";
import {
  Await,
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatMediumDate } from "~/util/format/formatDate";
import { action, loader } from "../../route";
import { ItemLineType, State, stateFromJSON, stateToJSON } from "~/gen/common";
import { GlobalState } from "~/types/app";
import LineItems from "@/components/custom/shared/item/line-items";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";
import { useTotal } from "~/util/hooks/data/useTotal";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import { Separator } from "@/components/ui/separator";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { useEffect, useRef } from "react";
import { editQuotationSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDays,
  addHours,
  format,
  formatRFC3339,
  parse,
  parseISO,
} from "date-fns";
import { z } from "zod";
import PartyAutocomplete from "~/routes/home.order.$partyOrder.new/components/party-autocomplete";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { Form } from "@/components/ui/form";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { toZonedTime } from "date-fns-tz";
import { usePermission } from "~/util/hooks/useActions";
import { useEditFields } from "~/util/hooks/useEditFields";

type EditData = z.infer<typeof editQuotationSchema>;
export default function QuotationInfoTab() {
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { quotation, lineItems, taxLines, actions } =
    useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const [quotationPerm] = usePermission({roleActions,actions});
  const quotationParty = params.quotationParty || "";
  const isDraft = stateFromJSON(quotation?.status) == State.DRAFT;
  const isDisabled = !isDraft || !quotationPerm?.edit
  const documentStore = useDocumentStore();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editQuotationSchema,
    defaultValues: {
      id: quotation?.id,
      partyID: quotation?.party_id,
      partyName: quotation?.party_name,
      currency: quotation?.currency,
      postingTime: quotation?.posting_time,
      postingDate: new Date(quotation?.posting_date || ""),
      validTill: new Date(quotation?.valid_till || new Date()),
      tz: quotation?.tz,
      projectID: quotation?.project_id,
      projectName: quotation?.project,
      costCenterID: quotation?.cost_center_id,
      costCenterName: quotation?.cost_center,
    },
  });
  const formValues = form.getValues();
 

  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
  );

  useLoadingTypeToolbar({
    loading:fetcher.state == "submitting",
    loadingType:"SAVE"
  }, [fetcher.state]);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    documentStore.setData({
      partyID: quotation?.party_id,
      documentRefernceID: quotation?.id,
      partyName: quotation?.party_name,
      currency: quotation?.currency,
      projectID: quotation?.project_id,
      projectName: quotation?.project,
      costCenterID: quotation?.cost_center_id,
      costCenterName: quotation?.cost_center,
    });
  }, [quotation]);
  return (
    <Form {...form}>
      <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
        <div className=" info-grid">
          <PartyAutocomplete
            party={quotationParty}
            roleActions={roleActions}
            form={form}
            allowEdit={isDisabled}
          />
          <CustomFormDate
            control={form.control}
            name="postingDate"
            allowEdit={isDisabled}
            label={t("form.postingDate")}
          />
          <CustomFormTime
            control={form.control}
            name="postingTime"
            label={t("form.postingTime")}
            allowEdit={isDisabled}
            description={formValues.tz}
          />

          <CustomFormDate
            control={form.control}
            name="validTill"
            allowEdit={isDisabled}
            label={t("form.validTill")}
          />

          <Separator className=" col-span-full" />

          <CurrencyAndPriceList form={form} allowEdit={isDisabled} />

          <AccountingDimensionForm form={form} allowEdit={isDisabled} />

          <LineItemsDisplay
            currency={quotation?.currency || companyDefaults?.currency || ""}
            status={quotation?.status || ""}
            lineItems={lineItems}
            partyType={params.partyReceipt || ""}
            itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
          />
          {quotation && (
            <>
              <TaxAndCharges
                currency={quotation.currency}
                status={quotation.status}
                taxLines={taxLines}
                docPartyID={quotation.id}
              />

              <GrandTotal currency={quotation.currency} />

              <TaxBreakup currency={quotation.currency} />
            </>
          )}
        </div>
        <input className="hidden" type="submit" ref={inputRef} />
      </fetcher.Form>
    </Form>
  );
}
