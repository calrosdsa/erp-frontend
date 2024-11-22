import Typography, { subtitle } from "@/components/typography/Typography";
import { action, loader } from "../../route";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
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
type EditCustomerType = z.infer<typeof editCustomerSchema>;
export default function CustomerInfo() {
  const { customer, addresses, contacts } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const r = routes;
  const { form, hasChanged } = useEditFields<EditCustomerType>({
    schema: editCustomerSchema,
    defaultValues: {
      name: customer?.name || "",
      customerType: customer?.customer_type,
      customerID: customer?.id,
      groupID: customer?.group_id,
    } as EditCustomerType,
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

  setUpToolbar(() => {
    return {
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    };
  }, [hasChanged]);
  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage:()=>{
        navigate(r.toRoute({
          main:r.customerM,
          routePrefix:[r.sellingM],
          routeSufix:[form.getValues().name],
          q:{
            tab:"info"
            
          }
        }))
      }
    },
    [fetcher.data]
  );


  return (
    <div>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            {JSON.stringify(form.formState.errors)}
            <div className="info-grid">
              <Typography className="col-span-full" fontSize={subtitle}>
                {t("_customer.info")}
              </Typography>

              <CustomFormField
                form={form}
                name="name"
                children={(field) => {
                  return (
                    <DisplayTextValue
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                      title={t("form.name")}
                      readOnly={false}
                    />
                  );
                }}
              />
              <DisplayTextValue
                value={customer?.customer_type}
                title={t("form.type")}
              />
              <DisplayTextValue
                value={formatLongDate(customer?.created_at, i18n.language)}
                title={t("table.createdAt")}
              />
              <DisplayTextValue
                value={customer?.group_name}
                title={t("_group.base")}
                to={r.toGroupsByParty(PartyType.customerGroup)}
              />
            </div>
           <input className="hidden" type="submit" ref={inputRef}/>
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
