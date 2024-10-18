import CustomFormDate from "@/components/custom/form/CustomFormDate";
import FormLayout from "@/components/custom/form/FormLayout";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import TimeSelectInput from "@/components/custom/select/time-select-input";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react/dist/components";
import { format, toDate } from "date-fns";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import BookingDisplay from "~/routes/home._regate.booking.new/componets/bookings-display";
import { action } from "~/routes/home._regate.booking.new/route";
import { mapToBookingData } from "~/routes/home._regate.booking.new/util";
import { components } from "~/sdk";
import { validateBookingSchema } from "~/util/data/schemas/regate/booking-schema";
import { useCourtDebounceFetcher } from "~/util/hooks/fetchers/regate/useCourtDebounceFetcher";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { routes } from "~/util/route";

export const RescheduleBooking = ({
  open,
  onOpenChange,
  booking,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  booking?: components["schemas"]["BookingDto"];
}) => {
  const fetcher = useFetcher<typeof action>();
  const rescheduleFetcher = useFetcher<typeof action>();
  const form = useForm<z.infer<typeof validateBookingSchema>>({
    resolver: zodResolver(validateBookingSchema),
    defaultValues: {
      courtID: booking?.court_id,
      courtName: booking?.court_name,
      date: toDate(booking?.start_date || new Date()),
      startTime: format(toDate(booking?.start_date || new Date()), "hh:mm a"),
      endTime: format(toDate(booking?.end_date || new Date()), "hh:mm a"),
      bookingID: booking?.id,
    },
  });
  const [courtFetcher, onCourtNameChange] = useCourtDebounceFetcher();
  const { t } = useTranslation("common");
  const r = routes;

  const onSubmit = (values: z.infer<typeof validateBookingSchema>) => {
    console.log("BODY", values);
    const body: components["schemas"]["ValidateBookingBody"] = {
      bookings: mapToBookingData(values),
      booking_id: values.bookingID,
    };
    console.log("BODY", body);

    fetcher.submit(
      {
        action: "validate-booking-data",
        validateBookingData: body,
      },
      {
        method: "POST",
        action: r.toCreateBooking(),
        encType: "application/json",
      }
    );
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  useDisplayMessage(
    {
      error: rescheduleFetcher.data?.error,
      success: rescheduleFetcher.data?.message,
      onShowMessage:()=>onOpenChange(false)
    },
    [rescheduleFetcher.data]
  );

  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Reprogramar Reserva"
      className=" max-w-2xl"
    >
      <FormLayout className="">
        {fetcher.data?.bookingData ? (
          <div className=" col-span-full">
            <rescheduleFetcher.Form
            className="grid"
              onSubmit={(e) => {
                e.preventDefault()
                console.log("ONSUBMIT")
                if (!booking?.id) return;
                if (!fetcher.data?.bookingData) return;
                const b = fetcher.data?.bookingData[0];
                if (!b) return;
                const body: components["schemas"]["BookingRescheduleBody"] = {
                  booking_id: booking?.id,
                  booking: b,
                };
                console.log("BODY",body)
                rescheduleFetcher.submit(
                  {
                    action: "reschedule-booking",
                    rescheduleBooking: body,
                  },
                  {
                    method: "post",
                    encType: "application/json",
                  }
                );
              }}
            >
              <BookingDisplay bookings={fetcher.data?.bookingData || []} />
              <Button
                type="submit"
                loading={rescheduleFetcher.state == "submitting"}
              >
                {t("form.save")}
              </Button>
            </rescheduleFetcher.Form>
          </div>
        ) : (
          <Form {...form}>
            <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
              <div className=" grid grid-cols-2 gap-3">
                <FormAutocomplete
                  label={t("regate._court.base")}
                  data={courtFetcher.data?.courts || []}
                  onValueChange={onCourtNameChange}
                  nameK={"name"}
                  name="courtName"
                  required={true}
                  form={form}
                  onSelect={(e) => {
                    form.setValue("courtID", e.id);
                  }}
                />

                <CustomFormDate
                  form={form}
                  name="date"
                  label={t("form.date")}
                  required={true}
                />
                <TimeSelectInput
                  label="Inicio"
                  defaultValue={form.getValues().startTime}
                  onChange={(e) => {
                    form.setValue("startTime", e);
                  }}
                />
                <TimeSelectInput
                  label="Fin"
                  defaultValue={form.getValues().endTime}
                  onChange={(e) => {
                    form.setValue("endTime", e);
                  }}
                />

                <Button className="col-span-full">Validar Reserva</Button>
              </div>
            </fetcher.Form>
          </Form>
        )}
      </FormLayout>
    </DrawerLayout>
  );
};

interface RescheduleBooking {
  booking?: components["schemas"]["BookingDto"];
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: { booking?: components["schemas"]["BookingDto"] }) => void;
}

export const useRescheduleBooking = create<RescheduleBooking>((set) => ({
  open: false,
  booking: undefined,
  onOpenChange: (e) =>
    set((state) => ({
      open: false,
    })),
  openDialog: (opts) =>
    set((state) => ({
      booking: opts.booking,
      open: true,
    })),
}));
