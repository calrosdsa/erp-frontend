import FormLayout from "@/components/custom/form/FormLayout";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/api.document/route";
import { useAddressStore } from "~/routes/home.address.$id/address-store";
import { Permission } from "~/types/permission";
import {
  AddressAndContactDataType,
  addressAndContactSchema,
} from "~/util/data/schemas/document/address-and-contact.schema";
import { useModalNav } from "~/util/hooks/app/use-open-modal";
import { AddressAutoCompleteFormField } from "~/util/hooks/fetchers/core/use-address-fetcher";
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
  showPartyrAddress,
  showBillingAddress,
  partyLabel,
  addressPerm,
  contactPerm,
}: {
  defaultValues: AddressAndContactDataType;
  showShippingAddress?: boolean;
  showPartyrAddress?: boolean;
  showBillingAddress?: boolean;
  allowEdit: boolean;
  partyLabel?: string;
  addressPerm?: Permission;
  contactPerm?: Permission;
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
  const r = route;
  const [focusedField,setFocusedField] = useState<string | null>(null)
  const formValues = form.getValues();
  const {newAddress} = useAddressStore()
  const {openModal} = useModalNav()
  const onSubmit = (e: AddressAndContactDataType) => {
    fetcher.submit(
      {
        addressAndContactData: e,
        action: "edit-address-and-contact",
      },
      {
        method: "POST",
        action: r.apiDocument,
        encType: "application/json",
      }
    );
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
        console.log("ON SAVE ADDRESS AND CONTACT");
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

  useEffect(()=>{
    if(newAddress){
      console.log("NEW ADDRESS",newAddress)
      form.setValue(focusedField as any,{
        id:newAddress.id,
        name:newAddress.title,
      })
      form.trigger(focusedField as any)
    }
  },[newAddress])

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          <div className="info-grid">
            {/* {JSON.stringify(formValues.party_address)} */}
            {showPartyrAddress && (
              <>
                <Typography variant="subtitle2" className=" col-span-full">
                  {partyLabel}
                </Typography>
                <AddressAutoCompleteFormField
                  allowEdit={allowEdit}
                  form={form}
                  onFocus={()=>{
                    setFocusedField("party_address")
                  }}
                  name="party_address"
                  label={partyLabel}
                  permission={addressPerm}
                  openModal={openModal}
                  {...(addressPerm?.view && {
                    href: route.toRoute({
                      main: r.address,
                      routeSufix: [formValues.party_address?.name || ""],
                      q: {
                        tab:"info",
                        id: formValues.party_address?.uuid || "",
                      },
                    }),
                  })}
                />
              </>
            )}

            {showShippingAddress && (
              <>
                <Typography variant="subtitle2" className=" col-span-full">
                  Dirección de envío de la compañía
                </Typography>
                <AddressAutoCompleteFormField
                  allowEdit={allowEdit}
                  form={form}
                  name="shipping_address"
                  onFocus={()=>{
                    setFocusedField("shipping_address")
                  }}
                  label="Seleccione la dirección de envío"
                  permission={addressPerm}
                  openModal={openModal}
                  {...(addressPerm?.view && {
                    href: route.toRoute({
                      main: r.address,
                      routeSufix: [formValues.shipping_address?.name || ""],
                      q: {
                        tab:"info",
                        id: formValues.shipping_address?.uuid || "",
                      },
                    }),
                  })}
                />
              </>
            )}

            {showBillingAddress && (
              <>
                <Typography variant="subtitle2" className=" col-span-full">
                  Dirección de Facturación de la Compañía
                </Typography>
                <AddressAutoCompleteFormField
                  allowEdit={allowEdit}
                  name="billing_address"
                  onFocus={()=>{
                    setFocusedField("billing_address")
                  }}
                  form={form}
                  label="Seleccione dirección de facturación"
                  permission={addressPerm}
                  openModal={openModal}
                  {...(addressPerm?.view && {
                    href: route.toRoute({
                      main: r.address,
                      routeSufix: [formValues.billing_address?.name || ""],
                      q: {
                        tab:"info",
                        id: formValues.billing_address?.uuid || "",
                      },
                    }),
                  })}
                />
              </>
            )}
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
