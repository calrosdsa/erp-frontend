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
  State,
  stateFromJSON,
} from "~/gen/common";
import { GlobalState } from "~/types/app-types";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbarTab,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { ReceiptData } from "~/routes/home.receipt.$partyReceipt.new/receipt-data";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { toLineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

type EditData = z.infer<typeof receiptDataSchema>;
export default function ReceiptInfoTab() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { receipt, lineItems, taxLines, actions } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const [receiptPerm] = usePermission({ roleActions, actions });
  const partyReceipt = params.partyReceipt || "";
  const isDraft = stateFromJSON(receipt?.status) == State.DRAFT;
  const allowEdit = isDraft && receiptPerm?.edit;
  const allowCreate = isDraft && receiptPerm.create;
  const documentStore = useDocumentStore();
  const toolbar = useToolbar();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: receiptDataSchema,
    defaultValues: {
      id: receipt?.id,
      currency: receipt?.currency,
      postingTime: receipt?.posting_time,
      postingDate: new Date(receipt?.posting_date || ""),
      tz: receipt?.tz,
      docReferenceID: receipt?.doc_reference_id,
      receiptPartyType: partyReceipt,
      party: {
        id: receipt?.party_id,
        name: receipt?.party_name,
        uuid: receipt?.party_uuid,
      },
      project: {
        id: receipt?.project_id,
        name: receipt?.project,
        uuid: receipt?.project_uuid,
      },
      costCenter: {
        id: receipt?.cost_center_id,
        name: receipt?.cost_center,
        uuid: receipt?.cost_center_uuid,
      },
      priceList: {
        id: receipt?.price_list_id,
        name: receipt?.price_list,
        uuid: receipt?.price_list_uuid,
      },
      warehouse: {
        id: receipt?.warehouse_id,
        name: receipt?.warehouse,
        uuid: receipt?.warehouse_uuid,
      },
      taxLines: taxLines.map((t) => toTaxAndChargeLineSchema(t)),
      lines: lineItems.map((t) =>
        toLineItemSchema(t, {
          partyType: partyReceipt,
        })
      ),
    },
  });
  const formValues = form.getValues();
  const { setRegister } = useSetupToolbarStore();

  const onSubmit = (e: EditData) => {
    console.log("SUBMIT... DATA");
    fetcher.submit(
      {
        action: "edit",
        receiptData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

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
      partyID: receipt?.party_id,
      documentRefernceID: receipt?.id,
      partyName: receipt?.party_name,
      currency: receipt?.currency,
      projectID: receipt?.project_id,
      projectName: receipt?.project,
      costCenterID: receipt?.cost_center_id,
      costCenterName: receipt?.cost_center,
      priceListID: receipt?.price_list_id,
      priceListName: receipt?.price_list,
    });
  }, [receipt]);
  return (
    <>
      <ReceiptData
        inputRef={inputRef}
        form={form}
        fetcher={fetcher}
        onSubmit={onSubmit}
        allowCreate={allowCreate}
        allowEdit={allowEdit}
      />
    </>
  );
}
