import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { editEventSchema } from "~/util/data/schemas/regate/event-schema";
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
import { DEFAULT_CURRENCY } from "~/constant";
import { Typography } from "@/components/typography";
import { useEditFields } from "~/util/hooks/useEditFields";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { SerializeFrom } from "@remix-run/node";
import { route } from "~/util/route";
import { setUpModalTabPage } from "@/components/ui/custom/modal-layout";

type EditType = z.infer<typeof editEventSchema>;
export default function EventInfoTab({
  appContext,
  data,
}: {
  appContext: GlobalState;
  data: SerializeFrom<typeof loader>;
}) {
  const key = route.event
  const { event, actions, bookingInfo } = data;
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions,
  });
  const fetcher = useFetcher<typeof action>();
  const defaultValues = {
    name: event?.name,
    eventID: event?.id,
    description: event?.description || undefined,
  } as EditType;
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editEventSchema,
    defaultValues: defaultValues,
  });
  const allowEdit = permission.edit;

  const { setRegister } = useSetupToolbarStore();
  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit-event",
        editEvent: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRouteDetail(route.event, event?.id.toString() || ""),
      }
    );
  };
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  setUpModalTabPage(key,()=>{
    return {
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !hasChanged,
    }
  },[hasChanged])

  
  // setUpToolbar(
  //   (opts) => {
  //     return {
  //       ...opts,
  //       onSave: () => inputRef.current?.click(),
  //       disabledSave: !hasChanged,
  //     };
  //   },
  //   [hasChanged]
  // );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <input className="hidden" type="submit" ref={inputRef} />
          <div className="info-grid">
            <CustomFormFieldInput
              control={form.control}
              name="name"
              label={t("form.name")}
              inputType="input"
              allowEdit={allowEdit}
              required={true}
            />

            {form.watch("name") && (
              <CustomFormFieldInput
                className=" col-span-full"
                control={form.control}
                name="description"
                required={false}
                label={t("form.description")}
                inputType="richtext"
                allowEdit={allowEdit}
              />
            )}

            {/* <CustomFormField
              form={form}
              name="description"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    inputType="textarea"
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("description");
                    }}
                    title={t("form.description")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
            /> */}
            <div className=" col-span-full" />
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
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
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
