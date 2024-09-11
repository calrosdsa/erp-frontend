import CustomForm from "@/components/custom/form/CustomForm";
import { useFetcher, useRevalidator } from "@remix-run/react";
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
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { useItemPriceForOrders } from "~/util/hooks/fetchers/useItemPriceForOrder";
import { useEffect } from "react";
import { DataTable } from "@/components/custom/table/CustomTable";
import { orderLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import Typography, { subtitle } from "@/components/typography/Typography";
import useEditableTable from "~/util/hooks/useEditableTable";
import useEditTable from "~/util/hooks/useEditTable";
import { useAddLineOrder } from "./components/add-line-order";
import ConditionalTooltip from "@/components/custom-ui/conditional-tooltip";

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const revalidator = useRevalidator()

  const form = useForm<z.infer<typeof createPurchaseSchema>>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues:{
      lines:[],
    }
  });
  const addLineOrder = useAddLineOrder()
  const [metaOptions] = useEditTable({
    form:form,
    name:"lines",
    onAddRow:()=>{
      addLineOrder.openDialog({currency:"USD"})
      console.log("ON ADD ROW")
    }
  })
  const onSubmit = (values: z.infer<typeof createPurchaseSchema>) => {
    console.log(values);
  };

  useEffect(()=>{
    if(addLineOrder.orderLine){
      const orderLines = form.getValues().lines
      const n = [...orderLines,addLineOrder.orderLine]
      // console.log("LINES",orderLines,addLineOrder.orderLine)
      form.setValue("lines",n)
      addLineOrder.onOpenChange(false)
      revalidator.revalidate()
    }
  },[addLineOrder.orderLine])
 
  return (
    <div>
      {JSON.stringify(form.getValues().currency)}
      
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
                revalidator.revalidate()
              }}
            />

            <CustomFormDate
            form={form}
            name="delivery_date"
            label={t("form.deliveryDate")}
            />

          </div>
          <div>
            <Typography fontSize={subtitle}>
            {t("items")}
            </Typography>
            <DataTable
            data={form.getValues().lines || []}
            columns={orderLineColumns({})}
            metaOptions={{
              meta:{ 
                ...metaOptions,
                tooltipMessage:t("tooltip.selectCurrency"),
                enableTooltipMessage:form.getValues().currency == undefined,
              }
          }}
            />
          </div>

        </fetcher.Form>
      </Form>
    </div>
  );
}
