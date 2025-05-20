import { components } from "~/sdk";
import { action } from "../route";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { createBookingsSchema } from "~/util/data/schemas/regate/booking-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import {
  CustomerAutoCompleteForm,
  useCustomerDebounceFetcher,
} from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { route } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import CustomFormField from "@/components/custom/form/CustomFormField";
import AmountInput from "@/components/custom/input/AmountInput";
import {
  CREATE,
  DEFAULT_CURRENCY,
  DEFAULT_ID,
  LOADING_MESSAGE,
} from "~/constant";
import { useEffect, useRef, useState } from "react";

import {
  EventAutoCompleteForm,
  useEventDebounceFetcher,
} from "~/util/hooks/fetchers/regate/useEventDebounceFetcher";
import AccordationLayout from "@/components/layout/accordation-layout";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";

import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCreateCustomer } from "~/routes/home.customer_/components/create-customer";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/typography";
import { useNewBooking } from "../store/use-new-booking";
import BookingDisplay from "./bookings-display";
import BookingDetails from "./bookings-details";
import { setUpModalPayload } from "@/components/ui/custom/modal-layout";
import { useCustomerStore } from "~/routes/home.customer.$id/customer-store";
import { toast } from "sonner";
import { useEventStore } from "~/routes/home._regate.event.$id/event-store";

export default function CreateBookings({
  data,
  keyPayload,
  closeModal,
}: {
  data: components["schemas"]["ValidateBookingData"];
  keyPayload: string;
  closeModal: () => void;
}) {
  const [bookings, setBookings] = useState<
    components["schemas"]["BookingData"][]
  >(data.bookings || []);
  const fetcher = useFetcher<typeof action>();
  const fetcherBookings = useFetcher<typeof action>({ key: "booking-data" });
  const form = useForm<z.infer<typeof createBookingsSchema>>({
    defaultValues: {
      event: {
        id: data.event_id,
        name: data.event_name,
      },
      customer: {
        id: data.customer_id,
        name: data.customer_name,
      },
    },
    resolver: zodResolver(createBookingsSchema),
  });
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [searchParams, setSearchParams] = useSearchParams();
  const newBooking = useNewBooking();
  const [toastID, setToastID] = useState<string | number>("");
  const setParams = (params: Record<string, any>) => {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value); // Update or add the parameter
      } else {
        searchParams.delete(key); // Remove the parameter if the value is empty
      }
    });
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };
  const { resetPayload } = useNewBooking();
  const eventStore = useEventStore();
  const customerStore = useCustomerStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const onSubmit = (values: z.infer<typeof createBookingsSchema>) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    if (bookings.length > 0) {
      const body: components["schemas"]["CreateBookingBody"] = {
        advance_payment: Number(values.advancePayment),
        customer_id: values.customer?.id || 0,
        bookings: bookings.map((t) => {
          t.discount = values.discount;
          return t;
        }),
        event_id: values.event?.id,
        comment: values.comment,
      };
      console.log("BOOKING BODY", body);
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

  setUpModalPayload(
    keyPayload,
    () => {
      return {
        titleToolbar: "Crear Nueva Reserva",
        onSave: () => {
          inputRef.current?.click();
        },
      };
    },
    []
  );

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        closeModal();
        newBooking.resetPayload();
        newBooking.setSelectedSlots(new Set());
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    if (customerStore.newCustomer) {
      form.setValue("customer", {
        id: customerStore.newCustomer.id,
        name: customerStore.newCustomer.name,
      });
    }
  }, [customerStore.newCustomer]);

  useEffect(() => {
    if (eventStore.newEvent) {
      console.log("NEW EVENT ....",eventStore.newEvent)
      form.setValue("event", {
        id: eventStore.newEvent.id,
        name: eventStore.newEvent.name,
      });
    }
  }, [eventStore.newEvent]);

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
            resetPayload();
          }}
        >
          <ArrowLeft size={15} />
          <span>Seleccionar hora y Fecha</span>
        </Button>
      </div>
      <Form {...form}>
        {JSON.stringify(form.getValues().event)}
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            <CustomerAutoCompleteForm
              label={t("_customer.base")}
              roleActions={globalState.roleActions}
              required={true}
              modal={true}
              form={form}
              openModal={() => {
                setParams({
                  [route.customer]: DEFAULT_ID,
                  action: CREATE,
                });
              }}
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

            <CustomFormField
              label={t("form.discount")}
              name="discount"
              form={form}
              description={
                bookings.length > 1
                  ? "El descuento se aplica a todas las reservas."
                  : ""
              }
              children={(field) => {
                return (
                  <AmountInput field={field} currency={DEFAULT_CURRENCY} />
                );
              }}
            />

            <CustomFormField
              label={t("form.comment")}
              name="comment"
              form={form}
              children={(field) => {
                return <Textarea {...field} rows={3} />;
              }}
            />

            <Typography variant="subtitle2" className="col-span-full">
              Evento
            </Typography>

            <EventAutoCompleteForm
              label={t("regate._event.base")}
              roleActions={globalState.roleActions}
              form={form}
              modal={true}
              openModal={() => {
                setParams({
                  [route.event]: DEFAULT_ID,
                  action: CREATE,
                });
              }}
            />

            <Typography variant="subtitle2" className="col-span-full">
              Detalles de la Reserva
            </Typography>
            <div className="col-span-full">
              <BookingDetails bookings={bookings} />
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
