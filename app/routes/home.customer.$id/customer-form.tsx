import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";
import { MutableRefObject, useEffect, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { GroupSmartAutocomplete } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { party } from "~/util/party";
import { PartyContacts } from "../home.party/components/party-contacts";
import { useFieldArray } from "react-hook-form";
import { components } from "~/sdk";
import { CustomerData } from "~/util/data/schemas/selling/customer-schema";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { Separator } from "@/components/ui/separator";

export default function CustomerForm({
  contacts,
  inputRef,
}: {
  contacts: components["schemas"]["ContactDto"][];
  inputRef: MutableRefObject<HTMLInputElement | null>;
}) {
  const { form, isEditing, hasChanged } = useFormContext();
  const formValues = form?.getValues() as CustomerData;
  const { t } = useTranslation("common");
  const fieldArray = useFieldArray({
    control: form?.control,
    name: "contacts",
  });

  const { updateToolbar } = useToolbar();
  useEffect(() => {
    updateToolbar({
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    });
  }, [hasChanged]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SmartField name="name" label={t("form.name")} />
      <SmartField
        name="customerType"
        label={t("form.type")}
        options={[
          { label: t("individual"), value: "individual" },
          { label: t("company"), value: "company" },
        ]}
        type="select"
      />
      <GroupSmartAutocomplete
        label={t("group")}
        partyType={party.customerGroup}
        isGroup={false}
        nameK="name"
        defaultValue={formValues.group?.name || ""}
        roleActions={[]}
        onSelect={(e) => {
          form?.setValue("group.id", e.id);
          form?.setValue("group.name", e.name);
        }}
      />
      <Separator className="col-span-full"/>
      {form && (
        <PartyContacts
          className=" col-span-full "
          fieldArray={fieldArray as any}
          form={form}
          partyID={formValues?.customerID}
          contacts={contacts}
          enableEdit={isEditing}
          setEnableEdit={() => {}}
          // perm={permissions[Entity.CONTACT]}
        />
      )}
      <input className="hidden" type="submit" ref={inputRef} />
    </div>
  );
}
