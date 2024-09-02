import CustomFormField from "@/components/custom/form/CustomFormField";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { action } from "./route";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemAttributeValuesDtoColumns } from "@/components/custom/table/columns/stock/item-attribute-columns";
import { components } from "index";
import useEditableTable from "~/util/hooks/useEditableTable";

export const valuesSchema = z.object({
  ordinal: z.number(),
  value: z.string(),
  abbreviation: z.string(),
});

export const createItemAttributeSchema = z.object({
  name: z.string(),
  values: z.array(valuesSchema),
});
export default function CreateItemAttributeClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const form = useForm<z.infer<typeof createItemAttributeSchema>>({
    resolver: zodResolver(createItemAttributeSchema),
    defaultValues: {
      values: [],
    },
  });
  const [metaOptions] = useEditableTable({form})
  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof createItemAttributeSchema>) {
    console.log(values);
    fetcher.submit(
      {
        createItemData: values,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  }

 

  useEffect(() => {
    if (fetcher.data?.errorAction != undefined) {
      toast({
        title: fetcher.data.errorAction,
      });
    }
    // if (fetcher.data?.successMessage != undefined) {
    //   toast({
    //     title: fetcher.data.successMessage,
    //   });
    // }
  }, [fetcher.data]);
  return (
    <div>
      <Form {...form}>
        <fetcher.Form
          className="create-grid"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            form={form}
            name="name"
            label={t("form.name")}
            children={(field) => {
              return <Input {...field} />;
            }}
          />

        <div className=" col-span-full">
          <DataTable
          columns={itemAttributeValuesDtoColumns()}
          data={form.getValues().values}
          metaOptions={{
            meta:metaOptions
        }}
          />
        </div>
          {/* 
          <CustomFormField
            form={form}
            name="code"
            label={t("form.code")}
            children={(field) => {
              return <Input {...field}/>;
            }}
          />

          <CustomFormField
            form={form}
            name="abbreviation"
            label={t("form.abbreviation")}
            children={(field) => {
              return <Input {...field} />;
            }}
          /> */}
          <div className=" col-span-full">
            <Button disabled={fetcher.state == "submitting"} type="submit">
              {fetcher.state == "submitting" ? (
                <Icons.spinner />
              ) : (
                t("form.submit")
              )}
            </Button>
          </div>
        </fetcher.Form>
      </Form>
    </div>
  );
}
