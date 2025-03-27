import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useRef } from "react";
import { z } from "zod";
import { editWarehouseSchema } from "~/util/data/schemas/stock/warehouse-schema";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { WarehouseAutocompleteForm } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
type EditData = z.infer<typeof editWarehouseSchema>;
export default function WarehouseInfo() {
  const { warehouse, addresses, contacts, actions } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const [currencyExchangePerm] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editWarehouseSchema,
    defaultValues: {
      id: warehouse?.id,
      name: warehouse?.name,
      isGroup: warehouse?.is_group,
    },
  });
  const allowEdit = currencyExchangePerm?.edit || false;

  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e,
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
          <div className="detail-grid">
            <CustomFormFieldInput
              label={t("form.name")}
              control={form.control}
              name="name"
              inputType="input"
              allowEdit={allowEdit}
            />
            <WarehouseAutocompleteForm
              label="Almacén Principal"
              control={form.control}
              name="parentName"
              allowEdit={allowEdit}
              isGroup={true}
              roleActions={roleActions}
              onSelect={(e) => {
                form.setValue("parentID", e.id);
              }}
            />

            <CustomFormFieldInput
              label={t("form.isGroup")}
              control={form.control}
              name="isGroup"
              inputType="check"
              allowEdit={false}
            />
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
