import ContactList from "@/components/custom-ui/contacts-component";
import FormLayout from "@/components/custom/form/FormLayout";
import AutoCompleteFieldArray from "@/components/custom/select/autocomplete-field-array";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate } from "@remix-run/react";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { action } from "~/routes/home.contact_/route";
import { components } from "~/sdk";
import { Permission } from "~/types/permission";
import {
  ContactBulkData,
  contactBulkDataSchema,
  ContactData,
  mapToContactSchema,
} from "~/util/data/schemas/contact/contact.schema";
import { ContactFieldArray } from "~/util/hooks/fetchers/core/use-contact-fetcher";
import { route } from "~/util/route";

export const PartyContacts = ({
  contacts,
  onAddContact,
  partyID,
  perm,
}: {
  contacts: components["schemas"]["ContactDto"][] | undefined | null;
  onAddContact?: () => void;
  partyID?: number;
  perm?: Permission;
}) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const form = useForm<ContactBulkData>({
    resolver: zodResolver(contactBulkDataSchema),
    defaultValues: {},
  });
  const { fields, append, remove ,update} = useFieldArray({
    control: form.control, // Control from useForm
    name: "contacts", // Name of the array field
  });
  const fetcher = useFetcher<typeof action>();

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit((e) => {})}
          className={" grid border rounded-lg p-2"}
        >
          <div className="grid border rounded-lg p-2">
            <div className="flex justify-between items-center">
              <Typography variant="subtitle2">{t("_contact.list")}</Typography>
              {perm?.edit && (
                <Button variant={"ghost"}>
                  <PencilIcon />
                  <span>Edit</span>
                </Button>
              )}
            </div>

            <div className="py-3 grid gap-y-3">
              {fields.map((field, index) => {
                
                return (
                  <div key={field.id} className="">
                    <ContactFieldArray placeholder="Nombre de Contacto" 
                    onSelect={(e)=>{
                        const d = mapToContactSchema(e)
                        console.log("CONTACT D",d)
                        update(index,d)
                        // form.setValue(`contacts.${index}`,d)
                    }}/>
                    {JSON.stringify(field)}
                  </div>
                );
              })}

              <Button variant={"ghost"} onClick={() => append({name:""} as ContactData)}
                className="text-xs mt-4 underline">
                <PlusIcon className="w-4 h-4"/>
                <span>Add Subtask</span>
              </Button>

              {/* <ContactList
            onAddContact={()=>{
                if(onAddContact){
                    onAddContact()
                    }else{
                        navigate(r.toRoute({
                    main:partyTypeToJSON(PartyType.contact),
                        routePrefix:["new"],
                        q:{
                            referenceID:partyID?.toString(),
                            }
                            }))
                            }
                            }}
                            contacts={contacts}
                            /> */}
            </div>
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
