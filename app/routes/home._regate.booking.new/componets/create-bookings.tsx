import { components } from "~/sdk";
import { action } from "../route";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { createBookingsSchema } from "~/util/data/schemas/regate/booking-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useCustomerDebounceFetcher } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { routes } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import BookingDisplay from "./bookings-display";
import CustomFormField from "@/components/custom/form/CustomFormField";
import AmountInput from "@/components/custom/input/AmountInput";
import { DEFAULT_CURRENCY } from "~/constant";
import { useEffect, useRef } from "react";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

import Typography, { subtitle } from "@/components/typography/Typography";
import { useEventDebounceFetcher } from "~/util/hooks/fetchers/regate/useEventDebounceFetcher";
import AccordationLayout from "@/components/layout/accordation-layout";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCreateEvent } from "~/routes/home._regate.event_/components/use-create-event";

export default function CreateBookings({
  bookings,
}: {
  bookings: components["schemas"]["BookingData"][];
}) {
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createBookingsSchema>>({
    defaultValues: {},
    resolver: zodResolver(createBookingsSchema),
  });
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>()
  const [customerFetcher, onCustomerNameChange] = useCustomerDebounceFetcher();
  const [eventFetcher, onEventNameChange] = useEventDebounceFetcher();
  const [eventPermission] = usePermission({
    actions:eventFetcher.data?.actions,
    roleActions:globalState.roleActions
  })
  const createEvent = useCreateEvent()
  const r = routes;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onSubmit = (values: z.infer<typeof createBookingsSchema>) => {
    console.log("OINSUBMIT", values);
    if (bookings.length > 0) {
      const body: components["schemas"]["CreateBookingBody"] = {
        advance_payment: values.advancePayment,
        customer_id: values.customerID,
        bookings: bookings,
        event_id:values.eventID,
      };
      fetcher.submit(
        {
          action: "create-bookings",
          createBookingData: body,
        },
        {
          encType: "application/json",
          method: "POST",
        }
      );
    }
  };

  setUpToolbar(()=>{
    return {
      onSave: () => {
        console.log("ONCLICK");
        inputRef.current?.click();
      },
    }
  },[]);

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
  }, [fetcher.data]);

  return (
    <FormLayout>
      <Form {...form}>
        {JSON.stringify(form.formState.errors)}
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            <FormAutocomplete
              label={t("_customer.base")}
              data={customerFetcher.data?.customers || []}
              onValueChange={onCustomerNameChange}
              nameK={"name"}
              name="customerName"
              required={true}
              form={form}
              onSelect={(e) => {
                form.setValue("customerID", e.id);
              }}
            />
            <CustomFormField
              label={t("form.advancePayment")}
              name="advancePayment"
              form={form}
              children={(field) => {
                return (
                  <AmountInput field={field} currency={DEFAULT_CURRENCY} />
                );
              }}
            />
            <AccordationLayout
              className="col-span-full"
              title={t("regate._event.base")}
            >
              <div className="create-grid">
              <FormAutocomplete
                label={t("regate._event.base")}
                data={eventFetcher.data?.events || []}
                onValueChange={onEventNameChange}
                nameK={"name"}
                name="eventName"
                form={form}
                onSelect={(e) => {
                  form.setValue("eventID", e.id);
                }}
                {...(eventPermission?.create) && {
                  addNew:()=>{ createEvent.onOpenChange(true)}
                }}
                
                />
                </div>
            </AccordationLayout>

            <div className="col-span-full">
              <BookingDisplay bookings={bookings} />
            </div>
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
