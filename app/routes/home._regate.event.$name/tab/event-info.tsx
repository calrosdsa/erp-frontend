import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { editEventSchema } from "~/util/data/schemas/regate/event-schema";
import { z } from "zod";
import useEditFields from "~/util/hooks/useEditFields";
import {
  setLoadingToolbar,
  setUpToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";

type EditType = z.infer<typeof editEventSchema>;
export default function EventInfoTab() {
  const { event, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ roleActions, actions });
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
  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit-event",
        editEvent: e,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  setLoadingToolbar(fetcher.state == "submitting", [fetcher.data]);
  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
  );

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
            <CustomFormField
              form={form}
              name="name"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("name");
                    }}
                    title={t("form.name")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
            />

            <CustomFormField
              form={form}
              name="description"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("description");
                    }}
                    title={t("form.description")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
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
