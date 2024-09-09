import CustomForm from "@/components/custom/form/CustomForm";
import {  useFetcher } from "@remix-run/react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { createPurchaseSchema } from "~/util/data/schemas/buying/purchase-schema";
import { z } from "zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createPurchaseSchema>>({
    resolver: zodResolver(createPurchaseSchema),
  });
  const onSubmit = (values:z.infer<typeof createPurchaseSchema>) =>{
    console.log(values)
  }
  return (
    <div>
       <Form {...form}>

      <fetcher.Form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("", "gap-y-3 grid p-3")}
        >
            <div className="create-grid">
            <CustomFormField
                label={t("form.name")}
                name={"name"}
                form={form}
                children={(field) => {
                  return <Input {...field} />;
                }}
              />

              
            </div>

        </fetcher.Form>
        </Form>
    </div>
  );
}
