import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";
import { useTranslation } from "react-i18next";
import { EventBookingSchema } from "~/util/data/schemas/regate/event-schema";

export default function EventForm() {
  const { form } = useFormContext();
  const { t } = useTranslation("common");
  return (
    <div>
      <SmartField name="name" label={t("form.name")} required={true} />
      <SmartField
        name="description"
        label={t("form.description")}
        type={"textarea"}
      />

    </div>
  );
}
