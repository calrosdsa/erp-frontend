import FormLayout from "@/components/custom/form/FormLayout";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { components } from "~/sdk";
import {
  courtRateInterval,
  updateCourtRateSchema,
} from "~/util/data/schemas/regate/court-schema";
import { action } from "./route";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import { daysWeek } from "~/util/data/day-weeks";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import TimeSelectInput from "@/components/custom/select/time-select-input";
import AmountInput from "@/components/custom/input/AmountInput";
import { useEffect, useState } from "react";
import CheckForm from "@/components/custom/input/CheckForm";
import { DrawerClose } from "@/components/ui/drawer";
import {
  formatCurrency,
  formatCurrencyAmount,
} from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, TrashIcon } from "lucide-react";
import IconButton from "@/components/custom-ui/icon-button";
import { parse, format, addMinutes, isBefore, isEqual, setHours, setMinutes, setSeconds, setMilliseconds, interval } from 'date-fns';
import { mapToCourtRateData } from "./util/generate-court-rate-interval";
import { routes } from "~/util/route";

export const UpdateCourtRate = ({}: {
}) => {
  const updateCourtRate = useUpdateCourtRate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const [openAddRateDialog, setOpenAddRateDialog] = useState(false);
  const r = routes
  const form = useForm<z.infer<typeof updateCourtRateSchema>>({
    resolver: zodResolver(updateCourtRateSchema),
    defaultValues: {
      courtRateIntervals: [],
      courtUUID:updateCourtRate.court?.uuid,
      isEdit:updateCourtRate.isEdit
    },
  })



  const onSubmit = (values: z.infer<typeof updateCourtRateSchema>) => {
    const body:components["schemas"]["UpdateCourtRatesBody"] = {
        court_rate:mapToCourtRateData(values),
        court_uuid:values.courtUUID,
        is_edit:values.isEdit
    }
    console.log("BODY",body)
    fetcher.submit({
        action:"update-court-rate",
        updateCourtRateData:body,
    },{
        action:r.toCourtDetail(updateCourtRate.court?.name ||"",updateCourtRate.court?.uuid || ""),
        encType:"application/json",
        method:"POST"
    })
  };

  useEffect(()=>{
    if(fetcher.data?.error){
        toast({
            title:fetcher.data.error,
        })
    }
    if(fetcher.data?.message){
        toast({
            title:fetcher.data?.message
        })
        updateCourtRate.onOpenChange(false)
    }
  },[fetcher.data])

  return (
    <DrawerLayout
      open={updateCourtRate.open}
      onOpenChange={updateCourtRate.onOpenChange}
      className="max-w-2xl"
    >
      {openAddRateDialog && (
        <AddCourtRate
          open={openAddRateDialog}
          onOpenChange={(e) => setOpenAddRateDialog(e)}
          onAddCourtRate={(e) => {
            const l = form.getValues().courtRateIntervals;
            const n = [...l, e];
            form.setValue("courtRateIntervals", n);
          }}
        />
      )}
      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-y-3"
          >
            <FormLabel>Intervalos</FormLabel>
            {form.getValues().courtRateIntervals.map((t, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-center space-x-4 p-3 bg-background rounded-lg shadow-sm
                border flex-wrap"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {formatCurrencyAmount(
                        t.rate,
                        DEFAULT_CURRENCY,
                        i18n.language
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {t.start_time} - {t.end_time}
                    </span>
                  </div>
                  <Badge variant={t.enabled ? "default" : "secondary"}>
                    {/* <Toggle className="h-4 w-4 mr-1" /> */}
                    {t.enabled ? "Habilitado" : "Deshabilitado"}
                  </Badge>
                  <IconButton
                    onClick={() => {
                      const f = form.getValues().courtRateIntervals.filter((t,index)=>index != idx);
                      form.setValue("courtRateIntervals", f);
                      form.trigger("courtRateIntervals")
                    }}
                    icon={TrashIcon}
                  />
                </div>
              );
            })}
            <Button
              type="button"
              className="w-min"
              variant={"outline"}
              onClick={() => setOpenAddRateDialog(true)}
            >
              Agregar intervalo +
            </Button>

            <MultiSelect
              label={t("form.daysWeek")}
              data={daysWeek}
              form={form}
              name="dayWeeks"
              keyName="dayName"
              keyValue={"day"}
              onSelect={(e) => {
                console.log("DAYWEEKS",e)
                form.setValue(
                  "dayWeeks",
                  e.map((t) => t.day)
                );
              }}
            />

            <Button
              type="submit"
              className="drawer-close"
              loading={fetcher.state == "submitting"}
            >
              {t("form.save")}
            </Button>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </DrawerLayout>
  );
};

const AddCourtRate = ({
  open,
  onOpenChange,
  onAddCourtRate,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  onAddCourtRate: (e: z.infer<typeof courtRateInterval>) => void;
}) => {
 
  const form = useForm<z.infer<typeof courtRateInterval>>({
    resolver: zodResolver(courtRateInterval),
    defaultValues: {
        enabled:true,
        
    },
  });
  const { t } = useTranslation("common");
  const onSubmit = (values: z.infer<typeof courtRateInterval>) => {
    onAddCourtRate(values);
    onOpenChange(false);
  };

  return (
    <DrawerLayout open={open} onOpenChange={onOpenChange}>
      <FormLayout>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-3 sm:grid-cols-2"
          >
            <CustomFormField
              label={t("form.rate")}
              name="rate"
              description="Precio por cada 30 minutes"
              form={form}
              children={(field) => {
                return <AmountInput field={field} currency={"BOB"} />;
              }}
            />
            <CheckForm label={t("form.enabled")} name="enabled" form={form} />

            <div className="col-span-full" />
            <TimeSelectInput
              label="Inicio"
              onChange={(e) => {
                form.setValue("start_time", e);
              }}
            />
            <TimeSelectInput
              label="Fin"
              onChange={(e) => {
                form.setValue("end_time", e);
              }}
            />

            {/* <DrawerClose  className="w-full col-span-full mt-2"> */}
            <Button type="submit" className="drawer-close">
              {t("form.save")}
            </Button>
            {/* </DrawerClose> */}
          </form>
        </Form>
      </FormLayout>
    </DrawerLayout>
  );
};

interface UseUpdateCourtRateStore {
  open: boolean;
  title?:string
  isEdit?:boolean
  court: components["schemas"]["CourtDto"] | undefined;
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: {
    court: components["schemas"]["CourtDto"] | undefined;
    title:string
    isEdit:boolean
  }) => void;
}

export const useUpdateCourtRate = create<UseUpdateCourtRateStore>((set) => ({
  open: false,
  court: undefined,
  isEdit:false,
  title:undefined,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
  onOpenDialog: (opts) =>
    set((state) => ({
      court: opts.court,
      open: true,
      isEdit:opts.isEdit,
    })),
}));
