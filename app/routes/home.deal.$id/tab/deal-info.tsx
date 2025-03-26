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
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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

export default function DealInfoTab({
  appContext,
  data,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
}) {
  const navigate = useNavigate();

  const deal = data?.deal;
  const { profile, roleActions } = appContext;
  const dd = useLoaderData<typeof loader>();
  const [perm] = usePermission({
    actions: data?.actions,
    roleActions,
  });
  const fetcher = useFetcher<typeof action>();
  const { payload, editPayload } = useDealStore();
  const { toast } = useToast();
  const [searchParams,setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allowEdit = perm.edit || payload.enableEdit;
  // Initialize the form with default values and schema validation.
  const form = useForm<DealData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      ...payload.data,
      responsible: {
        id: profile?.id,
        name: fullName(profile?.given_name, profile?.family_name),
        uuid: profile?.uuid,
      },
      available_for_everyone: true,
      start_date: new Date(),
      index: 0,
    },
  });
  // Watch all form fields to update our deal store.
  const watchedFields = useWatch({ control: form.control });

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
          console.log("NEW DEAL",fetcher.data)
          searchParams.set("tab","info")
          searchParams.set(route.deal,fetcher.data.deal.id.toString())
          setSearchParams(searchParams,{
            preventScrollReset:true
          })
          
        }
      },
    },
    [fetcher.data]
  );

  // When the deal data is available, reset the form with its values.

  const setDeal = (e: components["schemas"]["DealDto"]) => {
    form.reset({
      name: e.name,
      amount: formatAmount(e.amount),
      currency: e.currency,
      stage: {
        name: e.stage,
        id: e.stage_id,
        uuid: "",
      },
      start_date: new Date(e.start_date),
      end_date: e.end_date ? new Date(e.end_date) : undefined,
      available_for_everyone: e.available_for_everyone,
      index: e.index,
      responsible: {
        id: e.responsible_id,
        name: fullName(e.responsible_given_name, e.responsible_family_name),
        uuid: e.uuid,
      },
      deal_type: e.deal_type,
      contacts: data?.contacts?.map((t) => mapToContactSchema(t)) || [],
      observers: data?.observers.map((t) => mapToParticipantSchema(t)) || [],
      source: e.source,
      source_information: e.source_information,
      id: e.id,
    });
  };
  useEffect(() => {
    if (deal) {
      setDeal(deal);
    }
  }, [deal]);

  // Update our deal store whenever the form fields change.
  useEffect(() => {
    editPayload(form.getValues());
  }, [watchedFields]);

  useEffect(() => {
    editPayload({
      onSave: () => inputRef.current?.click(),
      onCancel: () =>
        deal?.id
          ? editPayload({
              enableEdit: false,
            })
          : editPayload({
              enableEdit: false,
              open: false,
            }),
    });
  }, []);

  return (
    <div className="grid grid-cols-9 gap-2">
      <div className="grid gap-3 col-span-4">
        {/* {JSON.stringify(payload.stage)} */}
        {/* {JSON.stringify(form.formState.errors)} */}
        <DealForm
          form={form}
          fetcher={fetcher}
          inputRef={inputRef}
          onSubmit={onSubmit}
          contacts={data?.contacts || []}
          observers={data?.observers || []}
          allowEdit={allowEdit}
          enableEdit={payload.enableEdit}
          setEnableEdit={(e) => {
            if (deal) {
              setDeal(deal);
            }
            editPayload({
              enableEdit: e,
            });
          }}
        />
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
