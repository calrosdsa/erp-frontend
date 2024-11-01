import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Input } from "@/components/ui/input";
import { action } from "./route";
import { createItemSchema } from "~/util/data/schemas/stock/item-schemas";
import { useUomDebounceFetcher } from "~/util/hooks/fetchers/useUomDebounceFetcher";
import { useGroupDebounceFetcher } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateGroup } from "../home.groups.$party_/components/create-group";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { routes } from "~/util/route";

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
  const r = routes
  const navigate = useNavigate()
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
      action:r.toRoute({
        main:partyTypeToJSON(PartyType.item),
        routePrefix:[r.stockM],
        routeSufix:["new"]
      }),
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
    error:fetcher.data?.error,
    success:fetcher.data?.message,
    onSuccessMessage:()=>{
      if(fetcher.data?.item){
        const newItem = fetcher.data.item
        navigate(r.toRoute({
          main:partyTypeToJSON(PartyType.item),
          routePrefix:[r.stockM],
          routeSufix:[newItem.name],
          q:{
            tab:"info",
            id:newItem.uuid,
          }
        }))
      }
    }
  },[fetcher.data])

  return (
    <div>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            {/* <div className="col-span-6">
              <Typography fontSize={subtitle}>{t("itemInfo")}</Typography>
            </div> */}
              <CustomFormField
                form={form}
                name="name"
                label={t("form.name")}
                children={(field) => {
                  return <Input {...field} name="name" />;
                }}
              />

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

            <FormAutocomplete
                form={form}
                label={t("_group.base")}
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
                      partyType: PartyType.itemGroup,
                    }),
                })}
              />
             
          <input ref={inputRef} type="submit" className="hidden" />
          </div>
        </fetcher.Form>
      </Form>
    </div>
  );
}
