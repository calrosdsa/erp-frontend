import { FormControl, FormLabel, Select, Option, Button } from "@mui/joy";
import { Form, useFetcher, useRevalidator } from "@remix-run/react";
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import DrawerLayout from "~/components/shared/drawer/Drawer";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";

export const SessionDefault = ({
  session,
  companies,
  close,
}: {
  session: SessionData;
  companies: components["schemas"]["Company"][];
  close: () => void;
}) => {
  const { t } = useTranslation();
  const fetcher = useFetcher(); 
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    // console.log(e.currentTarget)
    fetcher.submit(formData,{
      method:"post",
      action:"/api"
    });
    window.location.reload()
  };
  return (
    <fetcher.Form
      method={"post"}
      action={"/api"}
      className="grid gap-y-3"
      // onSubmit={onSubmit}
    >
      <input type="hidden" name="action" value={"update-session-defaults"} />
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

      <FormControl>
        <FormLabel>{t("language")}</FormLabel>
        <Select defaultValue={session.locale} name="locale">
          <Option value="en">English</Option>
          <Option value="es">Español</Option>
        </Select>
      </FormControl>

      <Button type="submit">{t("form.submit")}</Button>
    </fetcher.Form>
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
  const { t } = useTranslation();
  return (
    <DrawerLayout
      open={open}
      close={close}
      title={t("sidebar.sessionDefaults")}
    >
      <SessionDefault session={session} companies={companies} close={close} />
    </DrawerLayout>
  );
};
