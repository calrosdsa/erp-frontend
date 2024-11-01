import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
  useRevalidator,
} from "@remix-run/react";
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
import { useEffect, useRef } from "react";
import { routes } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Button } from "@/components/ui/button";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { action } from "./route";
import { createPurchaseInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { useCreatePurchaseInvoice } from "./use-purchase-invoice";
import {
  ItemLineType,
  PartyType,
  partyTypeFromJSON,
  partyTypeToJSON,
} from "~/gen/common";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useCreateSupplier } from "../home.supplier_/components/create-supplier";
import PartyAutocomplete from "../home.order.$partyOrder.new/components/party-autocomplete";

export default function CreatePurchaseInvoiceClient() {
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

  const createPurchaseInvoice = useCreatePurchaseInvoice();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const toolbar = useToolbar();
  const navigate = useNavigate();
  const r = routes;
  const params = useParams();
  const partyInvoice = params.partyInvoice || "";
  const form = useForm<z.infer<typeof createPurchaseInvoiceSchema>>({
    resolver: zodResolver(createPurchaseInvoiceSchema),
    defaultValues: {
      referenceID: createPurchaseInvoice.payload?.referenceID,
      partyName: createPurchaseInvoice.payload?.party_name || "",
      partyUuid: createPurchaseInvoice.payload?.party_uuid || "",
      partyType: createPurchaseInvoice.payload?.party_type || "",
      currency: {
        code: createPurchaseInvoice.payload?.currency || "",
      },
      currencyName: createPurchaseInvoice.payload?.currency,
      lines: createPurchaseInvoice.payload?.lines || [],
      date: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof createPurchaseInvoiceSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-invoice",
        createPurchaseInvoice: values,
      } as any,
      {
        method: "POST",
        encType: "application/json",
        action: r.toRoute({
          routePrefix: ["invoice"],
          main: partyInvoice,
          routeSufix: [`new`],
        }),
      }
    );
  };

  const setUpToolbar = () => {
    toolbar.setToolbar({
      title: t("f.add-new", { o: t("_invoice.base").toLocaleLowerCase() }),
      onSave: () => {
        inputRef.current?.click();
      },
    });
  };

  useEffect(() => {
    setUpToolbar();
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.invoice) {
          navigate(r.toRoute({
            main:partyInvoice,
            routeSufix:[fetcher.data.invoice.code],
            routePrefix:["invoice"],
            q:{
              tab:"info"
            }
          }));
        }
      },
    },
    [fetcher.data]
  );

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
              <PartyAutocomplete
                party={partyTypeFromJSON(partyInvoice)}
                globalState={globalState}
                form={form}
              />

              <CustomFormDate form={form} name="date" label={t("form.date")} />

              {/* <CustomFormDate
                form={form}
                name="due_date"
                isDatetime={true}
                label={t("form.dueDate")}
              /> */}

              <Typography className=" col-span-full" fontSize={subtitle}>
                {t("form.currencyAndPriceList")}
              </Typography>
              <FormAutocomplete
                data={currencyDebounceFetcher.data?.currencies || []}
                form={form}
                name="currencyName"
                required={true}
                nameK={"code"}
                onValueChange={onCurrencyChange}
                label={t("form.currency")}
                onSelect={(v) => {
                  form.setValue("currency", v);
                  form.trigger("currency");
                }}
              />
            </div>
            <ItemLineForm
              itemLineType={ItemLineType.ITEM_LINE_INVOICE}
              form={form}
              partyType={params.partyInvoice || ""}
            />
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
