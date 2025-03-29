import ContactList from "@/components/custom-ui/contacts-component";
import FormLayout from "@/components/custom/form/FormLayout";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate } from "@remix-run/react";
import { ArrowRightLeft, PencilIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ArrayPath,
  FieldValues,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CREATE, DELETE, EDIT } from "~/constant";
import { action } from "~/routes/home.contact_/route";
import { components } from "~/sdk";
import { Action } from "~/types/enums";
import { Permission } from "~/types/permission";
import {
  ContactData,
  mapToContactSchema,
} from "~/util/data/schemas/contact/contact.schema";
import { ContactAutocomplete } from "~/util/hooks/fetchers/core/use-contact-fetcher";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
interface Contact {
  contacts: ContactData[];
}

type FieldArray = UseFieldArrayReturn<Contact, ArrayPath<Contact>, "id">;

export const PartyContacts = ({
  partyID,
  // perm,
  enableEdit,
  fieldArray,
  form,
  contacts,
  setEnableEdit,
  allowEdit,
  className,
}: {
  partyID?: number;
  // perm?: Permission;
  contacts?: components["schemas"]["ContactDto"][];
  enableEdit?: boolean;
  setEnableEdit: (e: boolean) => void;
  fieldArray: FieldArray;
  form: UseFormReturn<any>;
  allowEdit?: boolean;
  className?:string;
}) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const { fields, append, remove, update } = fieldArray;
  const fetcher = useFetcher<typeof action>();
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  const toggleItem = (itemId: number) => {
    setOpenStates((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const onAddContact = () => {
    if (!enableEdit) {
      setEnableEdit(true);
    }
    append({ name: "",reference_id:partyID } as ContactData);
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  return (
    <div className={cn(className,"grid")}>
      <div className="flex justify-between items-center">
        <Typography variant="subtitle2">{t("_contact.list")}</Typography>

        {allowEdit && (
          <Button
            variant="ghost"
            type="button"
            size="xs"
            onClick={() => setEnableEdit(true)}
          >
            <PencilIcon />
            <span>Editar</span>
          </Button>
        )}
      </div>

      {enableEdit ? (
        <div className="py-3 grid gap-y-3">
          {fields
            .filter((t) => t.action != DELETE)
            .map((field, index) => {
              return (
                <div key={field.contact_id} className="grid gap-2">
                  <div className=" flex space-x-2 w-full items-center">
                    <ContactAutocomplete
                      placeholder="Nombre de Contacto"
                      className="w-full"
                      defaultValue={field.name}
                      addNew={() => {
                        toggleItem(index);
                        update(index, {
                          ...field,
                          action: Action.CREATE,
                        } as ContactData);
                      }}
                      excludeIds={fields.map((t) => t.contact_id || 0)}
                      badgeLabel={
                        field.contact_id && openStates[index]
                          ? "Editar"
                          : field.action == Action.CREATE
                          ? "Nuevo"
                          : undefined
                      }
                      disableAutocomplete={
                        field.contact_id != undefined ||
                        field.action == Action.CREATE
                      }
                      onBlur={(e) => {
                        form.setValue(`contacts.${index}.name`, e);
                        // form.trigger(`contacts.${index}`);
                      }}
                      actions={[
                        ...(field.contact_id
                          ? [
                              ...(openStates[index]
                                ? [
                                    {
                                      Icon: ArrowRightLeft,
                                      onClick: () => toggleItem(index),
                                    },
                                  ]
                                : [
                                    {
                                      Icon: PencilIcon,
                                      onClick: () => toggleItem(index),
                                    },
                                  ]),
                            ]
                          : field.action == Action.CREATE
                          ? [
                              {
                                Icon: ArrowRightLeft,
                                onClick: () => toggleItem(index),
                              },
                            ]
                          : []),
                      ]}
                      onSelect={(e) => {
                        const d = mapToContactSchema(e, partyID);
                        console.log("CONTACT D", d);
                        update(index, { ...d, action: EDIT });
                        // form.setValue(`contacts.${index}`, d);
                      }}
                    />
                    <XIcon
                      className="icon-button w-4 h-4"
                      onClick={() => {
                        if (field.name) {
                          update(index, { ...field, action: DELETE });
                        } else {
                          remove(index);
                        }
                      }}
                    />
                  </div>

                  {openStates[index] && (
                    <>
                      <div className="pl-3">
                        <div>
                          <FormLabel className="text-xs mb-1">E-mail</FormLabel>
                          <Input
                            className="text-xs"
                            {...form.register(`contacts.${index}.email`)}
                            type="email"
                          />
                        </div>

                        <div>
                          <FormLabel className="text-xs mb-1">
                            Teléfono
                          </FormLabel>
                          <Input
                            className="text-xs"
                            {...form.register(`contacts.${index}.phone_number`)}
                            type="tel"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          <Button
            variant={"ghost"}
            type="button"
            onClick={onAddContact}
            className="text-xs mt-4 underline"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Agregar contacto</span>
          </Button>
        </div>
      ) : (
        <ContactList contacts={contacts} onAddContact={onAddContact} />
      )}
    </div>
  );
};
