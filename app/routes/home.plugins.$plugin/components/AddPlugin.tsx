import { Button, FormControl, FormLabel, Option, Select } from "@mui/joy";
import { Form, useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import DrawerLayout from "~/components/shared/drawer/Drawer";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";




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

  return (
    <fetcher.Form method="post" action={`/home/plugins/${plugin}`} className=" grid gap-y-3">
      <input type="hidden" value="add-plugin" name="action" />  
      <input type="hidden" value={plugin} name="plugin"/>
      <FormControl>
        <FormLabel>{t("form.companyName")}</FormLabel>
        <Select defaultValue={session.companyUuid} name="companyUuid">
          {companies.map((item, idx) => {
            return (
              <Option key={idx} value={item.Uuid}>
                {item.Name}
              </Option>
            );
          })}
        </Select>
      </FormControl>
      <Button loading={fetcher.state =="submitting"}
       type="submit">{t("form.submit")}</Button>
    </fetcher.Form>
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
    <DrawerLayout open={open} close={close} title={t("addSquare")}>
      <AddPlugin session={session} plugin={plugin} 
      companies={companies}
      />
    </DrawerLayout>
  );
};
