import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { Input } from "@/components/ui/input";
import { FetcherWithComponents, useFetcher } from "@remix-run/react";
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
import SelectForm from "../select/SelectForm";
import CheckForm from "../input/CheckForm";

interface Props<T extends object, K extends keyof T> {
  schema: any;
  formItemsData: FormItemData<T, K>[];
  onSubmit: (e: any) => void;
  className?: string;
  defaultValues?: any;
  renderCustomInputs?: (form: any) => ReactNode;
  fetcher: FetcherWithComponents<unknown>;
}
export default function CustomForm<T extends object, K extends keyof T>({
  formItemsData,
  schema,
  onSubmit,
  className,
  defaultValues,
  renderCustomInputs,
  fetcher,
}: Props<T, K>) {
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
        className={cn(className, "gap-y-3 grid p-3 ")}
      >
        {/* <div className=" col-span-full">{JSON.stringify(form.getValues())}</div> */}
        {/* <div className=" col-span-full">{JSON.stringify(form.formState.errors)}</div>
        <div className=" col-span-full">{JSON.stringify(form.getFieldState("outOfStockThreshold").error)}</div>
        <div className=" col-span-full">{JSON.stringify(form.getFieldState("itemId").error)}</div>
        <div className=" col-span-full">{JSON.stringify(form.getFieldState("warehouseName").error)}</div>
        <div className=" col-span-full">{JSON.stringify(form.getFieldState("enabled").error)}</div>
        <div className=" col-span-full">{JSON.stringify(form.getFieldState("stock").error)}</div>
        <div className=" col-span-full">{JSON.stringify(form.getFieldState("warehouseId").error)}</div> */}




        {formItemsData.map((item, idx) => {
          if (item.typeForm == "input") {
            return (
              <CustomFormField
                key={idx}
                label={item.label}
                name={item.name}
                form={form}
                children={(field) => {
                  return <Input {...field} type={item.type} />;
                }}
              />
            );
          }

          if (item.typeForm == "select") {
            return (
              <SelectForm
                key={idx}
                data={item.data || []}
                keyName={item.keyName}
                keyValue={item.keyValue}
                name={item.name}
                label={item.label}
                form={form}
              />
            );
          }
          if (item.typeForm == "check") {
            return <CheckForm
            label={item.label}
            name={item.name}
            description={item.description}
            form={form}
            />;
          }
        })}
        {renderCustomInputs != undefined && 
        renderCustomInputs(form)
        }
        <div className="col-span-full"></div>

        <Button type="submit" className=" col-span-full w-full mt-3">
          {fetcher.state == "submitting" ? <Icons.spinner /> : t("form.submit")}
        </Button>
      </fetcher.Form>
    </Form>
  );
}
