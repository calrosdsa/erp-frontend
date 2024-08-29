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
import { useEffect } from "react";
import useEditFields from "~/util/hooks/useEditFields";
import { toast, useToast } from "@/components/ui/use-toast";

export default function ClientProfile() {
  const { client } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const defaultValues = {
    givenName: client?.GivenName,
    familyName: client?.FamilyName,
    organizationName: client?.OrganizationName,
    countryCode: client?.CountryCode,
    phoneNumber: client?.PhoneNumber,
  };
  const { form, hasChanged } = useEditFields({
    schema: updateClientSchema,
    defaultValues,
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
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
    }
  }, [fetcher.data]);
  return (
    <Form {...form}>
      <fetcher.Form
        className=" w-full info-grid-sidebar"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {client && (
          <>
            <div className=" col-span-full flex justify-between w-full items-center">
              <Typography fontSize={title}>{t("info")}</Typography>
              <Button disabled={!hasChanged} onClick={() => {}}>
                {t("form.save")}
              </Button>
            </div>

            <CustomFormField
              form={form}
              name="givenName"
              children={(field) => {
                return (
                  <DisplayTextValue
                    title={t("form.givenName")}
                    //   onChange={(e)=>updateField("GivenName",e)}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
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
                    //   onChange={(e)=>updateField("GivenName",e)}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    readOnly={false}
                  />
                );
              }}
            />

            <DisplayTextValue
              title={t("form.email")}
              value={client.EmailAddress}
            />

            <CustomFormField
              form={form}
              name="phoneNumber"
              children={(field) => {
                return (
                  <DisplayTextValue
                    title={t("form.phoneNumber")}
                    //   onChange={(e)=>updateField("GivenName",e)}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    readOnly={false}
                  />
                );
              }}
            />

            <CustomFormField
              form={form}
              name="organizationName"
              children={(field) => {
                return (
                  <DisplayTextValue
                    title={t("form.companyName")}
                    //   onChange={(e)=>updateField("GivenName",e)}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    readOnly={false}
                  />
                );
              }}
            />

            <CustomFormField
              form={form}
              name="countryCode"
              children={(field) => {
                return (
                  <DisplayTextValue
                    title={t("form.countryCode")}
                    //   onChange={(e)=>updateField("GivenName",e)}
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    readOnly={false}
                  />
                );
              }}
            />

            {client.ClientKeyValueData?.map((item, idx) => {
              return (
                <div key={idx}>
                  <DisplayTextValue title={item.key} value={item.value} />
                </div>
              );
            })}

            {/* <CustomForm
            fetcher={fetcher}
            updateClientSchema={updateClientFormSchema}
            defaultValues={{
                givenName:client.GivenName
                }}
                formItemsData={[
                    {
                        name:"givenName",
                        label:t("form.name"),
                        type:"string",
                    typeForm:"input",
                    }
            ]}
            onSubmit={(e:z.infer<typeof updateClientFormSchema>)=>{
                console.log("VALUES",e)
                }}
                /> */}
          </>
        )}
      </fetcher.Form>
    </Form>
  );
}
