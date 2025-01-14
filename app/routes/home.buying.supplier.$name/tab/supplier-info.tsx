import Typography, { subtitle } from "@/components/typography/Typography";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { PartyAddresses } from "~/routes/home.party/components/party-addresses";
import { PartyContacts } from "~/routes/home.party/components/party-contacts";

import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useRef } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import {
  GroupAutocompleteForm,
} from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { useEditFields } from "~/util/hooks/useEditFields";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

import { editSupplier } from "~/util/data/schemas/buying/supplier-schema";
import { action, loader } from "../route";
type EditType = z.infer<typeof editSupplier>;
export default function CustomerInfo() {
  const { supplier, addresses, contacts, actions } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  // const [searchParams,setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    roleActions: roleActions,
    actions: actions,
  });
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const r = route;
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editSupplier,
    defaultValues: {
      id: supplier?.id,
      name: supplier?.name || "",
      group: supplier?.group,
      groupID: supplier?.group_id,
      groupUUID:supplier?.group_uuid
    },
  });
  const formValues = form.getValues()
  const allowEdit = permission.edit || false

  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  return (
    <div>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="info-grid">
              <CustomFormFieldInput
                name="name"
                control={form.control}
                inputType="input"
                label={t("form.name")}
                allowEdit={allowEdit}
              />
              <GroupAutocompleteForm
                name="group"
                label={t("group")}
                href={formValues.groupUUID ? r.toRoute({
                  main:r.customerGroup,
                  routePrefix:[r.group],
                  routeSufix:[formValues.group || ""],
                  q:{
                    tab:"info",
                    id:formValues.groupUUID,
                  }
                }): undefined}
                control={form.control}
                partyType={r.supplierGroup}
                isGroup={false}
                onSelect={(e) => {
                  form.setValue("groupID", e.id);
                  form.setValue("groupUUID", e.uuid);
                }}
                allowEdit={allowEdit}
              />
             
            </div>
            <input className="hidden" type="submit" ref={inputRef} />
          </fetcher.Form>
        </Form>
      </FormLayout>

      <div className=" xl:grid xl:grid-cols-2 gap-4 items-start">
        <PartyAddresses
          addresses={addresses}
          onAddAddress={() => {
            navigate(r.toCreateAddress(supplier?.id));
          }}
        />

        <PartyContacts
          contacts={contacts}
          onAddContact={() => {
            navigate(r.toCreateContact(supplier?.id));
          }}
        />
      </div>
    </div>
  );
}
