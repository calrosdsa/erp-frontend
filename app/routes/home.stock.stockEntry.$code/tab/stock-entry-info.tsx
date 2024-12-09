import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { ItemLineType, State, stateFromJSON, stateToJSON, StockEntryType } from "~/gen/common";
import { GlobalState } from "~/types/app";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import { useEffect, useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { z } from "zod";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { Separator } from "@/components/ui/separator";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import { Form } from "@/components/ui/form";
import { action, loader } from "../route";
import { editStockEntrySchema } from "~/util/data/schemas/stock/stock-entry-schema";
import SelectForm from "@/components/custom/select/SelectForm";

type EditData = z.infer<typeof editStockEntrySchema>;
export default function InvoiceInfoTab() {
  // const { t, i18n } = useTranslation("common");
  // const { invoice, lineItems, totals, taxLines } =
  //   useLoaderData<typeof loader>();
  // const { companyDefaults } = useOutletContext<GlobalState>();
  // const params = useParams();
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { stockEntry, lineItems, actions} =
    useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const [perm] = usePermission({ roleActions, actions });
  const invoiceParty = params.partyInvoice || "";
  const isDraft = stateFromJSON(stockEntry?.status) == State.DRAFT;
  const allowEdit = isDraft && perm?.edit;
  const allowCreate = isDraft && perm.create;

  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editStockEntrySchema,
    defaultValues: {
      id: stockEntry?.id,
      currency: stockEntry?.currency,
      postingTime: stockEntry?.posting_time,
      postingDate: new Date(stockEntry?.posting_date || ""),
      tz: stockEntry?.tz,
      projectID: stockEntry?.project_id,
      entryType:stockEntry?.entry_type,
      projectName: stockEntry?.project,
      costCenterID: stockEntry?.cost_center_id,
      costCenterName: stockEntry?.cost_center,
    },
  });
  const formValues = form.getValues();

  const entryTypes: SelectItem[] = [
    {
      name: t(StockEntryType[StockEntryType.MATERIAL_RECEIPT]),
      value: StockEntryType[StockEntryType.MATERIAL_RECEIPT],
    },
  ];
  
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



  return (
    <Form {...form}>
      <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
        <div className=" info-grid">
          {/* <DisplayTextValue title={t("form.code")} value={stockEntry?.code} /> */}
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

          <CurrencyAndPriceList form={form} allowEdit={allowEdit} />

          <AccountingDimensionForm form={form} allowEdit={allowEdit} />

          <LineItemsDisplay
            currency={stockEntry?.currency || companyDefaults?.currency || ""}
            status={stockEntry?.status || ""}
            lineItems={lineItems}
            partyType={invoiceParty}
            allowCreate={allowCreate}
            allowEdit={allowEdit}
            itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
          />
        

         
        </div>
        <input className="hidden" type="submit" ref={inputRef} />
      </fetcher.Form>
    </Form>
  );
}


// import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
// import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
// import { useTranslation } from "react-i18next";
// import { loader } from "../route";
// import { GlobalState } from "~/types/app";
// import LineItems from "@/components/custom/shared/item/line-items";
// import { ItemLineType, PartyType, partyTypeToJSON, State, stateFromJSON } from "~/gen/common";
// import { formatMediumDate } from "~/util/format/formatDate";
// import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
// import { usePermission } from "~/util/hooks/useActions";

// export default function StockEntryInfo() {
//   const { stockEntry, lineItems,actions } = useLoaderData<typeof loader>();
//   const { t, i18n } = useTranslation("common");
//   const params = useParams();
//   const {roleActions} = useOutletContext<GlobalState>()
//   const [stockEntryPerrm] = usePermission({actions,roleActions})
//   const isDraft = stateFromJSON(stockEntry?.status) == State.DRAFT;
//   const allowEdit = isDraft && stockEntryPerrm?.edit;
//   const allowCreate = isDraft && stockEntryPerrm.create;
//   const { companyDefaults } = useOutletContext<GlobalState>();  
//   return (
//     <div className="info-grid">
//       <DisplayTextValue title={t("form.code")} value={stockEntry?.code} />

//       <DisplayTextValue
//         title={t("form.entryType")}
//         value={stockEntry?.entry_type}
//       />

//       <DisplayTextValue
//         title={t("form.postingDate")}
//         value={formatMediumDate(stockEntry?.posting_date, i18n.language)}
//       />

//       <LineItemsDisplay
//         currency={stockEntry?.currency || companyDefaults?.currency || ""}
//         status={stockEntry?.status || ""}
//         lineItems={lineItems}
//         partyType={partyTypeToJSON(PartyType.stockEntry)}
//         itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
//         allowCreate={allowCreate}
//         allowEdit={allowEdit}
//       />
//     </div>
//   );
// }
