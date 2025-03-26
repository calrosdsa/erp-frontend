import { z } from "zod";
import { components } from "~/sdk";
import { validateBookingSchema } from "~/util/data/schemas/regate/booking-schema";
import { mapToBookingData } from "../util";
import { useEffect, useRef } from "react";
import FormLayout from "@/components/custom/form/FormLayout";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Form } from "@/components/ui/form";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
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
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import AccordationLayout from "@/components/layout/accordation-layout";
import AmountInput from "@/components/custom/input/AmountInput";
import { DEFAULT_CURRENCY } from "~/constant";
import { useNewBooking } from "../use-new-booking";
import generateBookingData from "../util-new";

export const ValidateBooking = () => {
  const fetcher = useFetcher<typeof action>({ key: "booking-data" });
  
  const form = useForm<z.infer<typeof validateBookingSchema>>({
    resolver: zodResolver(validateBookingSchema),
    defaultValues: {},
  });
  const globalState = useOutletContext<GlobalState>();
  const [courtFetcher, onCourtNameChange] = useCourtDebounceFetcher();
  const [courtPermission] = usePermission({
    actions: courtFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const r = route;
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);

 


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

  setUpToolbar(() => {
    return {
      titleToolbar: "Crear Nueva Reserva",
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);



  return (
    <FormLayout>
       
      <Form {...form}>
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
              {...(courtPermission?.create && {
                addNew: () => {
                  navigate(r.toCreateCourt());
                },
              })}
              onSelect={(e) => {
                form.setValue("courtID", e.id);
              }}
            />

            <Typography fontSize={subtitle} className="col-span-full">
              Fecha y Hora
            </Typography>

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
            {/* <AccordationLayout title="Descuento"
            containerClassName="col-span-full">
              <div className="create-grid">
              <CustomFormField
              label={t("form.discount")}
              name="discount"
              form={form}
              children={(field) => {
                return (
                  <AmountInput field={field} currency={DEFAULT_CURRENCY} />
                );
              }}
            />
              </div>
            </AccordationLayout> */}
            <AccordationLayout 
            title="Repetir Reserva"
            containerClassName=" col-span-full"
            >
              <div className=" create-grid">
              <SelectForm
                data={
                  [
                    { name: "Diariamente", value: "DAYLY" },
                    { name: "Semanalmente", value: "WEEKLY" },
                    { name: "Mensualmente", value: "MONTHLY" },
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

              {form.getValues().repeat == "MONTHLY" && (
                <CustomFormField
                label="Día"
                name="repeatOnDay"
                  form={form}
                  children={(field) => {
                    return <Input {...field} type="number" />;
                  }}
                />
              )}
                </div>
            </AccordationLayout>

            <input ref={inputRef} type="submit" className="hidden" />
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
