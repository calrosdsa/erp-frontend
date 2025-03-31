import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { Typography } from "@/components/typography";
import { PartyReferences } from "~/routes/home.party/components/party-references";
import { useEffect, useRef } from "react";
import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { useEditFields } from "~/util/hooks/useEditFields";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import {
  ContactData,
  contactDataSchema,
} from "~/util/data/schemas/contact/contact.schema";

export const ContactInfo = () => {
  const { contact, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<ContactData>({
    schema: contactDataSchema,
    defaultValues: {
      contact_id: contact?.id,
      name: contact?.name,
      email: contact?.email,
      phone_number: contact?.phone_number,
    },
  });
  const allowEdit = permission.edit;
  const { setRegister } = useSetupToolbarStore();
  const onSubmit = (e: ContactData) => {
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

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );
  useEffect(() => {
    setRegister("tab", {
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    });
  }, [hasChanged]);

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
          <div className="detail-grid">
            <CustomFormFieldInput
              name="name"
              control={form.control}
              inputType="input"
              label={t("form.name")}
              allowEdit={allowEdit}
            />

            <CustomFormFieldInput
              name="email"
              control={form.control}
              inputType="input"
              type="email"
              label={t("form.name")}
              allowEdit={allowEdit}
            />

            <CustomFormFieldInput
              name="phone_number"
              control={form.control}
              inputType="input"
              type="tel"
              label={t("form.name")}
              allowEdit={allowEdit}
            />

            {/*            
            <DisplayTextValue
              title={t("form.gender")}
              value={contact?.gender}
            /> */}

            {/* <Typography variant="subtitle2" className=" col-span-full">
              {t("_contact.list")}
            </Typography> */}

            {/* <div className=" mx-2 col-span-full">
              {contact && <PartyReferences partyId={contact.id} />}
            </div> */}
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
};
