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
import { action, loader } from "../../route";
import {
  ItemLineType,
  itemLineTypeToJSON,
  PartyType,
  partyTypeToJSON,
  State,
  stateFromJSON,
  stateToJSON,
} from "~/gen/common";
import { GlobalState } from "~/types/app";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import { Separator } from "@/components/ui/separator";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { useEffect, useRef } from "react";
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
import { usePermission } from "~/util/hooks/useActions";
import { useEditFields } from "~/util/hooks/useEditFields";
import { editReceiptSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";

type EditData = z.infer<typeof editReceiptSchema>;
export default function ReceiptInfoTab() {
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { receipt, lineItems, taxLines, actions } =
    useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const [receiptPerm] = usePermission({ roleActions, actions });
  const partyReceipt = params.partyReceipt || "";
  const isDraft = stateFromJSON(receipt?.status) == State.DRAFT;
  const allowEdit = isDraft && receiptPerm?.edit;
  const allowCreate = isDraft && receiptPerm.create;
  const documentStore = useDocumentStore();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editReceiptSchema,
    defaultValues: {
      id: receipt?.id,
      partyID: receipt?.party_id,
      partyName: receipt?.party_name,
      currency: receipt?.currency,
      postingTime: receipt?.posting_time,
      postingDate: new Date(receipt?.posting_date || ""),
      tz: receipt?.tz,
      projectID: receipt?.project_id,
      projectName: receipt?.project,
      costCenterID: receipt?.cost_center_id,
      costCenterName: receipt?.cost_center,
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
      partyID: receipt?.party_id,
      documentRefernceID: receipt?.id,
      partyName: receipt?.party_name,
      currency: receipt?.currency,
      projectID: receipt?.project_id,
      projectName: receipt?.project,
      costCenterID: receipt?.cost_center_id,
      costCenterName: receipt?.cost_center,
    });
  }, [receipt]);
  return (
    <Form {...form}>
      <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
        <div className=" info-grid">
          <PartyAutocomplete
            party={partyReceipt}
            roleActions={roleActions}
            form={form}
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

          <CurrencyAutocompleteForm
            control={form.control}
            name="currency"
            label={t("form.currency")}
            allowEdit={allowEdit}
          />

          <Separator className=" col-span-full" />

          {/* <CurrencyAndPriceList form={form} allowEdit={allowEdit} /> */}

          <AccountingDimensionForm form={form} allowEdit={allowEdit} />
          <LineItemsDisplay
            currency={receipt?.currency || companyDefaults?.currency || ""}
            status={receipt?.status || ""}
            lineItems={lineItems}
            allowCreate={allowCreate}
            allowEdit={allowEdit}
            docPartyType={partyReceipt}
            docPartyID={receipt?.id}
            lineType={
              partyReceipt == partyTypeToJSON(PartyType.purchaseReceipt)
                ? itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT)
                : itemLineTypeToJSON(ItemLineType.DELIVERY_LINE_ITEM)
            }
          />
          {receipt && (
            <>
              <TaxAndCharges
                currency={receipt.currency}
                status={receipt.status}
                taxLines={taxLines}
                docPartyID={receipt.id}
                docPartyType={partyReceipt}
                allowCreate={allowCreate}
                allowEdit={allowEdit}
              />

              <GrandTotal currency={receipt.currency} />

              <TaxBreakup currency={receipt.currency} />
            </>
          )}
        </div>
        <input className="hidden" type="submit" ref={inputRef} />
      </fetcher.Form>
    </Form>
  );
}
