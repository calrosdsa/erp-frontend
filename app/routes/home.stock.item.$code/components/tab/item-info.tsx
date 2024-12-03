import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { title } from "@/components/typography/Typography";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { action, loader } from "../../route";
import { useRef } from "react";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { editItemSchema } from "~/util/data/schemas/stock/item-schemas";
import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { useEditFields } from "~/util/hooks/useEditFields";

type EditItemType = z.infer<typeof editItemSchema>;
export default function ItemInfoTab() {
  const { t } = useTranslation("common");
  const { item, actions } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const defaultValues = {
    name: item?.name,
    itemID: item?.id,
  } as EditItemType;
  const { form, hasChanged, updateRef } = useEditFields<EditItemType>({
    schema: editItemSchema,
    defaultValues: defaultValues,
  });
  const onSubmit = (e: EditItemType) => {
    fetcher.submit(
      {
        action: "edit-item",
        editItem: e,
      },
      {
        method: "POST",
        encType: "application/json",
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
                    inputType="input"
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

            <DisplayTextValue title={t("form.code")} value={item?.code} />

            <DisplayTextValue
              title={t("form.item-group")}
              value={item?.group_name}
              to=""
            />

            <DisplayTextValue title={t("form.uom")} value={item?.uom_name} />
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
