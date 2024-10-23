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
import { useEffect, useRef } from "react";
import { ItemLineType, PartyType, partyTypeFromJSON } from "~/gen/common";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useSupplierDebounceFetcher } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { useCreateSupplier } from "../home.buying.suppliers_/components/create-supplier";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import Typography, { subtitle, title } from "@/components/typography/Typography";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { useCreateReceipt } from "./use-create-receipt";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const r = routes;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const createReceipt = useCreateReceipt();
  const { payload } = createReceipt;
  const form = useForm<z.infer<typeof createReceiptSchema>>({
    resolver: zodResolver(createReceiptSchema),
    defaultValues: {
      partyName: payload?.party_name,
      partyUuid: payload?.party_uuid,
      partyType: payload?.party_type,
      currency: {
        code: payload?.currency,
      },
      currencyName: payload?.currency,
      reference: payload?.reference,
      lines: payload?.lines || [],
    },
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
        action: r.toCreateReceipt(partyTypeFromJSON(partyReceipt)),
      }
    );
  };

  
  setUpToolbar(()=>{
    return{
      title: t("f.add-new", { o: t("_receipt.base").toLocaleLowerCase() }),
      onSave: () => {
        inputRef.current?.click();
      },
    }
  },[])

  useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
    onSuccessMessage:()=>{
      if(fetcher.data?.receipt){
        navigate(r.toReceiptDetail(params.partyReceipt || "n/a",fetcher.data.receipt.code))
      }
    }
  },[fetcher.data])
  return (
    <div>
      <FormLayout>
        <Form {...form}>
          {JSON.stringify(form.formState.errors)}
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

              <CustomFormDate
                form={form}
                name="postingDate"
                label={t("form.postingDate")}
              />

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
                  partyType={partyReceipt || ""}
                />
              </div>
            </div>
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
