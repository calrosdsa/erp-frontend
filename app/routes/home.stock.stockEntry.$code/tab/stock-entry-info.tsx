import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { ItemLineType, itemLineTypeToJSON, State, stateFromJSON, stateToJSON, StockEntryType } from "~/gen/common";
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
import SelectForm from "@/components/custom/select/SelectForm";
import { StockEntryData } from "~/routes/home.stock.stockEntry.new/stock-entry-data";
import { stockEntryDataSchema } from "~/util/data/schemas/stock/stock-entry-schema";
import { useToolbar } from "~/util/hooks/ui/useToolbar";

type EditData = z.infer<typeof stockEntryDataSchema>;
export default function InvoiceInfoTab() {
  // const { t, i18n } = useTranslation("common");
  // const { invoice, lineItems, totals, taxLines } =
  //   useLoaderData<typeof loader>();
  // const { companyDefaults } = useOutletContext<GlobalState>();
  // const params = useParams();
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { stockEntry, actions} =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const isDraft = stateFromJSON(stockEntry?.status) == State.DRAFT;
  const allowEdit = isDraft && perm?.edit;
  const allowCreate = isDraft && perm.create;
  const toolbar = useToolbar()
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: stockEntryDataSchema,
    defaultValues: {
      id: stockEntry?.id,
      currency: stockEntry?.currency,
      postingTime: stockEntry?.posting_time,
      postingDate: new Date(stockEntry?.posting_date || ""),
      tz: stockEntry?.tz,
      entryType:stockEntry?.entry_type,
      
      sourceWarehouse: {
        id: stockEntry?.source_warehouse_id,
        name: stockEntry?.source_warehouse,
        uuid: stockEntry?.source_warehouse_uuid,
      },
      targetWarehouse: {
        id: stockEntry?.target_warehouse_id,
        name: stockEntry?.target_warehouse,
        uuid: stockEntry?.target_warehouse_uuid,
      },
    },
  });
  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        stockEntryData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useEffect(()=>{
    toolbar.setToolbar({
      onSave: () => inputRef.current?.click(),
    })
  },[toolbar.isMounted])

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
    <StockEntryData
    form={form}
    inputRef={inputRef}
    onSubmit={onSubmit}
    fetcher={fetcher}
    allowCreate={allowCreate}
    allowEdit={allowEdit}
    />
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
