import { useFetcher, useNavigate, useOutletContext, useRevalidator } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useSupplierDebounceFetcher } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { useEffect } from "react";
import { routes } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Button } from "@/components/ui/button";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCreateSupplier } from "../home.buying.suppliers_/components/create-supplier";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { action } from "./route";
import { createPurchaseInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { useCreatePurchaseInvoice } from "./use-purchase-invoice";

export default function CreatePurchaseInvoiceClient() {
  const fetcher = useFetcher<typeof action>()
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const globalState = useOutletContext<GlobalState>()
  const [supplierPermission] = usePermission({
    actions:supplierDebounceFetcher.data?.actions,
    roleActions:globalState.roleActions,
  })
  const createSupplier = useCreateSupplier()

  const createPurchaseInvoice = useCreatePurchaseInvoice()

  const { t,i18n } = useTranslation("common");
  const { toast } = useToast();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const r = routes;
  const form = useForm<z.infer<typeof createPurchaseInvoiceSchema>>({
    resolver: zodResolver(createPurchaseInvoiceSchema),
    defaultValues: {
      supplierName:createPurchaseInvoice.payload?.party_name || "",
      supplier:{
        name:createPurchaseInvoice.payload?.party_name || "",
        uuid:createPurchaseInvoice.payload?.party_uuid || "",
      },
      currency:{
        code:createPurchaseInvoice.payload?.currency || "",
      },
      currencyName:createPurchaseInvoice.payload?.currency,
      lines:createPurchaseInvoice.payload?.lines || [],
      date:new Date(),
    },
  });
  
  const onSubmit = (values: z.infer<typeof createPurchaseInvoiceSchema>) => {
    console.log(values);
    fetcher.submit({
      action:"create-purchase-invoice",
      createPurchaseInvoice:values
  } as any,{
      method:"POST",
      encType:"application/json",
      action:r.toPurchaseInvoiceCreate(),
  })
  };

  useEffect(()=>{
    form.setValue("supplierName",createPurchaseInvoice.payload?.party_name || "")
    revalidator.revalidate()
    console.log("REVALIDATIONS...")
  },[createPurchaseInvoice])

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
      if (fetcher.data?.invoice) {
        navigate(
          r.toPurchaseInvoiceDetail(
            fetcher.data.invoice.code,
            fetcher.data.invoice.uuid,
          )
        );
      }
    }
  }, [fetcher.data]);



  return (
    <div>
      {JSON.stringify(form.formState.errors)}
      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("", "gap-y-3 grid p-3")}
          >
            <div className="create-grid">
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
                {...(supplierPermission?.create && {
                  addNew:()=>{
                    createSupplier.openDialog({})
                  }
                })}
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
                name="date"
                label={t("form.date")}
              />

              <CustomFormDate
                form={form}
                name="due_date"
                isDatetime={true}
                label={t("form.dueDate")}
              />

            </div>
         <ItemLineForm
         form={form}
         />
              <Button className=" max-w-40" loading={fetcher.state == "submitting"} type="submit">
                {t("form.submit")}
              </Button>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
