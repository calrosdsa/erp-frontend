import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { Input } from "@/components/ui/input";
import { useFetcher } from "@remix-run/react";
import { z, ZodRawShape } from "zod";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { FormEvent, ReactNode } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { makeZodI18nMap } from "zod-i18n-map";

interface Props<T extends ZodRawShape> {
  schema: any;
  formItemsData: FormItemData[];
  onSubmit: (e: any) => void;
  fetcherKey: string;
  className?: string;
  defaultValues?: any;
  renderCustomInputs?: (form: any) => ReactNode;
}
export default function CustomForm<T extends ZodRawShape>({
  formItemsData,
  fetcherKey,
  schema,
  onSubmit,
  className,
  defaultValues,
  renderCustomInputs,
}: Props<T>) {
  const fetcher = useFetcher({ key: fetcherKey });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });
  const { t } = useTranslation("common");
  z.setErrorMap(makeZodI18nMap({ t }));
  // form.setValue("","")
  return (
    <Form {...form}>
      <fetcher.Form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "grid gap-y-2 p-3")}
      >
        {formItemsData.map((item, idx) => {
          return (
            item.typeForm == "input" && (
              <CustomFormField
                key={idx}
                label={item.label}
                name={item.name}
                form={form}
                children={(field) => {
                  return (
                    <Input
                      {...field}
                      type={item.type}
                      onChange={(e) => {
                        if (item.type == "number") {
                          field.onChange(Number(e.target.value));
                        }
                        if (item.type == "string") {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  );
                }}
              />
            )
          );
        })}
        
        {renderCustomInputs != undefined && renderCustomInputs(form)}
        <Button type="submit">
          {fetcher.state == "submitting" ? <Icons.spinner /> : t("form.submit")}
        </Button>
      </fetcher.Form>
    </Form>
  );
}
