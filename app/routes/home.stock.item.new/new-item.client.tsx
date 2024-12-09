import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import { action, loader } from "./route";
import { createItemSchema } from "~/util/data/schemas/stock/item-schemas";
import { UomAutocompleteForm } from "~/util/hooks/fetchers/useUomDebounceFetcher";
import { GroupAutocompleteForm } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateGroup } from "../home.groups.$party_/components/create-group";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { routes } from "~/util/route";
import { Entity } from "~/types/enums";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

export default function NewItemClient() {
  const fetcher = useFetcher<typeof action>();
  const { entityActions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const r = routes;
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof createItemSchema>) {
    fetcher.submit(
      {
        action: "create-item",
        createItem: values,
      },
      {
        action: r.toRoute({
          main: partyTypeToJSON(PartyType.item),
          routePrefix: [r.stockM],
          routeSufix: ["new"],
        }),
        method: "POST",
        encType: "application/json",
      }
    );
  }

  setUpToolbar(() => {
    return {
      title: t("new"),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.item) {
          const newItem = fetcher.data.item;
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.item),
              routePrefix: [r.stockM],
              routeSufix: [newItem.name],
              q: {
                tab: "info",
                id: newItem.uuid,
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  return (
    <div>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            {/* <div className="col-span-6">
              <Typography fontSize={subtitle}>{t("itemInfo")}</Typography>
            </div> */}
            <CustomFormFieldInput
              control={form.control}
              name="name"
              label={t("form.name")}
              inputType="input"
              
            />
            <UomAutocompleteForm
              control={form.control}
              label={t("form.uom")}
              name="uomName"
              onSelect={(e) => {
                form.setValue("uomID", e.id);
              }}
            />

            <GroupAutocompleteForm
              control={form.control}
              label={t("group")}
              name="groupName"
              roleActions={roleActions}
              actions={entityActions && entityActions[Entity.ITEM_GROUP]}
              isGroup={false}
              partyType={r.itemGroup}
              onSelect={(e) => {
                form.setValue("groupID", e.id);
              }}
            />

            <input ref={inputRef} type="submit" className="hidden" />
          </div>
        </fetcher.Form>
      </Form>
    </div>
  );
}
