import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app";
import { useDealStore } from "../deal-store";
import { useForm, useWatch } from "react-hook-form";
import { DealData, dealSchema } from "~/util/data/schemas/crm/deal.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullName } from "~/util/convertor/convertor";
import DealForm from "../deal-form";
import { useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import ActivityFeed from "@/components/custom-ui/activity-feed";
import { formatAmount } from "~/util/format/formatCurrency";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { PartyContacts } from "~/routes/home.party/components/party-contacts";
import { Entity } from "~/types/enums";

export default function DealInfoTab() {
  const navigate = useNavigate();
  const { deal, activities, actions, contacts, entityActions } =
    useLoaderData<typeof loader>();
  const { profile, roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ actions, roleActions });
  const fetcher = useFetcher<typeof action>();
  const { payload, setPayload } = useDealStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const permissions = useEntityPermission({
    entities:entityActions,
    roleActions:roleActions,
  });

  const allowEdit = perm.edit;
  // Initialize the form with default values and schema validation.
  const form = useForm<DealData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      ...payload,
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
      { method: "POST", encType: "application/json" }
    );
  };

  // Display toasts based on fetcher response and handle redirection.
  useEffect(() => {
    if (fetcher.data?.error) {
      toast({ title: fetcher.data.error });
    }
    if (fetcher.data?.message) {
      toast({ title: fetcher.data.message });
      //   const redirect = searchParams.get("redirect");
      //   if (redirect) {
      //     navigate(redirect);
      //   } else {
      //     navigate(-1);
      //   }
    }
  }, [fetcher.data]);

  // When the deal data is available, reset the form with its values.
  useEffect(() => {
    if (deal) {
      form.reset({
        name: deal.name,
        amount: formatAmount(deal.amount),
        currency: deal.currency,
        stage: {
          name: deal.stage,
          id: deal.stage_id,
          uuid: "",
        },
        start_date: new Date(deal.start_date),
        end_date: deal.end_date ? new Date(deal.end_date) : undefined,
        available_for_everyone: deal.available_for_everyone,
        index: deal.index,
        responsible: {
          id: deal.responsible_id,
          name: fullName(
            deal.responsible_given_name,
            deal.responsible_family_name
          ),
          uuid: deal.uuid,
        },
        deal_type: deal.deal_type,
        source: deal.source,
        source_information: deal.source_information,
        id: deal.id,
      });
    }
  }, [deal]);

  // Update our deal store whenever the form fields change.
  useEffect(() => {
    setPayload(form.getValues());
  }, [watchedFields]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="grid gap-3">
        <DealForm
          form={form}
          fetcher={fetcher}
          inputRef={inputRef}
          onSubmit={onSubmit}
          allowEdit={allowEdit}
        />

        <PartyContacts
          contacts={contacts}
          onAddContact={() => {
            // navigate(r.toCreateContact(supplier?.id));
          }}
          perm={permissions[Entity.CONTACT]}
        />
      </div>
      {deal?.id && (
        <div className="">
          <ActivityFeed activities={activities} partyID={deal?.id} />
        </div>
      )}
    </div>
  );
}
