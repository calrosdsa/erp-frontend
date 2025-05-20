import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import {
  EventBookingSchema,
  eventBookingShema,
} from "~/util/data/schemas/regate/event-schema";
import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { formatDate } from "date-fns";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";
import { formatAmount, formatCurrency } from "~/util/format/formatCurrency";
import {
  CREATE,
  DEFAULT_CURRENCY,
  DEFAULT_ID,
  LOADING_MESSAGE,
} from "~/constant";
import { Typography } from "@/components/typography";
import { useEditFields } from "~/util/hooks/useEditFields";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { SerializeFrom } from "@remix-run/node";
import { route } from "~/util/route";
import {
  setUpModalTabPage,
  useModalStore,
} from "@/components/ui/custom/modal-layout";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { Entity } from "~/types/enums";
import EventForm from "../components/event-form";
import { SmartForm } from "@/components/form/smart-form";
import { action } from "~/routes/home._regate.event_/route";
import { toast } from "sonner";
import { useEventStore } from "../event-store";

export default function EventInfoTab({
  appContext,
  data,
  closeModal,
  load,
}: {
  appContext: GlobalState;
  data: SerializeFrom<typeof loader>;
  closeModal: () => void;
  load: () => void;
}) {
  const key = route.event;
  const { event, actions, bookingInfo } = data;
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions,
  });
  const payload = useModalStore((state) => state.payload[key]) || {};
  const fetcher = useFetcher<typeof action>();
  const [toastID, setToastID] = useState<string | number>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const eventID = searchParams.get(route.event);
  const paramAction = searchParams.get("action");
  const allowEdit = permission.edit;
  const eventStore = useEventStore();

  const onSubmit = (e: EventBookingSchema) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = payload.isNew ? "create-event" : "edit-event";
    fetcher.submit(
      {
        action: action,
        eventData: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.to(route.event),
      }
    );
  };

  useDisplayMessage(
    {
      toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (eventID == DEFAULT_ID) {
          const eventData = fetcher.data?.event;
          if (!eventData) return;

          if (paramAction == CREATE) {
            console.log("CREATE EVENT....",eventData)
            eventStore.onCreateEvent(eventData);
            closeModal();
          } else {
            // Update URL with new event ID
            searchParams.set(route.event, eventData.id.toString());
            setSearchParams(searchParams, {
              preventScrollReset: true,
              replace: true,
            });
          }
        } else {
          load(); // Reload data for existing event
        }
      },
    },
    [fetcher.data]
  );

  return (
    <div className="grid grid-cols-9 gap-3">
      <div className="col-span-4">
        <SmartForm
          isNew={payload.isNew || false}
          title={t("_customer.info")}
          schema={eventBookingShema}
          keyPayload={key}
          defaultValues={{
            eventID: event?.id,
            name: event?.name,
            description: event?.description,
          }}
          onSubmit={onSubmit}
        >
          <EventForm />
        </SmartForm>

        {data.event && (
          <>
            <Typography variant="subtitle2" className=" col-span-full">
              Información de reserva del evento
            </Typography>
            <DisplayTextValue
              value={formatLongDate(bookingInfo?.start_date, i18n.language)}
              title={t("form.startDate")}
            />
            <DisplayTextValue
              value={formatLongDate(bookingInfo?.end_date, i18n.language)}
              title={t("form.endDate")}
            />
            <DisplayTextValue
              value={formatCurrency(
                bookingInfo?.total_price,
                DEFAULT_CURRENCY,
                i18n.language
              )}
              title={t("form.total")}
            />
            <DisplayTextValue
              value={formatCurrency(
                bookingInfo?.total_paid,
                DEFAULT_CURRENCY,
                i18n.language
              )}
              title={t("form.paidAmount")}
            />
            <DisplayTextValue
              value={formatCurrency(
                bookingInfo?.total_discount,
                DEFAULT_CURRENCY,
                i18n.language
              )}
              title={t("form.discount")}
            />
          </>
        )}
      </div>

      {event?.id && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={event?.id}
            partyName={event?.name}
            entityID={Entity.EVENTBOOKING}
          />
        </div>
      )}
    </div>

    // <div className="info-grid">
    //     <DisplayTextValue
    //     title={t("form.name")}
    //     value={event?.name}
    //     />
    //      <DisplayTextValue
    //     title={t("form.description")}
    //     value={event?.description}
    //     />
    // </div>
  );
}
