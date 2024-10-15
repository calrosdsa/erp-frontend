import FormLayout from "@/components/custom/form/FormLayout";
import { action } from "./route";
import { useFetcher } from "@remix-run/react";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import CalendarBooking from "./componets/calendar-booking";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createBookingSchema } from "~/util/data/schemas/regate/booking-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import TimeSelectInput from "@/components/custom/select/time-select-input";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useCustomerDebounceFetcher } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import Typography, { subtitle, title } from "@/components/typography/Typography";
import SelectForm from "@/components/custom/select/SelectForm";
import { daysWeek } from "~/util/data/day-weeks";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import { useCourtDebounceFetcher } from "~/util/hooks/fetchers/regate/useCourtDebounceFetcher";
import { components } from "~/sdk";
import { mapToBookingData } from "./util";
import { useToast } from "@/components/ui/use-toast";

export default function NewBookingClient() {
  const fetcher = useFetcher<typeof action>();
  const toolbar = useToolbar();
  const form = useForm<z.infer<typeof createBookingSchema>>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {

    },
  });
  const [customerFetcher, onNameCustomerChange] = useCustomerDebounceFetcher();
  const [courtFetcher,onCourtNameChange] = useCourtDebounceFetcher();
  const {toast} = useToast()
  const { t } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null)
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

  const onSubmit = (values:z.infer<typeof createBookingSchema>) =>{
    console.log("BODY",values)
    const body:components["schemas"]["ValidateBookingBody"] = {
      bookings:mapToBookingData(values)
    }
    console.log("BODY",body)
    
    fetcher.submit({
      action:"validate-booking-data",
      validateBookingData:body,
    },{
      method:"POST",
      encType:"application/json"
    })
  }

  useEffect(()=>{
    if(fetcher.data?.error){
      toast({
        title:fetcher.data.error
      })
    }
  },[fetcher.data?.error])

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
              name="partyName"
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
              onValueChange={(e)=>{
                form.trigger("repeat")
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
            {form.getValues().repeat == "WEEKLY" && 
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
            }
          <input ref={inputRef} type="submit" className="hidden" />
            
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
