import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";
import { useTranslation } from "react-i18next";
import { AddressSchema } from "~/util/data/schemas/core/address.schema";

export default function AddressForm() {
  const { t } = useTranslation("common");
  const { form } = useFormContext<AddressSchema>();
  const formValues = form?.getValues();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SmartField name="title" label={t("form.name")} required />
        <SmartField name="city" label={t("form.city")} required />
        <SmartField name="streetLine1" label={t("form.streetLine1")} required />
        <SmartField name="streetLine2" label={t("form.streetLine2")} required />
        <SmartField
          name="isBillingAddress"
          label={t("form.isBillingAddress")}
          type="checkbox"
          required
        />
        <SmartField
          name="isShippingAddress"
          label={t("form.isShippingAddress")}
          type="checkbox"
          required
        />
        <SmartField name="province" label={t("form.province")} />
        <SmartField name="company" label={t("form.company")} />
        <SmartField name="postalCode" label={t("form.postalCode")} />
        <SmartField
          name="identificationNumber"
          label={t("form.identificationNumber")}
        />
        <SmartField name="email" label={t("form.email")} />
        <SmartField name="phoneNumber" label={t("form.phoneNumber")} />
      </div>
    </>
  );
}
