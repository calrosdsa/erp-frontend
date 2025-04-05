import { useFormContext } from "@/components/form/form-provider";
import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import {
  ArrayPath,
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { CREATE, DELETE } from "~/constant";
import { components } from "~/sdk";
import {
  DealData,
  mapToParticipantSchema,
  ParticipantData,
} from "~/util/data/schemas/crm/deal.schema";
import { ProfileAutocomplete } from "~/util/hooks/fetchers/profile/profile-fetcher";

interface Observers {
  observers: ParticipantData[];
}
type FieldArray = UseFieldArrayReturn<Observers, ArrayPath<Observers>, "id">;

export default function Participants({
  observers,
  allowEdit,
  className,
}: {
  observers: components["schemas"]["ProfileDto"][];
  allowEdit: boolean;
  className?: string;
}) {
  const { form, isEditing, setIsEditing } = useFormContext();
  const { fields, append, update } = useFieldArray({
    control: form?.control,
    name: "observers",
  }) as unknown as FieldArray;
  const onAddContact = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
    append({ _action: CREATE } as ParticipantData);
  };
  return (
    <div className={cn(className, "grid border rounded-lg p-2")}>
      <div className="flex justify-between items-center">
        <Typography variant="subtitle2">Observadores</Typography>

        {allowEdit && (
          <Button
            variant="ghost"
            type="button"
            size="xs"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon />
            <span>Editar</span>
          </Button>
        )}
      </div>
      {isEditing ? (
        <div className="py-3 grid gap-y-3">
          {fields
            .filter((t) => t._action != DELETE)
            .map((field, index) => {
              return (
                <div key={index} className="grid gap-2">
                  {/* {JSON.stringify(field)} */}
                  <div className=" flex space-x-2 w-full items-center">
                    <ProfileAutocomplete
                      placeholder="Nombre"
                      className="w-full"
                      excludeIds={fields.map((t) => t.profile_id)}
                      defaultValue={field.name}
                      disableAutocomplete={field.profile_id != undefined}
                      onBlur={(e) => {
                        form?.setValue(`observers.${index}.name`, e);
                        // form.trigger(`contacts.${index}`);
                      }}
                      onSelect={(e) => {
                        const d = mapToParticipantSchema(e);
                        console.log("CONTACT D", d);
                        update(index, { ...d, _action: CREATE });
                        // form.setValue(`contacts.${index}`, d);
                      }}
                    />
                    <XIcon
                      className="icon-button w-4 h-4"
                      onClick={() => {
                        update(index, { ...field, _action: DELETE });
                      }}
                    />
                  </div>
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
            <span>Agregar observador</span>
          </Button>
        </div>
      ) : (
        <div className="p-2">
          {observers?.map((observer) => {
            return (
              <div
                className="flex items-center rounded-lg space-x-3 border p-2 "
                id={observer.uuid}
              >
                <Avatar className="w-8 h-8 ">
                  <AvatarFallback>
                    {observer.given_name[0]}
                    {observer.family_name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="">{observer.full_name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
