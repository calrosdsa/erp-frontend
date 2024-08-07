import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { action } from "../route";
import { useFetcher } from "@remix-run/react";
import Typography, { sm, title } from "@/components/typography/Typography";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FormCuatropf() {
  const fetcher = useFetcher<typeof action>();
  let { t, i18n } = useTranslation();
  const formSchema = z.object({
    givenName: z.string().min(5),
    familyName: z.string().min(5),
    companyName: z.string().min(5),
    email: z.string().email(),
    country: z.string(),
    phoneNumber: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      givenName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="h-full">
      <div  className="space-y-8 max-w-xl mx-auto pt-20">
        <div className="flex flex-col">
          <Typography fontSize={title}>{t("form.clientDetails")}</Typography>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.familyName")}</FormLabel>
                    <FormControl>
                      <Input {...field} name="familyName" />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="givenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.givenName")}</FormLabel>
                    <FormControl>
                      <Input {...field} name="givenName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.companyName")}</FormLabel>
                    <FormControl>
                      <Input {...field} name="companyName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.country")}</FormLabel>
                    <FormControl>
                      <Input {...field} name="country" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} name="phoneNumber" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 
              <div>
                <FormControl>
                  <FormLabel>{t("form.familyName")}</FormLabel>
                  <Input name="familyName" />
                </FormControl>
              </div>

              <div>
                <FormControl>
                  <FormLabel>{t("form.companyName")}</FormLabel>
                  <Input name="companyName" />
                </FormControl>
              </div>

              <div>
                <FormControl>
                  <FormLabel>{t("form.email")}</FormLabel>
                  <Input type="email" name="email" />
                </FormControl>
              </div>

              <div>
                <FormControl>
                  <FormLabel>{t("form.country")}</FormLabel>
                </FormControl>
              </div>

              <div>
                <FormControl>
                  <FormLabel>{t("form.phoneNumber")}</FormLabel>
                </FormControl>
              </div> */}
            </div>

            {fetcher.data != undefined && fetcher.data.error != undefined && (
              <Typography
                fontSize={sm}
                textAlign="start"
                textColor={"danger.400"}
              >
                {fetcher.data.error.detail}
              </Typography>
            )}

            <div>
              {/* <Button
                type="submit"
                fullWidth
                loading={fetcher.state == "submitting"}
              >
                Continuar
              </Button> */}

              <div id="card-container" className="h-32"></div>
              <Button id="card-button" type="submit" variant={"default"} className="w-full">
                Pay $1.00
              </Button>
              <div id="payment-status-container"></div>
            </div>
          </form>
        </Form>
        {/* </fetcher.Form> */}
      </div>
    </div>
  );
}
