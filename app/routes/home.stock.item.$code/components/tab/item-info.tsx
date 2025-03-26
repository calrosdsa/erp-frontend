import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../../route";
import { useRef } from "react";
import { GlobalState } from "~/types/app-types";
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
import { useEditFields } from "~/util/hooks/useEditFields";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { UomAutocompleteForm } from "~/util/hooks/fetchers/useUomDebounceFetcher";
import { GroupAutocompleteForm } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { route } from "~/util/route";

type EditItemType = z.infer<typeof editItemSchema>;
export default function ItemInfoTab() {
  const { t } = useTranslation("common");
  const { item, actions } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const r = route;
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const allowEdit = permission.edit;
  const { form, hasChanged, updateRef } = useEditFields<EditItemType>({
    schema: editItemSchema,
    defaultValues: {
      id: item?.id,
      name: item?.name,
      code: item?.code,
      uomName: item?.uom_name,
      uomID: item?.uom_id,
      groupID: item?.group_id,
      groupName: item?.group_name,
      maintainStock: item?.maintain_stock,
      description: item?.description,
    },
  });
  // const formValue = form.getValues();
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
          <div className="grid md:grid-cols-2 gap-3">
            <CustomFormFieldInput
              control={form.control}
              name="name"
              label={t("form.name")}
              inputType="input"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="code"
              label={"Código / NP"}
              inputType="input"
            />

            <UomAutocompleteForm
              control={form.control}
              label={t("form.uom")}
              name="uomName"
              allowEdit={allowEdit}
              onSelect={(e) => {
                form.setValue("uomID", e.id);
              }}
            />

            <GroupAutocompleteForm
              control={form.control}
              label={t("group")}
              name="groupName"
              allowEdit={allowEdit}
              isGroup={false}
              partyType={r.itemGroup}
              onSelect={(e) => {
                form.setValue("groupID", e.id);
              }}
            />

            <CustomFormFieldInput
              control={form.control}
              name="maintainStock"
              label={"Mantener en Stock"}
              inputType="check"
              allowEdit={allowEdit}
            />
            {form.watch("id") && (
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
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
