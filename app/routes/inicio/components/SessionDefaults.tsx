import FormLayout from "@/components/custom/form/FormLayout";
import SelectForm from "@/components/custom/select/SelectForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useLocation, useRevalidator } from "@remix-run/react";
import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { action } from "~/routes/api/route";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";
import { languages } from "~/util/data/languages-data";
import { route } from "~/util/route";

export const sessionDefaultsFormSchema = z.object({
  sessionUuid: z.string().optional(),
  locale: z.string().optional(),
});

export const SessionDefault = ({
  session,
  onOpenChange,
}: {
  session: SessionData;
  onOpenChange: (e: boolean) => void;
}) => {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const fetcherSessions = useFetcher<typeof action>();
  const location = useLocation();
  const r = route;
  const form = useForm<z.infer<typeof sessionDefaultsFormSchema>>({
    resolver: zodResolver(sessionDefaultsFormSchema),
    defaultValues: {
      sessionUuid: session.sessionUuid,
      locale: session.locale,
    },
  });
  function onSubmit(values: z.infer<typeof sessionDefaultsFormSchema>) {
    fetcher.submit(
      {
        action: "update-session-defaults",
        pathName: location.pathname + location.search + location.hash,
        sessionDefault: values,
      },
      {
        method: "POST",
        action: "/api",
        encType: "application/json",
      }
    );
  }

  const getSessions = () => {
    fetcherSessions.submit(
      {
        action: "get-sessions",
      },
      {
        encType: "application/json",
        method: "post",
        action: r.api,
      }
    );
  };

  useEffect(() => {
    getSessions();
  }, []);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          method="post"
          action="/api"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-y-3"
          // onSubmit={onSubmit}
        >
          {/* {JSON.stringify(fetcher.data?.sessions)} */}
          <FormField
            control={form.control}
            name={"sessionUuid"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("_company.base")}</FormLabel>
                <Select
                  onValueChange={(e) => {
                    //   const object = JSON.parse(e)

                    // const item =  data.find(t =>  t[keyValue] == e)
                    // if (onValueChange != undefined && item) {
                    //   onValueChange(item);
                    // }
                    // console.log(e);
                    field.onChange(e);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fetcherSessions.data?.sessions.map((option, idx) => {
                      return (
                        <SelectItem value={option.uuid} key={idx}>
                          {option.company.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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
    </FormLayout>
  );
};

export const SessionDefaultDrawer = ({
  open,
  onOpenChange,
  session,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  session: SessionData;
}) => {
  const { t } = useTranslation("common");
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t("sidebar.sessionDefaults")}
    >
      <SessionDefault session={session} onOpenChange={onOpenChange} />
    </DrawerLayout>
  );
};

interface SessionDefaultStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}
export const useSessionDefaults = create<SessionDefaultStore>((set) => ({
  open: false,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
