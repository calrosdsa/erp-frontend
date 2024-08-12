import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  const form = useForm();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    // console.log(e.currentTarget)
    fetcher.submit(formData, {
      method: "post",
      action: "/api",
    });
    window.location.reload();
  };

  return (
    <fetcher.Form
      method={"post"}
      action={"/api"}
      className="grid gap-y-3"
      // onSubmit={onSubmit}
    >
      <input type="hidden" name="action" value={"update-session-defaults"} />
      <Form {...form}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.companyName")}</FormLabel>
              <FormControl>
                <Select {...field} defaultValue={session.companyUuid} name="companyUuid">
                  <SelectTrigger >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {companies.map((item, idx) => {
                      return (
                        <SelectItem value={item.Uuid} key={idx}>
                          {item.Name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.companyName")}</FormLabel>
              <FormControl>
                <Select {...field} defaultValue={session.locale} name="locale">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        {/* <FormControl>
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
              </FormControl> */}

        {/* <FormControl>
        <FormLabel>{t("language")}</FormLabel>
        <Select defaultValue={session.locale} name="locale">
        <Option value="en">English</Option>
        <Option value="es">Español</Option>
        </Select>
        </FormControl> */}

        <Button type="submit">{t("form.submit")}</Button>
      </Form>
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
