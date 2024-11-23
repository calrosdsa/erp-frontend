import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { editCourtSchema } from "~/util/data/schemas/regate/court-schema";
import { z } from "zod";
import { useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import useEditFields from "~/util/hooks/useEditFields";
import {
  setLoadingToolbar,
  setUpToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";

type EditType = z.infer<typeof editCourtSchema>;
export default function CourtInfoTab() {
  const { t } = useTranslation("common");
  const { court, actions } = useLoaderData<typeof loader>();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const defaultValues = {
    name: court?.name,
    courtID: court?.id,
  } as EditType;
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editCourtSchema,
    defaultValues: defaultValues,
  });
  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit-court",
        editCourt: e,
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

            {/* <DisplayTextValue title={t("_item.code")} value={item?.code} />
  
              <DisplayTextValue
                title={t("form.item-group")}
                value={item?.group_name}
                to=""
              />
  
              <DisplayTextValue title={t("form.uom")} value={item?.uom_name} /> */}
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
