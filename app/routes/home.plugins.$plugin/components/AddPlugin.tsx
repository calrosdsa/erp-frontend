import CustomFormField from "@/components/custom/form/CustomFormField";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";


const formSchema = z.object({
  companyUuid: z.string().email(),
  plugin: z.string(),
  action:z.string()
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
    const { t } = useTranslation()
    const fetcher = useFetcher({key:"add-plugin"})
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        plugin: plugin,
        action: "add-plugin",
        companyUuid:session.companyUuid
      },
    });

  return (
    <Form {...form}>
    <fetcher.Form method="post" action={`/home/plugins/${plugin}`} className=" grid gap-y-3">
    <CustomFormField
    form={form}
    label={t("form.companyName")}
    name="companyUuid"
    children={(field)=>{
      return(
        <div>dasidnaskdmaskmd</div>
      )
    }}
    >

    </CustomFormField>
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
      <Button loading={fetcher.state =="submitting"}
       type="submit">{t("form.submit")}</Button>
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
  const { t } = useTranslation();
  return (
    <DrawerLayout open={open} close={close} title={t("addPlugin")}>
      <AddPlugin session={session} plugin={plugin} 
      companies={companies}
      />
    </DrawerLayout>
  );
};
