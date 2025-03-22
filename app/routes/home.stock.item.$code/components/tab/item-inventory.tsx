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
import { editItemInventory } from "~/util/data/schemas/stock/item-inventory-schema";

type EditItemType = z.infer<typeof editItemInventory>;
export default function ItemInventory() {
  const { t } = useTranslation("common");
  const { inventory, actions,item } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const r = route;
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const allowEdit = permission.edit;
  const { form, hasChanged, updateRef } = useEditFields<EditItemType>({
    schema: editItemInventory,
    defaultValues: {
      itemID:item?.id,
      shelfLifeInDays: inventory?.shelf_life_in_days,
      warrantyPeriodInDays: inventory?.warranty_period_in_days,
      weightUom: inventory?.weight_uom,
      weightUomID: inventory?.weight_uom_id,
      hasSerialNo: inventory?.has_serial_no,
      serialNoTemplate: inventory?.serial_no_template,
      wightPerUnit: inventory?.weight_per_unit,
    },
  });
  // const formValue = form.getValues();
  const onSubmit = (e: EditItemType) => {
    fetcher.submit(
      {
        action: "edit-inventory",
        editInventory: e,
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
            <CustomFormFieldInput
              control={form.control}
              name="shelfLifeInDays"
              label={"Vida útil en días"}
              inputType="input"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="warrantyPeriodInDays"
              label={"Periodo de garantía en días"}
              inputType="input"
              allowEdit={allowEdit}
            />

            <UomAutocompleteForm
              control={form.control}
              label={"Unidad de medida de peso"}
              name="weightUom"
              allowEdit={allowEdit}
              onSelect={(e) => {
                form.setValue("weightUomID", e.id);
              }}
            />
            <CustomFormFieldInput
              control={form.control}
              name="wightPerUnit"
              label={"Peso por unidad"}
              inputType="input"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="hasSerialNo"
              label={"Tiene número de serie"}
              inputType="check"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="serialNoTemplate"
              label={"Serie de números de serie"}
              inputType="input"
              allowEdit={allowEdit}
            />
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
