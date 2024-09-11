import CustomForm from "@/components/custom/form/CustomForm";
import { useFetcher, useNavigate, useRevalidator } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { createPurchaseSchema } from "~/util/data/schemas/buying/purchase-schema";
import { z } from "zod";
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
import { useEffect } from "react";
import { DataTable } from "@/components/custom/table/CustomTable";
import { orderLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import Typography, { subtitle } from "@/components/typography/Typography";
import useEditableTable from "~/util/hooks/useEditableTable";
import useEditTable from "~/util/hooks/useEditTable";
import { useAddLineOrder } from "./components/add-line-order";
import ConditionalTooltip from "@/components/custom-ui/conditional-tooltip";
import { routes } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Button } from "@/components/ui/button";
import { action } from "./route";
import OrderSumary from "@/components/custom/display/order-sumary";
import { DEFAULT_CURRENCY } from "~/constant";
import { sumTotal } from "~/util/format/formatCurrency";

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const { t,i18n } = useTranslation("common");
  const { toast } = useToast();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const r = routes;
  const form = useForm<z.infer<typeof createPurchaseSchema>>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      lines: [],
    },
  });
  const addLineOrder = useAddLineOrder();
  const [metaOptions] = useEditTable({
    form: form,
    name: "lines",
    onAddRow: () => {
      addLineOrder.openDialog({ currency: "USD" });
      console.log("ON ADD ROW");
    },
  });
  const onSubmit = (values: z.infer<typeof createPurchaseSchema>) => {
    console.log(values);
    fetcher.submit({
      action:"create-purchase-order",
      createPurchaseOrder:values
  } as any,{
      method:"POST",
      encType:"application/json",
      action:r.toPurchaseOrderCreate(),
  })
  };

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      if (fetcher.data?.order) {
        navigate(
          r.toPurchaseOrderDetail(
            fetcher.data.order.name,
            fetcher.data.order.uuid
          )
        );
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (addLineOrder.orderLine) {
      const orderLines = form.getValues().lines;
      const n = [...orderLines, addLineOrder.orderLine];
      // console.log("LINES",orderLines,addLineOrder.orderLine)
      form.setValue("lines", n);
      addLineOrder.clearOrderLine()
      addLineOrder.onOpenChange(false);
      revalidator.revalidate();
    }
  }, [addLineOrder.orderLine]);

  return (
    <div>
      <FormLayout>
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
                  form.setValue("currency", v);
                  revalidator.revalidate();
                }}
              />

              <CustomFormDate
                form={form}
                name="delivery_date"
                label={t("form.deliveryDate")}
              />
            </div>
            <div>
              <Typography fontSize={subtitle}>{t("items")}</Typography>
              <DataTable
                data={form.getValues().lines || []}
                columns={orderLineColumns({
                  currency:addLineOrder.currency
                })}
                metaOptions={{
                  meta: {
                    ...metaOptions,
                    tooltipMessage: t("tooltip.selectCurrency"),
                    enableTooltipMessage:
                      form.getValues().currency == undefined,
                  },
                }}
              />
               {(form.getValues().lines.length > 0) &&
                <OrderSumary
                orderTotal={sumTotal(form.getValues().lines.map(t=>t.amount ? t.amount :0))}
                taxRate={0.10}
                i18n={i18n}
                currency={addLineOrder.currency || DEFAULT_CURRENCY}
                />
              }
            </div>
              <Button className=" max-w-40" loading={fetcher.state == "submitting"} type="submit">
                {t("form.submit")}
              </Button>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
