import { z } from "zod";
import { components } from "~/sdk";
import { validateBookingSchema } from "~/util/data/schemas/regate/booking-schema";
import { mapToBookingData } from "../util";
import { useEffect, useRef } from "react";
import FormLayout from "@/components/custom/form/FormLayout";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Form } from "@/components/ui/form";
import { useFetcher } from "@remix-run/react";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { action } from "../route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useCourtDebounceFetcher } from "~/util/hooks/fetchers/regate/useCourtDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import TimeSelectInput from "@/components/custom/select/time-select-input";
import Typography, { subtitle } from "@/components/typography/Typography";
import SelectForm from "@/components/custom/select/SelectForm";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import { daysWeek } from "~/util/data/day-weeks";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export const ValidateBooking = () => {
  const fetcher = useFetcher<typeof action>({ key: "booking-data" });
  const toolbar = useToolbar();
  const form = useForm<z.infer<typeof validateBookingSchema>>({
    resolver: zodResolver(validateBookingSchema),
    defaultValues: {},
  });
  const [courtFetcher, onCourtNameChange] = useCourtDebounceFetcher();
  const { t } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setUpToolbar = () => {
    toolbar.setToolbar({
      title: t("f.add-new", {
        o: t("regate._booking.base").toLocaleLowerCase(),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    });
  };

  const onSubmit = (values: z.infer<typeof validateBookingSchema>) => {
    console.log("BODY", values);
    const body: components["schemas"]["ValidateBookingBody"] = {
      bookings: mapToBookingData(values),
    };
    console.log("BODY", body);

    fetcher.submit(
      {
        action: "validate-booking-data",
        validateBookingData: body,
      },
      {
        method: "POST",
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

  useEffect(() => {
    setUpToolbar();
  }, []);
  return (
    <FormLayout>
      <Form {...form}>
        {JSON.stringify(form.formState.errors)}
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" create-grid">
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
              onChange={(e) => {
                form.setValue("startTime", e);
              }}
            />
            <TimeSelectInput
              label="Fin"
              onChange={(e) => {
                form.setValue("endTime", e);
              }}
            />

            <Typography fontSize={subtitle} className=" col-span-full">
              Repetir Reserva
            </Typography>

            <SelectForm
              data={
                [
                  { name: "Diariamente", value: "DAYLY" },
                  { name: "Semanalmente", value: "WEEKLY" },
                ] as SelectItem[]
              }
              name="repeat"
              form={form}
              onValueChange={(e) => {
                form.trigger("repeat");
              }}
              keyName="name"
              keyValue="value"
              label="Repetir"
            />
            <CustomFormDate
              form={form}
              name="repeatUntilDate"
              label={"Repetir Hasta la Fecha"}
            />
            {form.getValues().repeat == "WEEKLY" && (
              <MultiSelect
                label={t("form.daysWeek")}
                data={daysWeek}
                form={form}
                name="daySWeek"
                keyName="dayName"
                keyValue={"day"}
                onSelect={(e) => {
                  form.setValue(
                    "daysWeek",
                    e.map((t) => t.day)
                  );
                }}
              />
            )}
            <input ref={inputRef} type="submit" className="hidden" />
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
