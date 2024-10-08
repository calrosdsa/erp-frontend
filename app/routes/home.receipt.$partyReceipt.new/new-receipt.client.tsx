import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { action } from "./route";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { createReceiptSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import { ItemLineType, PartyType } from "~/gen/common";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useSupplierDebounceFetcher } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { useCreateSupplier } from "../home.buying.suppliers_/components/create-supplier";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import Typography, { subtitle } from "@/components/typography/Typography";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";

export default function NewReceiptClient() {
  const fetcher = useFetcher<typeof action>();
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const globalState = useOutletContext<GlobalState>();
  const [supplierPermission] = usePermission({
    actions: supplierDebounceFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const createSupplier = useCreateSupplier();

  const r = routes;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const form = useForm<z.infer<typeof createReceiptSchema>>({
    resolver: zodResolver(createReceiptSchema),
    defaultValues:{
        lines:[],
    }
  });
  const revalidator = useRevalidator();
  const params = useParams();
  const { partyReceipt } = params;
  const onSubmit = (values: z.infer<typeof createReceiptSchema>) => {
    fetcher.submit(
      {
        action: "create-receipt",
        createReceipt: values as any,
      },
      {
        method: "POST",
        encType: "application/json",
        action: r.toCreateReceipt(partyReceipt),
      }
    );
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
    }
  }, [fetcher.data]);
  return (
    <div>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="create-grid">
              {partyReceipt == PartyType[PartyType.purchaseReceipt] && (
                <FormAutocomplete
                  data={supplierDebounceFetcher.data?.suppliers || []}
                  form={form}
                  name="partyName"
                  nameK={"name"}
                  onValueChange={onSupplierChange}
                  label={t("_supplier.base")}
                  onSelect={(v) => {
                    form.setValue("partyUuid", v.uuid);
                  }}
                  {...(supplierPermission?.create && {
                    addNew: () => {
                      createSupplier.openDialog({});
                    },
                  })}
                />
              )}
              

              <CustomFormDate form={form} name="postingDate" label={t("form.postingDate")} />

              <Typography className=" col-span-full" fontSize={subtitle}>
                {t("form.currencyAndPriceList")}
              </Typography>
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
             

              <div className=" col-span-full">
              <ItemLineForm 
                form={form}
                configuteWarehouse={true}
                itemLineType={ItemLineType.ITEM_LINE_RECEIPT}
                />
                </div>
            </div>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
