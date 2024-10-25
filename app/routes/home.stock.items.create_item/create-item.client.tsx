import { useFetcher, useOutletContext } from "@remix-run/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/custom/form/CustomFormField";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Input } from "@/components/ui/input";
import { action } from "./route";
import { createItemSchema } from "~/util/data/schemas/stock/item-schemas";
import { useUomDebounceFetcher } from "~/util/hooks/fetchers/useUomDebounceFetcher";
import { useGroupDebounceFetcher } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType } from "~/gen/common";
import { useCreateGroup } from "../home.groups.$party_/components/create-group";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function CreateItemClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [uomsDebounceFetcher, onUomNameChange] = useUomDebounceFetcher();
  const [groupDebounceFetcher, onChangeGroupName] = useGroupDebounceFetcher({
    partyType: PartyType.itemGroup,
  });
  const createGroup = useCreateGroup();
  const [groupPermission] = usePermission({
    actions: groupDebounceFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const inputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<z.infer<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof createItemSchema>) {
    fetcher.submit({
      action:"create-item",
      createItem:values,
    }, {
      action: "/home/stock/items/create_item",
      method: "POST",
      encType: "application/json",

    });
  }

  setUpToolbar(()=>{
    return {
      onSave:()=>{
        inputRef.current?.click()
      }
    }
  },[])

  useDisplayMessage({
    error:fetcher.data?.error
  },[fetcher.data])

  return (
    <div>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-2 ">
            {/* <div className="col-span-6">
              <Typography fontSize={subtitle}>{t("itemInfo")}</Typography>
            </div> */}
            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
              <CustomFormField
                form={form}
                name="name"
                label={t("form.name")}
                children={(field) => {
                  return <Input {...field} name="name" />;
                }}
              />
            </div>

            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
              <FormAutocomplete
                form={form}
                data={uomsDebounceFetcher.data?.uoms || []}
                label={t("form.uom")}
                nameK={"name"}
                onValueChange={onUomNameChange}
                onSelect={(v) => {
                  form.setValue("uomID", v.id);
                }}
                name="uomName"
              />
            </div>

            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <FormAutocomplete
                form={form}
                label={t("group")}
                data={groupDebounceFetcher.data?.groups || []}
                onOpen={() => onChangeGroupName("")}
                onValueChange={(e) => onChangeGroupName(e)}
                name="groupName"
                nameK={"name"}
                onSelect={(v) => {
                  form.setValue("groupID", v.id);
                }}
                {...(groupPermission?.create && {
                  addNew: () =>
                    createGroup.openDialog({
                      partyType: PartyType[PartyType.itemGroup],
                    }),
                })}
              />
             
            </div>
          <input ref={inputRef} type="submit" className="hidden" />
          </div>
        </fetcher.Form>
      </Form>
    </div>
  );
}
