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
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { makeZodI18nMap } from "zod-i18n-map";
import SelectForm from "../select/SelectForm";
import CheckForm from "../input/CheckForm";
import { MultiSelect } from "../select/MultiSelect";
import { Textarea } from "@/components/ui/textarea";
import FormAutocomplete from "../select/FormAutocomplete";
import { components } from "~/sdk";

interface Props {
  schema: any;
  formItemsData: FormItemData<any, any>[];
  onSubmit: (e: any) => void;
  className?: string;
  defaultValues?: any;
  renderCustomInputs?: (form: any) => ReactNode;
  fetcher: FetcherWithComponents<unknown>;
  buttonClassName?:string
  buttonText?:string
}
export default function CustomForm<T extends FieldValues>({
  formItemsData,
  buttonClassName,
  buttonText,
  schema,
  onSubmit,
  className,
  defaultValues,
  renderCustomInputs,
  fetcher,
}: Props) {
  const form = useForm<T>({
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
        className={cn(className, "gap-y-3 grid p-3")}
      >
        
        {/* <div className=" col-span-full">{JSON.stringify(form.formState.errors)}</div> */}

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
                required={item.required}
                children={(field) => {
                  return <Input {...field} type={item.type} required={item.required || false}/>;
                }}
              />
            );
          }
          if (item.typeForm == "textarea") {
            return (
              <CustomFormField
                key={idx}
                label={item.label}
                name={item.name}
                form={form}
                children={(field) => {
                  return <Textarea {...field} />;
                }}
              />
            );
          }

          if (item.typeForm == "check") {
            return (
              <CheckForm
                key={idx}
                label={item.label}
                name={item.name}
                description={item.description}
                form={form}
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
                onValueChange={(e)=>item.onSelect && item.onSelect(e)}
                name={item.name}
                required={item.required}
                label={item.label}
                form={form}
              />
            );
          }
          if (item.typeForm == "multiselect") {
            return (
              <MultiSelect
                key={idx}
                label={item.label}
                data={item.data || []}
                keyName={item.keyName}
                description={item.description}
                keyValue={item.keyValue}
                name={item.name}
                onSelect={(e) => {
                  if (item.onSelectArray) {
                    item.onSelectArray(e);
                  }
                }}
                form={form}
              />
            );
          }
            // if (item.typeForm == "autocomplete") {
            //   return (
            //     <FormAutocomplete
            //       key={idx}
            //       form={form}
            //       label={item.label}
            //       data={item.data || []}
            //       onOpen={() => {
            //         if (item.onValueChange) {
            //           item.onValueChange("");
            //         }
            //       }}
            //       onValueChange={(e) => {
            //         if(item.onValueChange){
            //           item.onValueChange(e)
            //         }
            //       }}
            //       name={item.name}
            //       nameK={item.keyName}
            //       onSelect={(v) => {
            //         form.setValue(item.name, v);
            //       }}
            //       addNew={item.actions?.addNew}
            //     />
            //   );
            // }
        })}
        {renderCustomInputs != undefined && renderCustomInputs(form)}
        <div className="col-span-full"></div>

        <div className={cn(buttonClassName)}>
        <Button type="submit" className="w-full" loading={fetcher.state== "submitting"}>
         {buttonText ? buttonText:t("form.submit")}
        </Button>
        </div>
      </fetcher.Form>
    </Form>
  );
}
