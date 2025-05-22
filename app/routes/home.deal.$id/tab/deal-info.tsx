import { useFetcher, useSearchParams } from "@remix-run/react";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app-types";
import { useDealStore } from "../deal-store";
import {
  DealData,
  dealSchema,
  mapToParticipantSchema,
} from "~/util/data/schemas/crm/deal-schema";
import { fullName } from "~/util/convertor/convertor";
import DealForm from "../deal-form";
import { useEffect, useRef, useCallback, useState } from "react";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { formatAmount } from "~/util/format/formatCurrency";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { Entity } from "~/types/enums";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { mapToContactSchema } from "~/util/data/schemas/contact/contact.schema";
import { SerializeFrom } from "@remix-run/node";
import { SmartForm } from "@/components/form/smart-form";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { DEFAULT_CURRENCY, LOADING_MESSAGE } from "~/constant";
import { toast } from "sonner";

export default function DealInfoTab({
  appContext,
  data,
  keyPayload,
  load,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  keyPayload: string;
  load: () => void;
}) {
  const deal = data?.deal;
  const { profile, roleActions } = appContext;
  const [perm] = usePermission({
    actions: data?.actions,
    roleActions,
  });
  const { editPayload } = useModalStore();
  const fetcher = useFetcher<typeof action>();
  const { editPayload: editDealPayload, payload: payloadDeal } = useDealStore();
  const payload = useModalStore((state) => state.payload[keyPayload]);
  const [searchParams, setSearchParams] = useSearchParams();
  const allowEdit = perm.edit;
  const [toastID, setToastID] = useState<string | number>("");

  // Initialize the form with default values and schema validation.

  // Watch all form fields to update our deal store.

  // Handle form submission.
  const onSubmit = (data: DealData) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    const submitAction = data.id ? "edit" : "create";
    fetcher.submit(
      {
        action: submitAction,
        dealData: data as any,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRouteDetail(route.deal, deal?.id.toString() || "0"),
      }
    );

    editPayload(keyPayload, {
      enableEdit: false,
    });
  };

  // Display toasts based on fetcher response and handle redirection.

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.deal) {
          console.log("NEW DEAL", fetcher.data);
          searchParams.set("tab", "info");
          searchParams.set(route.deal, fetcher.data.deal.id.toString());
          setSearchParams(searchParams, {
            preventScrollReset: true,
          });
        }
        load();
      },
    },
    [fetcher.data]
  );

  // When the deal data is available, reset the form with its values.

  return (
    <div className="grid grid-cols-9 gap-2">
      <div className="grid gap-3 col-span-4">
        <SmartForm
          isNew={payload?.isNew || false}
          title={"Información del trato"}
          schema={dealSchema}
          keyPayload={keyPayload}
          defaultValues={{
            ...payloadDeal,
            name: deal?.name,
            amount: formatAmount(deal?.amount),
            currency: {
              id: 0,
              name:
                deal?.currency ||
                appContext.companyDefaults?.currency ||
                DEFAULT_CURRENCY,
            },
            stage: {
              name: deal?.stage,
              id: deal?.stage_id,
            },
            customer: {
              name: deal?.customer,
              id: deal?.customer_id,
            },
            start_date: deal?.start_date
              ? new Date(deal?.start_date)
              : new Date(),
            end_date: deal?.end_date ? new Date(deal?.end_date) : undefined,
            available_for_everyone: deal?.available_for_everyone || false,
            index: deal?.index || 0,
            responsible: {
              id: deal?.responsible_id || appContext.profile?.id,
              name: fullName(
                deal?.responsible_given_name || appContext.profile?.given_name,
                deal?.responsible_family_name || appContext.profile?.family_name
              ),
              uuid: deal?.uuid || appContext.profile?.uuid,
            },
            deal_type: deal?.deal_type,
            contacts: data?.contacts?.map((t) => mapToContactSchema(t)) || [],
            observers:
              data?.observers.map((t) => mapToParticipantSchema(t)) || [],
            source: deal?.source,
            source_information: deal?.source_information,
            id: deal?.id,
          }}
          onSubmit={onSubmit}
        >
          <DealForm
            keyPayload={keyPayload}
            contacts={data?.contacts || []}
            observers={data?.observers || []}
            allowEdit={allowEdit}
          />
        </SmartForm>
      </div>
      {deal?.id != undefined && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={deal?.id}
            partyName={deal.name}
            entityID={Entity.DEAL}
          />
        </div>
      )}
    </div>
  );
}
