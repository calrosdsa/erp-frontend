import Typography, { subtitle } from "@/components/typography/Typography";
import { action, loader } from "../../route";
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
import { editCustomerSchema } from "~/util/data/schemas/selling/customer-schema";

import { z } from "zod";
import {
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { GroupAutocompleteForm } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { useEditFields } from "~/util/hooks/useEditFields";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Entity } from "~/types/enums";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
type EditCustomerType = z.infer<typeof editCustomerSchema>;
export default function CustomerInfo({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const fetcherLoader = useFetcher<typeof loader>({ key: "customer" });
  const data = fetcherLoader.data;
  const customer = fetcherLoader.data?.customer;
  const { roleActions } = appContext;
  // const [searchParams,setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    roleActions: roleActions,
    actions: data?.actions,
  });
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { updateToolbar } = useToolbar()
  
  const navigate = useNavigate();
  const r = route;
  const { form, hasChanged, updateRef } = useEditFields<EditCustomerType>({
    schema: editCustomerSchema,
    defaultValues: {
      name: customer?.name || "",
      customerType: t(customer?.customer_type || ""),
      customerTypeValue: customer?.customer_type,
      customerID: customer?.id,
      groupID: customer?.group_id,
      groupName: customer?.group_name,
      groupUUID: customer?.group_uuid,
    },
  });
  const formValues = form.getValues();
  const allowEdit = permission.edit || false;

  const onSubmit = (e: EditCustomerType) => {
    fetcher.submit(
      {
        action: "edit-customer",
        editCustomer: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRoute({
          main: route.customer,
          routeSufix: [customer?.id.toString() || ""],
        }),
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

  useEffect(()=>{
    updateToolbar({
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    })
  },[hasChanged])


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
    <div className="grid grid-cols-9 gap-3">
      <div className="col-span-4">
        <FormLayout>
          <Form {...form}>
            <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-3">
                <Typography className="col-span-full" fontSize={subtitle}>
                  {t("_customer.info")}
                </Typography>

                <CustomFormFieldInput
                  name="name"
                  control={form.control}
                  inputType="input"
                  label={t("form.name")}
                  allowEdit={allowEdit}
                />

                <FormAutocomplete
                  control={form.control}
                  data={
                    [
                      { name: t("individual"), value: "individual" },
                      { name: t("company"), value: "company" },
                    ] as SelectItem[]
                  }
                  onValueChange={() => {}}
                  label={t("form.type")}
                  nameK={"name"}
                  name="customerType"
                  onSelect={(e) => {
                    form.setValue("customerTypeValue", e.value);
                  }}
                  allowEdit={allowEdit}
                />

                <GroupAutocompleteForm
                  name="groupName"
                  label={t("group")}
                  href={
                    formValues.groupUUID
                      ? r.toRoute({
                          main: r.customerGroup,
                          routePrefix: [r.group],
                          routeSufix: [formValues.groupName || ""],
                          q: {
                            tab: "info",
                            id: formValues.groupUUID,
                          },
                        })
                      : undefined
                  }
                  control={form.control}
                  partyType={r.customerGroup}
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
      </div>
      {customer?.id && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={customer?.id}
            partyName={customer?.name}
            entityID={Entity.CUSTOMER}
          />
        </div>
      )}
    </div>
  );
}
