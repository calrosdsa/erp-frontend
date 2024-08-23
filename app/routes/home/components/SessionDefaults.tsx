import SelectForm from "@/components/custom/select/SelectForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useLocation, useRevalidator } from "@remix-run/react";
import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";
import { languages } from "~/util/data/languages-data";

export const sessionDefaultsFormSchema = z.object({
  companyUuid: z.string(),
  locale: z.string(),
});

export const SessionDefault = ({
  session,
  companies,
  close,
}: {
  session: SessionData;
  companies: components["schemas"]["Company"][];
  close: () => void;
}) => {
  const { t } = useTranslation("common");
  const fetcher = useFetcher();
  const location = useLocation()
  const form = useForm<z.infer<typeof sessionDefaultsFormSchema>>({
    resolver: zodResolver(sessionDefaultsFormSchema),
    defaultValues:{
      companyUuid:session.companyUuid,
      locale:session.locale
    }
  });
  function onSubmit(values: z.infer<typeof sessionDefaultsFormSchema>){
    console.log(values)
    // console.log(form.getValues())
    fetcher.submit(
      {
        action: "update-session-defaults",
        pathName:location.pathname,
        sessionDefault: values,
      },
      {
        method: "POST",
        action: "/api",
        encType: "application/json",
      }
    );
  };

  return (
    <Form {...form}>
      <fetcher.Form
        method="post"
        action="/api"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-y-3"
        // onSubmit={onSubmit}
      >
        <SelectForm
          name="companyUuid"
          form={form}
          label={t("form.companyName")}
          keyName="Name"
          keyValue="Uuid"
          data={companies}
        />

        <SelectForm
          name="locale"
          form={form}
          label={t("language")}
          keyName="Name"
          keyValue="Code"
          data={languages}
        />
     
        <Button type="submit">{t("form.submit")}</Button>
      </fetcher.Form>
    </Form>
  );
};

export const SessionDefaultDrawer = ({
  open,
  close,
  session,
  companies,
}: {
  open: boolean;
  close: () => void;
  session: SessionData;
  companies: components["schemas"]["Company"][];
}) => {
  const { t } = useTranslation("common");
  return (
    <DrawerLayout
      open={open}
      onOpenChange={(e)=>close()}
      title={t("sidebar.sessionDefaults")}
    >
      <SessionDefault session={session} companies={companies} close={close} />
    </DrawerLayout>
  );
};
