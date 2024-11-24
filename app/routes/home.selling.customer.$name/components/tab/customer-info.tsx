import Typography, { subtitle } from "@/components/typography/Typography";
import { action, loader } from "../../route";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";
import { PartyType } from "~/gen/common";
import { routes } from "~/util/route";
import { PartyAddresses } from "~/routes/home.party/components/party-addresses";
import { PartyContacts } from "~/routes/home.party/components/party-contacts";
import { editCustomerSchema } from "~/util/data/schemas/selling/customer-schema";
import useEditFields from "~/util/hooks/useEditFields";
import { z } from "zod";
import CustomFormField from "@/components/custom/form/CustomFormField";
import {
  setLoadingToolbar,
  setUpToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useRef } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useGroupDebounceFetcher } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
type EditCustomerType = z.infer<typeof editCustomerSchema>;
export default function CustomerInfo() {
  const { customer, addresses, contacts, actions } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  // const [searchParams,setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    roleActions: roleActions,
    actions: actions,
  });
  const [groupDebounceFetcher,onGroupNameChange] = useGroupDebounceFetcher({
    partyType:PartyType.customerGroup
})

  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const r = routes;
  const defaultValues = {
    name: customer?.name || "",
    customerType: customer?.customer_type,
    customerID: customer?.id,
    groupID: customer?.group_id || undefined,
    groupName:customer?.group_name ||undefined,
  } as EditCustomerType;
  const { form, hasChanged, updateRef } = useEditFields<EditCustomerType>({
    schema: editCustomerSchema,
    defaultValues: defaultValues,
  });

  const onSubmit = (e: EditCustomerType) => {
    fetcher.submit(
      {
        action: "edit-customer",
        editCustomer: e,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  setLoadingToolbar(fetcher.state == "submitting", [fetcher.data]);

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
              <Typography className="col-span-full" fontSize={subtitle}>
                {t("_customer.info")}
              </Typography>

              <CustomFormField
                name="name"
                children={(field) => {
                  return (
                    <DisplayTextValue
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("name");
                      }}
                      title={t("form.name")}
                      readOnly={!permission?.edit}
                    />
                  );
                }}
              />
              <CustomFormField
                name="customerType"
                children={(field) => {
                  return (
                    <DisplayTextValue
                      value={field.value}
                      inputType="select"
                      field={field}
                      selectOptions={
                        [
                          { name: t("individual"), value: "individual" },
                          { name: t("company"), value: "company" },
                        ] as SelectItem[]
                      }
                      selectNameKey="name"
                      onSelect={(e) => {
                        field.onChange(e.name);
                        form.trigger("customerType");
                      }}
                      title={t("form.type")}
                      readOnly={!permission?.edit}
                    />
                  );
                }}
              />

             
            
                 <CustomFormField
                name="groupName"
                children={(field) => {
                  return (
                    <DisplayTextValue
                      value={field.value}
                      inputType="select"
                      field={field}
                      selectOptions={groupDebounceFetcher.data?.groups || []}
                      selectNameKey="name"
                      onSelect={(e) => {
                        form.setValue("groupID",e.id);
                        form.trigger("groupID");
                      }}
                      onValueChange={onGroupNameChange}
                      title={t("customerGroup")}
                      readOnly={!permission?.edit}
                    />
                  );
                }}
              />
              {/* <DisplayTextValue
                value={customer?.group_name}
                title={t("_group.base")}
                to={r.toGroupsByParty(PartyType.customerGroup)}
              /> */}
            </div>
            <input className="hidden" type="submit" ref={inputRef} />
          </fetcher.Form>
        </Form>
      </FormLayout>

      <div className=" xl:grid xl:grid-cols-2 gap-4 items-start">
        <PartyAddresses
          addresses={addresses}
          onAddAddress={() => {
            navigate(r.toCreateAddress(customer?.id));
          }}
        />

        <PartyContacts
          contacts={contacts}
          onAddContact={() => {
            navigate(r.toCreateContact(customer?.id));
          }}
        />
      </div>
    </div>
  );
}
