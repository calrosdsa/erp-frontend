import CustomFormField from "@/components/custom/form/CustomFormField";
import SelectForm from "@/components/custom/select/SelectForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";

export const addPluginFormSchema = z.object({
  companyUuid: z.string(),
  plugin: z.string(),
});

export const AddPlugin = ({
  plugin,
  session,
  companies,
}: {
  plugin: string;
  session: SessionData;
  companies: components["schemas"]["Company"][];
}) => {
  const { t } = useTranslation();
  const fetcher = useFetcher({ key: "add-plugin" });
  const form = useForm<z.infer<typeof addPluginFormSchema>>({
    resolver: zodResolver(addPluginFormSchema),
    defaultValues: {
      plugin: plugin,
      companyUuid: session.companyUuid,
    },
  });

  function onSubmit(values: z.infer<typeof addPluginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // console.log(form.getValues());
    fetcher.submit({
      addPlugin:values,
      action:"add-plugin",
    }, {
      action: "/home/plugins/${plugin}",
      method: "POST",
      encType:"application/json"
    });
  }


  return (
    <Form {...form}>
      <fetcher.Form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}        
        className="grid gap-y-3"
      >
        <SelectForm
          name="companyUuid"
          form={form}
          label={t("form.companyName")}
          keyName="Name"
          keyValue="Uuid"
          data={companies}
        />

        {/* <FormControl>
        <FormLabel>{t("form.companyName")}</FormLabel>
        <Select defaultValue={session.companyUuid} name="companyUuid">
        <SelectContent>

          {companies.map((item, idx) => {
            return (
              <SelectItem key={idx} value={item.Uuid}>
                {item.Name}
              </SelectItem>
            );
          })}
          </SelectContent>
        </Select>
      </FormControl> */}
        <Button loading={fetcher.state == "submitting"} type="submit">
          {t("form.submit")}
        </Button>
      </fetcher.Form>
    </Form>
  );
};

export const AddPluginDrawer = ({
  open,
  close,
  plugin,
  session,
  companies,
}: {
  open: boolean;
  close: () => void;
  plugin: string;
  session: SessionData;
  companies: components["schemas"]["Company"][];
}) => {
  const { t } = useTranslation("common");
  return (
    <DrawerLayout open={open} onOpenChange={()=>close()} title={t("addPlugin")}>
      <AddPlugin session={session} plugin={plugin} companies={companies} />
    </DrawerLayout>
  );
};
