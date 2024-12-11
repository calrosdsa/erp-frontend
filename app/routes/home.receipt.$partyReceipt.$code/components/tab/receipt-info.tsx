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

          <Separator className=" col-span-full" />

          <CurrencyAndPriceList form={form} allowEdit={allowEdit} />

          <AccountingDimensionForm form={form} allowEdit={allowEdit} />

          <LineItemsDisplay
            currency={receipt?.currency || companyDefaults?.currency || ""}
            status={receipt?.status || ""}
            lineItems={lineItems}
            allowCreate={allowCreate}
            allowEdit={allowEdit}
            docPartyType={partyReceipt}
            docPartyID={receipt?.id}
            lineType={itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT)}
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

// import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
// import Typography, { subtitle } from "@/components/typography/Typography";
// import {
//   Await,
//   useLoaderData,
//   useOutletContext,
//   useParams,
// } from "@remix-run/react";
// import { useTranslation } from "react-i18next";
// import { components } from "~/sdk";
// import { formatMediumDate } from "~/util/format/formatDate";
// import { loader } from "../../route";
// import { DataTable } from "@/components/custom/table/CustomTable";
// import { displayItemLineColumns, lineItemColumns } from "@/components/custom/table/columns/order/order-line-column";
// import { DEFAULT_CURRENCY } from "~/constant";
// import { sumTotal } from "~/util/format/formatCurrency";
// import OrderSumary from "@/components/custom/display/order-sumary";
// import { useItemLine } from "@/components/custom/shared/item/item-line";
// import useTableRowActions from "~/util/hooks/useTableRowActions";
// import { ItemLineType, State, stateToJSON } from "~/gen/common";
// import { GlobalState } from "~/types/app";
// import { Suspense } from "react";
// import FallBack from "@/components/layout/Fallback";
// import LineItems from "@/components/custom/shared/item/line-items";

// export default function ReceiptInfoTab() {
//   const { t, i18n } = useTranslation("common");
//   const { receipt, lineItems } = useLoaderData<typeof loader>();
//   const { companyDefaults } = useOutletContext<GlobalState>();
//   const params = useParams();

//   return (
//     <div>
//       <div className=" info-grid">
//         <DisplayTextValue title={t("form.code")} value={receipt?.code} />
//         <DisplayTextValue title={t("form.party")} value={receipt?.party_name} />
//         <DisplayTextValue
//           title={t("form.date")}
//           value={formatMediumDate(receipt?.posting_date, i18n.language)}
//         />
//         {/* <DisplayTextValue
//                 title={t("form.dueDate")}
//                 value={formatMediumDate(receipt?.due_date,i18n.language)}
//                 /> */}

//         <Typography className=" col-span-full" fontSize={subtitle}>
//           {t("form.currencyAndPriceList")}
//         </Typography>
//         <DisplayTextValue
//           title={t("form.currency")}
//           value={receipt?.currency}
//         />

//         <LineItems
//         currency={receipt?.currency || companyDefaults?.currency || ""}
//         status={receipt?.status || ""}
//         lineItems={lineItems}
// docPartyType={partyReceipt}
//             docPartyID={invoice?.id}
//             lineType={itemLineTypeToJSON(ItemLineType.ITEM_LINE_INVOICE)}
//         />
//       </div>
//     </div>
//   );
// }
