import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useFetcher } from "@remix-run/react";
import { action } from "../route";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Typography, { sm, subtitle } from "@/components/typography/Typography";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // console.log(form.getValues());
    fetcher.submit(values, {
      method: "POST",
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("_account.siginIYouA")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("_account.siginIYouADesc")}
            </p>
          </div>
      <Form {...form}>
        <fetcher.Form
          id="submit-form"
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.email")}</FormLabel>
                <FormControl>
                  <Input {...field} name="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.password")}</FormLabel>
                <FormControl>
                  <Input {...field} name="password" type="password"/>
                </FormControl>
                {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          {fetcher.data?.error &&
            <Typography fontSize={sm} textColor="red">{fetcher.data?.error?.detail}</Typography>
          }
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div> */}
          <div className=" flex justify-end">
            <Link to={"/reset-password"}>
          <Typography fontSize={sm} className=" underline">
            {t("_account.forgotPassword")}
          </Typography>
            </Link>
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={fetcher.state == "submitting"}
          >
            {fetcher.state == "submitting" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            Iniciar sesión
          </Button>
        </fetcher.Form>
      </Form>
    </div>
  );
}
