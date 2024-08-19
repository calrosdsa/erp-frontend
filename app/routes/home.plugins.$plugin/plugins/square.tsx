import CustomFormField from "@/components/custom/form/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { components } from "~/sdk";

type SquareCredentials = {
  accessToken: string;
  applicationId: string;
  locationId: string;
  apiVersion: string;
};
export const squareCredentialsformSchema = z.object({
  accessToken: z.string().min(5),
  applicationId: z.string().min(5),
  apiVersion: z.string().min(5),
  locationId: z.string().min(5),
});
export default function SquarePlugin({
  companyPlugin,
}: {
  companyPlugin: components["schemas"]["CompanyPlugins"];
}) {
  const { t } = useTranslation();
  const [showAccessToken, setShowAccessToken] = useState(true);
  const fetcher = useFetcher();
  const [credentials, setCredentias] = useState<SquareCredentials | null>(null);
  const form = useForm<z.infer<typeof squareCredentialsformSchema>>({
    resolver: zodResolver(squareCredentialsformSchema),
    defaultValues: {
      accessToken: credentials?.accessToken,
      applicationId: credentials?.applicationId,
      apiVersion: credentials?.apiVersion,
      locationId: credentials?.locationId,
    },
  });

  const parseCredentials = (c: string | undefined) => {
    try {
      if (c == undefined) {
        return;
      }
      // const cleanedString = c.slice(1, -1);
      const parse = JSON.parse(c) as SquareCredentials;
      console.log(parse);
      setCredentias(parse);
      // form.setValue("accessToken",parse.accessToken)
      form.setValue("locationId",parse.locationId)
      form.setValue("apiVersion",parse.apiVersion)
      form.setValue("applicationId",parse.applicationId)
      form.setValue("accessToken",parse.accessToken)

    } catch (err) {
      setCredentias({
        accessToken: "",
        locationId: "",
        applicationId: "",
        apiVersion: "",
      });
      console.log(err);
    }
  };

  function onSubmit(values: z.infer<typeof squareCredentialsformSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(form.getValues());
    fetcher.submit({
      updatePluginSquare:values,
      plugin:"square",
      action:"update-credentials",
    }, {
      action: "/home/plugins/${plugin}",
      method: "POST",
      encType:"application/json"
    });
  }

  useEffect(() => {
    parseCredentials(companyPlugin.Credentials);
  }, [companyPlugin]);

  return (
    <div>
      {credentials != null && (
        <Form {...form}>
          <fetcher.Form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            action="/home/plugins/square"
            className="grid gap-y-3 max-w-sm"
          >
            <input type="hidden" value="update-credentials" name="action" />

            <CustomFormField
              form={form}
              name="applicationId"
              label={t("applicationId")}
              children={(field) => {
                return (
                  <Input {...field} type="text" />
                  // <Input {...field} name="name" />
                );
              }}
            />
            {/* <FormControl>
          <FormLabel>{t("applicationId")}</FormLabel>
        </FormControl> */}

            <CustomFormField
              form={form}
              name="accessToken"
              label={t("accessToken")}
              children={(field) => {
                return (
                  <Input {...field}  defaultValue={credentials?.accessToken} />
                  // <Input {...field} name="name" />
                );
              }}
            />

            {/* <FormControl>
          <FormLabel>{t("accessToken")}</FormLabel>
          <Input type={showAccessToken ? "password":"text"} required name="accessToken" 
          defaultValue={credentials?.accessToken} 
          />
        </FormControl> */}

            <CustomFormField
              form={form}
              name="locationId"
              label={t("locationId")}
              children={(field) => {
                return (
                  <Input {...field} type="text" />
                  // <Input {...field} name="name" />
                );
              }}
            />

            {/* <FormControl>
              <FormLabel>{t("locationId")}</FormLabel>
              <Input
                type="text"
                name="locationId"
                defaultValue={credentials?.locationId}
              />
            </FormControl> */}

            <CustomFormField
              form={form}
              name="apiVersion"
              label={t("apiVersion")}
              children={(field) => {
                return (
                  <Input {...field} type="text" />
                  // <Input {...field} name="name" />
                );
              }}
            />

            {/* <FormControl>
              <FormLabel>{t("apiVersion")}</FormLabel>
              <Input
                type="text"
                name="apiVersion"
                defaultValue={credentials?.apiVersion}
              />
            </FormControl> */}

            <Button loading={fetcher.state == "submitting"} type="submit">
              {t("form.save")}
            </Button>
          </fetcher.Form>
        </Form>
      )}
    </div>
  );
}
