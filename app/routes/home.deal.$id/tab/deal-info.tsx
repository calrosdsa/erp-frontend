import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app-types";
import { useDealStore } from "../deal-store";
import {
  DealData,
  dealSchema,
  mapToParticipantSchema,
} from "~/util/data/schemas/crm/deal.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullName } from "~/util/convertor/convertor";
import DealForm from "../deal-form";
import { useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { formatAmount } from "~/util/format/formatCurrency";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { PartyContacts } from "~/routes/home.party/components/party-contacts";
import { Entity } from "~/types/enums";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { mapToContactSchema } from "~/util/data/schemas/contact/contact.schema";
import { components } from "~/sdk";
import { SerializeFrom } from "@remix-run/node";
import { SmartForm } from "@/components/form/smart-form";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { DEFAULT_CURRENCY } from "~/constant";

export default function DealInfoTab({
  appContext,
  data,
  keyPayload
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  keyPayload:string
}) {
  const deal = data?.deal;
  const { profile, roleActions } = appContext;
  const dd = useLoaderData<typeof loader>();
  const [perm] = usePermission({
    actions: data?.actions,
    roleActions,
  });
  const fetcher = useFetcher<typeof action>();
  const { editPayload, payload: payloadDeal } = useDealStore();
  const payload = useModalStore((state) => state.payload[keyPayload]);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allowEdit = perm.edit;

  // Initialize the form with default values and schema validation.

  // Watch all form fields to update our deal store.

  // Handle form submission.
  const onSubmit = (data: DealData) => {
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
  };

  // Display toasts based on fetcher response and handle redirection.

  useDisplayMessage(
    {
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
      },
    },
    [fetcher.data]
  );

  // When the deal data is available, reset the form with its values.

  return (
    <div className="grid grid-cols-9 gap-2">
      <div className="grid gap-3 col-span-4">
        {JSON.stringify(deal?.stage_id)}
        <SmartForm
          isNew={payload?.isNew}
          title={"Información del trato"}
          schema={dealSchema}
          keyPayload={keyPayload}
          defaultValues={{
            ...payloadDeal,
            name: deal?.name,
            amount: formatAmount(deal?.amount),
            currency:
              deal?.currency ||
              appContext.companyDefaults?.currency ||
              DEFAULT_CURRENCY,
            stage: {
              name: deal?.stage,
              id: deal?.stage_id,
            },
            start_date: deal?.start_date
              ? new Date(deal?.start_date)
              : new Date(),
            end_date: deal?.end_date ? new Date(deal?.end_date) : undefined,
            available_for_everyone: deal?.available_for_everyone || false,
            index: deal?.index || 0,
            responsible: {
              id: deal?.responsible_id,
              name: fullName(
                deal?.responsible_given_name,
                deal?.responsible_family_name
              ),
              uuid: deal?.uuid,
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
