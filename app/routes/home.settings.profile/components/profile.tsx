import { useFetcher, useLoaderData } from "@remix-run/react";
import { action, loader } from "../route";
import CustomForm from "@/components/custom/form/CustomForm";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { updateClientSchema } from "~/util/data/schemas/client/client-schema";
import { useEffect, useRef } from "react";
import { toast, useToast } from "@/components/ui/use-toast";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";

export default function ProfileInfo() {
  const { profile } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const toolbar = useToolbar()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const defaultValues = {
    givenName: profile?.given_name,
    familyName: profile?.family_name,
    phoneNumber: profile?.phone_number,
  };
  const { form, hasChanged } = useEditFields<z.infer<typeof updateClientSchema>>({
    schema: updateClientSchema,
    defaultValues:{
      givenName: profile?.given_name,
      familyName: profile?.family_name,
      phoneNumber: profile?.phone_number || undefined,
    },
  });
  function onSubmit(values: z.infer<typeof updateClientSchema>) {
    fetcher.submit(
      {
        action: "update-client",
        updateClient: values,
      },
      {
        method: "post",
        encType: "application/json",
      }
    );
  }
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );
  setUpToolbar(()=>{
    return {
      onSave:()=> inputRef.current?.click(),
      disabledSave:!hasChanged  
    }
},[hasChanged])
  useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message
  },[fetcher.data])

  return (
    <Form {...form}>
      <fetcher.Form
        className=" w-full info-grid-sidebar"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {profile && (
          <>
           <input className="hidden" type="submit" ref={inputRef}/>
          
            <CustomFormField
              form={form}
              name="givenName"
              children={(field) => {
                return (
                  <DisplayTextValue
                    title={t("form.givenName")}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    inputType="input"
                    readOnly={false}
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
                    title={t("form.familyName")}
                    field={field}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    inputType="input"
                    readOnly={false}
                  />
                );
              }}
            />

            <DisplayTextValue
              title={t("form.email")}
              value={profile.email}
            />

            <CustomFormField
              form={form}
              name="phoneNumber"
              children={(field) => {
                return (
                  <DisplayTextValue
                    title={t("form.phoneNumber")}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    inputType="input"
                    field={field}
                    readOnly={false}
                  />
                );
              }}
            />
            
          </>
        )}
      </fetcher.Form>
    </Form>
  );
}
