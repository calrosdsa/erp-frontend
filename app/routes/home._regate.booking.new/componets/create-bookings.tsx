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
import { useEffect, useRef, useState } from "react";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

import Typography, { subtitle } from "@/components/typography/Typography";
import { useEventDebounceFetcher } from "~/util/hooks/fetchers/regate/useEventDebounceFetcher";
import AccordationLayout from "@/components/layout/accordation-layout";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCreateEvent } from "~/routes/home._regate.event_/components/use-create-event";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCreateCustomer } from "~/routes/home.selling.customer_/components/create-customer";

export default function CreateBookings({
  data,
}: {
  data: components["schemas"]["BookingData"][];
}) {
  const [bookings, setBookings] =
    useState<components["schemas"]["BookingData"][]>(data);
  const fetcher = useFetcher<typeof action>();
  const fetcherBookings = useFetcher<typeof action>({ key: "booking-data" });
  const form = useForm<z.infer<typeof createBookingsSchema>>({
    defaultValues: {},
    resolver: zodResolver(createBookingsSchema),
  });
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [customerFetcher, onCustomerNameChange] = useCustomerDebounceFetcher();
  const [customerPermission] = usePermission({
    actions: customerFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const createCustomer = useCreateCustomer();
  const [eventFetcher, onEventNameChange] = useEventDebounceFetcher();
  const [eventPermission] = usePermission({
    actions: eventFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const createEvent = useCreateEvent();
  const r = routes;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onSubmit = (values: z.infer<typeof createBookingsSchema>) => {
    console.log("OINSUBMIT", values);
    if (bookings.length > 0) {
      const body: components["schemas"]["CreateBookingBody"] = {
        advance_payment: Number(values.advancePayment),
        customer_id: values.customerID,
        bookings: bookings,
        event_id: values.eventID,
      };
      console.log("BOOKING BODY",body)
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

  setUpToolbar(() => {
    return {
      title: "Crear Nueva Reserva",
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
    },
    [fetcher.data]
  );

  return (
    <FormLayout>
      <div className="pt-2 pb-4">
        <Button
          variant={"outline"}
          className=" flex space-x-2 items-center"
          onClick={() => {
            fetcherBookings.submit(
              {},
              {
                method: "POST",
                encType: "application/json",
              }
            );
          }}
        >
          <ArrowLeft size={15} />
          <span>Seleccionar hora y Fecha</span>
        </Button>
      </div>
      <Form {...form}>
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
              {...(customerPermission?.create && {
                addNew: () => {
                  createCustomer.openDialog({});
                },
              })}
            />
            <CustomFormField
              label={t("form.advancePayment")}
              name="advancePayment"
              description={
                bookings.length > 1
                  ? "El pago anticipado se distribuirá entre las reservas más recientes"
                  : ""
              }
              form={form}
              children={(field) => {
                return (
                  <AmountInput field={field} currency={DEFAULT_CURRENCY} />
                );
              }}
            />

           
            <AccordationLayout
              containerClassName="col-span-full"
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
                  {...(eventPermission?.create && {
                    addNew: () => {
                      createEvent.onOpenChange(true);
                    },
                  })}
                />
              </div>
            </AccordationLayout>

            <Typography fontSize={subtitle} className="col-span-full">
              Detalles de la Reserva
            </Typography>
            <div className="col-span-full">
              <BookingDisplay
                bookings={bookings}
                removeBooking={(idx) => {
                  const f = bookings.filter((t, i) => i != idx);
                  setBookings(f);
                }}
                // onEditBooking={(newBooking, index) => {
                //   const updatedBookings = bookings.map((booking, i) => {
                //     return i === index ? newBooking : booking;
                //   });
                //   setBookings(updatedBookings);
                // }}
              />
            </div>
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
