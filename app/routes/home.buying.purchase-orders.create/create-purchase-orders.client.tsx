import CustomForm from "@/components/custom/form/CustomForm";
import { useFetcher } from "@remix-run/react";
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
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { useSupplierDebounceFetcher } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createPurchaseSchema>>({
    resolver: zodResolver(createPurchaseSchema),
  });

  const onSubmit = (values: z.infer<typeof createPurchaseSchema>) => {
    console.log(values);
  };

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

            <FormAutocomplete
              data={supplierDebounceFetcher.data?.suppliers || []}
              form={form}
              name="supplierName"
              nameK={"name"}
              onValueChange={onSupplierChange}
              label={t("_supplier.base")}
              onSelect={(v) => {
                form.setValue("supplier", v);
              }}
            />

            <FormAutocomplete
              data={currencyDebounceFetcher.data?.currencies || []}
              form={form}
              name="currencyName"
              nameK={"code"}
              onValueChange={onCurrencyChange}
              label={t("form.currency")}
              onSelect={(v) => {
                form.setValue("currency", v.code);
              }}
            />
          </div>
        </fetcher.Form>
      </Form>
    </div>
  );
}
