import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/api.document/route";
import { GlobalState } from "~/types/app";
import {
  AddressAndContactDataType,
  addressAndContactSchema,
} from "~/util/data/schemas/document/address-and-contact.schema";
import { AddressAutoCompleteForm } from "~/util/hooks/fetchers/core/use-address-fetcher";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";
import { route } from "~/util/route";

export default function AddressAndContact({
  defaultValues,
  allowEdit,
  showShippingAddress,
  showSupplierAddress,
  showBillingAddress,
}: {
  defaultValues: AddressAndContactDataType;
  showShippingAddress: boolean;
  showSupplierAddress: boolean;
  showBillingAddress: boolean;
  allowEdit: boolean;
}) {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef, previousValues } =
    useEditFields<AddressAndContactDataType>({
      schema: addressAndContactSchema,
      defaultValues: defaultValues,
    });
  const { setRegister } = useSetupToolbarStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const r = route
  const onSubmit = (e: AddressAndContactDataType) => {
    fetcher.submit({
      addressAndContactData: e,
      action: "edit-address-and-contact",
    },{
        method:"POST",
        action:r.apiDocument,
        encType:"application/json",
    });
  };

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

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  useEffect(() => {
    setRegister("tab", {
      onSave: () => {
        console.log("ON SAVE ADDRESS AND CONTACT")
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          <div className="create-grid">
            {showSupplierAddress && (
              <AddressAutoCompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="supplier_address_name"
                label="Dirección del Proveedor"
                onClear={()=>{
                  form.setValue("supplier_address_id",null)
                  form.setValue("supplier_address_name",null)
                }}
                onSelect={(e) => {
                  form.setValue("supplier_address_id", e.id);
                }}
              />
            )}

            {showShippingAddress && (
              <AddressAutoCompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="shipping_address_name"
                label="Dirección de Envío"
                onClear={()=>{
                  form.setValue("shipping_address_id",null)
                  form.setValue("shipping_address_name",null)
                }}
                onSelect={(e) => {
                  form.setValue("shipping_address_id", e.id);
                }}
              />
            )}

            {showBillingAddress && (
              <AddressAutoCompleteForm
                allowEdit={allowEdit}
                name="billing_address_name"
                control={form.control}
                label="Dirección de Facturación"
                onSelect={(e) => {
                  form.setValue("billing_address_id", e.id);
                }}
              />
            )}
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
