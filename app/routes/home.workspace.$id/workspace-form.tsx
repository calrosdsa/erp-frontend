import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";
import { useTranslation } from "react-i18next";

import { route } from "~/util/route";

export default function WorkspaceForm() {
  const key = route.customer;
  const { form, isEditing, hasChanged } = useFormContext();
  
  const { t } = useTranslation("common");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SmartField name="name" label={t("form.name")} required={true} />
      
    </div>
  );
}
