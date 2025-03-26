import {
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
import { quotationDataSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { z } from "zod";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbarTab,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { useEditFields } from "~/util/hooks/useEditFields";
import { QuotationData } from "~/routes/home.quotation.$quotationParty.new/quotation-data";
import { toLineItemSchema } from "~/util/data/schemas/stock/line-item-schema";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type EditData = z.infer<typeof quotationDataSchema>;
export default function QuotationInfoTab() {
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { quotation, lineItems, taxLines, actions } =
    useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const [quotationPerm] = usePermission({ roleActions, actions });
  const quotationParty = params.quotationParty || "";
  const isDraft = stateFromJSON(quotation?.status) == State.DRAFT;
  const allowEdit = isDraft && quotationPerm?.edit;
  const allowCreate = isDraft && quotationPerm?.create;
  const documentStore = useDocumentStore();
  const { form, hasChanged, updateRef,previousValues } = useEditFields<EditData>({
    schema: quotationDataSchema,
    defaultValues: {
      id: quotation?.id,
      party: {
        id: quotation?.party_id,
        name: quotation?.party_name,
        uuid:quotation?.party_uuid,
      },
      currency: quotation?.currency || companyDefaults?.currency,
      postingTime: quotation?.posting_time,
      postingDate: new Date(quotation?.posting_date || ""),
      validTill: new Date(quotation?.valid_till || new Date()),
      tz: quotation?.tz,
      project: {
        id: quotation?.project_id,
        name: quotation?.project,
        uuid: quotation?.project_uuid,
      },
      costCenter: {
        id: quotation?.cost_center_id,
        name: quotation?.cost_center,
        uuid: quotation?.cost_center_uuid,
      },
      priceList:{
        id:quotation?.price_list_id,
        name:quotation?.price_list,
        uuid:quotation?.price_list_uuid,
      },
      taxLines:taxLines.map(t=>toTaxAndChargeLineSchema(t)),
      lines: lineItems.map((t) =>
        toLineItemSchema(t, {
          partyType: quotationParty,
        })
      ),
    },
  });

  const {setRegister} = useSetupToolbarStore()

  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        quotationData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  // useEffect(()=>{
  //   console.log("HAS CHANGE",hasChanged)
  //   toolbar.setToolbar({
  //     onSave: () => inputRef.current?.click(),
  //       // disabledSave: !hasChanged,
  //   })
  // },[quotation])

  useEffect(()=>{
    setRegister("tab",{
      onSave: () => {
        console.log("ON SAVE");
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,      
    })
  },[allowEdit,quotation])


  

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
      partyID: quotation?.party_id,
      documentRefernceID: quotation?.id,
      partyName: quotation?.party_name,
      currency: quotation?.currency,
      priceListID:quotation?.price_list_id,
      priceListName:quotation?.price_list,
      projectID: quotation?.project_id,
      projectName: quotation?.project,
      costCenterID: quotation?.cost_center_id,
      costCenterName: quotation?.cost_center,
    });
  }, [quotation]);
  return (
    <>
   <QuotationData
   form={form}
   inputRef={inputRef}
   onSubmit={onSubmit}
   fetcher={fetcher}
   allowEdit={allowEdit}
   allowCreate={allowCreate}
   />
   </>
  );
}
