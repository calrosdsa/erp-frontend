import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { action, loader } from "../../route";
import { State, stateFromJSON, stateToJSON } from "~/gen/common";
import { Typography } from "@/components/typography";
import { GlobalState } from "~/types/app";
import { useEffect, useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { z } from "zod";
import { invoiceDataSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import {
  setUpToolbar,
  setUpToolbarTab,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { SetupToolbarOpts, useToolbar } from "~/util/hooks/ui/useToolbar";
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
      invoicePartyType: partyInvoice,
      docReferenceID: invoice?.doc_reference_id,
      postingTime: invoice?.posting_time,
      postingDate: new Date(invoice?.posting_date || ""),
      dueDate: new Date(invoice?.due_date || new Date()),
      tz: invoice?.tz,
      updateStock: invoice?.update_stock,
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
      warehouse: {
        id: invoice?.warehouse_id,
        name: invoice?.warehouse,
        uuid: invoice?.warehouse_uuid,
      },
      taxLines: taxLines.map((t) => toTaxAndChargeLineSchema(t)),
      lines: lineItems.map((t) =>
        toLineItemSchema(t, {
          partyType: partyInvoice,
          updateStock: invoice?.update_stock,
        })
      ),
    },
  });
  const { setRegister } = useSetupToolbarStore();

  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        invoiceData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  // setUpToolbarTab(() => {
  //   return {
  //     onSave: () => {
  //       inputRef.current?.click();
  //     },
  //     disabledSave: !allowEdit,
  //   };
  // }, [allowEdit, invoice]);

  useEffect(() => {
    setRegister("tab", {
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

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
    <>
      <InvoiceData
        form={form}
        fetcher={fetcher}
        allowEdit={allowEdit}
        allowCreate={allowCreate}
        inputRef={inputRef}
        onSubmit={onSubmit}
      />
    </>
  );
}
