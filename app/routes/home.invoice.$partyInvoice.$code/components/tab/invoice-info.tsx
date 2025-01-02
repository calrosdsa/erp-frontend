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
import {
  ItemLineType,
  itemLineTypeToJSON,
  State,
  stateFromJSON,
  stateToJSON,
} from "~/gen/common";
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
import { invoiceDataSchema } from "~/util/data/schemas/invoice/invoice-schema";
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
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { toLineItemSchema } from "~/util/data/schemas/stock/line-item-schema";
import { InvoiceData } from "~/routes/home.invoice.$partyInvoice.new/invoice-data";

type EditData = z.infer<typeof invoiceDataSchema>;
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
  const partyInvoice = params.partyInvoice || "";
  const isDraft = stateFromJSON(invoice?.status) == State.DRAFT;
  const allowEdit = isDraft && invoicePerm?.edit;
  const allowCreate = isDraft && invoicePerm.create;
  const documentStore = useDocumentStore();
  const toolbar = useToolbar();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: invoiceDataSchema,
    defaultValues: {
      id: invoice?.id,
      currency: invoice?.currency,
      postingTime: invoice?.posting_time,
      postingDate: new Date(invoice?.posting_date || ""),
      dueDate: new Date(invoice?.due_date || new Date()),
      tz: invoice?.tz,
      updateStock:invoice?.update_stock,
      party: {
        id: invoice?.party_id,
        name: invoice?.party_name,
        uuid: invoice?.party_uuid,
      },
      project: {
        id: invoice?.project_id,
        name: invoice?.project,
        uuid: invoice?.project_uuid,
      },
      costCenter: {
        id: invoice?.cost_center_id,
        name: invoice?.cost_center,
        uuid: invoice?.cost_center_uuid,
      },
      priceList: {
        id: invoice?.price_list_id,
        name: invoice?.price_list,
        uuid: invoice?.price_list_uuid,
      },
      warehouse:{
        id:invoice?.warehouse_id,
        name:invoice?.warehouse,
        uuid:invoice?.warehouse_uuid,
      },
      taxLines: taxLines.map((t) => toTaxAndChargeLineSchema(t)),
      lines: lineItems.map((t) =>
        toLineItemSchema(t, {
          partyType:partyInvoice,
          updateStock:invoice?.update_stock,
        })
      ),
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

  useEffect(()=>{
    // console.log("HAS CHANGE",hasChanged)
    toolbar.setToolbar({
      onSave: () => inputRef.current?.click(),
        // disabledSave: !hasChanged,
    })
  },[invoice])

  // useEffect(() => {
  //   toolbar.setToolbar({
  //     onSave: () => inputRef.current?.click(),
  //     disabledSave: !hasChanged,
  //   });
  // }, [hasChanged]);

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
   <InvoiceData
   form={form}
   fetcher={fetcher}
   allowEdit={allowEdit}
   allowCreate={allowCreate}
   inputRef={inputRef}
   onSubmit={onSubmit}
   />
  );
}
