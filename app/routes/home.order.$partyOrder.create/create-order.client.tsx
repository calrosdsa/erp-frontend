import { useFetcher, useNavigate, useOutletContext, useParams, useRevalidator } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { createPurchaseSchema } from "~/util/data/schemas/buying/purchase-schema";
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
import { action } from "./route";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCreateSupplier } from "../home.buying.suppliers_/components/create-supplier";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { ItemLineType } from "~/gen/common";

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
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
  const params = useParams()

  const { t,i18n } = useTranslation("common");
  const { toast } = useToast();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const r = routes;
  const form = useForm<z.infer<typeof createPurchaseSchema>>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      lines: [],
      date:new Date(),
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
            fetcher.data.order.code,
            fetcher.data.order.uuid
          )
        );
      }
    }
  }, [fetcher.data]);



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
                name="delivery_date"
                isDatetime={true}
                label={t("form.deliveryDate")}
              />

            </div>
         <ItemLineForm
         form={form}
         partyType={params.partyOrder || ""}
         itemLineType={ItemLineType.ITEM_LINE_ORDER}
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
