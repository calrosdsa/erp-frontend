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
import { setUpModalTabPage, useModalStore } from "@/components/ui/custom/modal-layout";
import { route } from "~/util/route";

export default function SupplierForm({
  contacts,
}: {
  contacts: components["schemas"]["ContactDto"][];
}) {
  const key = route.supplier
  const { form} = useFormContext();
  const formValues = form?.getValues() as CustomerData;
  const { t } = useTranslation("common");

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SmartField name="name" label={t("form.name")} />
    
      <GroupSmartAutocomplete
        label={t("group")}
        partyType={party.supplierGroup}
        isGroup={false}
        nameK="name"
        defaultValue={formValues.group?.name || ""}
        onSelect={(e) => {
          form?.setValue("group.id", e.id);
          form?.setValue("group.name", e.name);
        }}
        />
      <Separator className="col-span-full"/>
      {form && (
        <PartyContacts
          className=" col-span-full "
          partyID={formValues?.customerID}
          contacts={contacts}
          />
        )}
      {/* {JSON.stringify(formValues)} */}
    </div>
  );
}
