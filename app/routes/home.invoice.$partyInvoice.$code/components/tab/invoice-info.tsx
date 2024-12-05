import { components } from "~/sdk";
import { useTranslation } from "react-i18next";
import { formatCurrency, sumTotal } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { formatMediumDate } from "~/util/format/formatDate";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { action, loader } from "../../route";
import { ItemLineType, State, stateFromJSON, stateToJSON } from "~/gen/common";
import { Typography } from "@/components/typography";
import { GlobalState } from "~/types/app";
import LineItems from "@/components/custom/shared/item/line-items";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import { useEffect, useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { z } from "zod";
import { editInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import PartyAutocomplete from "~/routes/home.order.$partyOrder.new/components/party-autocomplete";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { Separator } from "@/components/ui/separator";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import { Form } from "@/components/ui/form";

type EditData = z.infer<typeof editInvoiceSchema>;
export default function InvoiceInfoTab() {
  // const { t, i18n } = useTranslation("common");
  // const { invoice, lineItems, totals, taxLines } =
  //   useLoaderData<typeof loader>();
  // const { companyDefaults } = useOutletContext<GlobalState>();
  // const params = useParams();
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { invoice, lineItems, taxLines, actions, totals } =
    useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const [invoicePerm] = usePermission({ roleActions, actions });
  const invoiceParty = params.partyInvoice || "";
  const isDraft = stateFromJSON(invoice?.status) == State.DRAFT;
  const isDisabled = !isDraft || !invoicePerm?.edit;
  const documentStore = useDocumentStore();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editInvoiceSchema,
    defaultValues: {
      id: invoice?.id,
      partyID: invoice?.party_id,
      partyName: invoice?.party_name,
      currency: invoice?.currency,
      postingTime: invoice?.posting_time,
      postingDate: new Date(invoice?.posting_date || ""),
      dueDate: new Date(invoice?.due_date || new Date()),
      tz: invoice?.tz,
      projectID: invoice?.project_id,
      projectName: invoice?.project,
      costCenterID: invoice?.cost_center_id,
      costCenterName: invoice?.cost_center,
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
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    documentStore.setData({
      partyID: invoice?.party_id,
      documentRefernceID: invoice?.id,
      partyName: invoice?.party_name,
      currency: invoice?.currency,
      projectID: invoice?.project_id,
      projectName: invoice?.project,
      costCenterID: invoice?.cost_center_id,
      costCenterName: invoice?.cost_center,
    });
  }, [invoice]);

  return (
    <Form {...form}>
      <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
        <div className=" info-grid">
          {/* <DisplayTextValue title={t("form.code")} value={invoice?.code} /> */}
          <PartyAutocomplete
            party={invoiceParty}
            roleActions={roleActions}
            form={form}
            disabled={isDisabled}
          />
          <CustomFormDate
            control={form.control}
            name="postingDate"
            disabled={isDisabled}
            label={t("form.postingDate")}
          />
          <CustomFormTime
            control={form.control}
            name="postingTime"
            label={t("form.postingTime")}
            disabled={isDisabled}
            description={formValues.tz}
          />
          <CustomFormDate
            control={form.control}
            name="dueDate"
            disabled={isDisabled}
            label={t("form.dueDate")}
          />

          <Separator className=" col-span-full" />

          <CurrencyAndPriceList form={form} disabled={isDisabled} />

          <AccountingDimensionForm form={form} disabled={isDisabled} />

          <LineItemsDisplay
            currency={invoice?.currency || companyDefaults?.currency || ""}
            status={invoice?.status || ""}
            lineItems={lineItems}
            partyType={invoiceParty}
            itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
          />
          {invoice && (
            <>
              <TaxAndCharges
                currency={invoice.currency}
                status={invoice.status}
                taxLines={taxLines}
                docPartyID={invoice.id}
              />

              <GrandTotal currency={invoice.currency} />

              <TaxBreakup currency={invoice.currency} />
            </>
          )}

          {totals && invoice && (
            <>
              <Typography variant="title1" className=" col-span-full">
                {t("form.totals")}
              </Typography>

              <DisplayTextValue
                title={t("form.paidAmount")}
                value={formatCurrency(
                  invoice.paid,
                  invoice.currency,
                  i18n.language
                )}
              />
              <DisplayTextValue
                title={t("form.outstandingAmount")}
                value={formatCurrency(
                  invoice.total - invoice.paid,
                  invoice.currency,
                  i18n.language
                )}
              />
            </>
          )}
        </div>
        <input className="hidden" type="submit" ref={inputRef} />
      </fetcher.Form>
    </Form>
  );
}
