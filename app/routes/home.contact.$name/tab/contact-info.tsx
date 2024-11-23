import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { Typography } from "@/components/typography";
import { PartyReferences } from "~/routes/home.party/components/party-references";
import { useRef } from "react";
import { editContactSchema } from "~/util/data/schemas/contact/contact-schema";
import { z } from "zod";
import useEditFields from "~/util/hooks/useEditFields";
import {
  setLoadingToolbar,
  setUpToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";

type EditContactType = z.infer<typeof editContactSchema>;
export const ContactInfo = () => {
  const { contact, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const defaultValues = {
    givenName: contact?.given_name || "",
    familyName: contact?.family_name,
    partyID: contact?.id,
    email: contact?.email,
    phoneNumber: contact?.phone_number,
  } as EditContactType;
  const { form, hasChanged, updateRef } = useEditFields<EditContactType>({
    schema: editContactSchema,
    defaultValues: defaultValues,
  });
  const onSubmit = (e: EditContactType) => {
    console.log("DATA", e);
    fetcher.submit(
      {
        action: "edit-contact",
        editContact: e,
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
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <input className="hidden" type="submit" ref={inputRef} />
          <div className="info-grid">
            <CustomFormField
              form={form}
              name="givenName"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("givenName");
                    }}
                    title={t("form.givenName")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
            />

            <CustomFormField
              form={form}
              name="familyName"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("familyName");
                    }}
                    title={t("form.familyName")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
            />

            <CustomFormField
              form={form}
              name="email"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("email");
                    }}
                    title={t("form.email")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
            />
            <CustomFormField
              form={form}
              name="phoneNumber"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("phoneNumber");
                    }}
                    title={t("form.phoneNumber")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
            />

            {/*            
            <DisplayTextValue
              title={t("form.gender")}
              value={contact?.gender}
            /> */}

            <Typography variant="subtitle2" className=" col-span-full">
              {t("_contact.list")}
            </Typography>

            <div className=" mx-2 col-span-full">
              {contact && <PartyReferences partyId={contact.id} />}
            </div>
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
