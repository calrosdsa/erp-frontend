import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { GlobalState } from "~/types/app";
import { createSalesRecord } from "~/util/data/schemas/invoicing/sales-record-schema";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomerAutoCompleteForm } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { useNewSalesRecord } from "./use-new-sales-record";
import { Separator } from "@/components/ui/separator";
import { InvoiceAutocompleteForm } from "~/util/hooks/fetchers/docs/useInvoiceDebounceFetcher";

export default function NewSalesRecord() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = routes;
  const { roleActions } = useOutletContext<GlobalState>();
  const {payload} = useNewSalesRecord()
  // Default values for the form
  

  const form = useForm<z.infer<typeof createSalesRecord>>({
    resolver: zodResolver(createSalesRecord),
    defaultValues:{
    customerID:payload?.partyID,
    customer:payload?.party,
    invoiceID:payload?.invoiceID,
    invoiceCode:payload?.invoiceCode,
    invoiceDate:new Date(),
    supplement: "",
    iceAmount: 0,
    iehdAmount: 0,
    ipjAmount: 0,
    taxRates: 0,
    otherNotSubjectToVat: 0,
    exportsAndExemptOperations: 0,
    zeroRateTaxableSales: 0,
    subtotal: 0,
    discountsBonusAndRebatesSubjectToVat: 0,
    giftCardAmount: 0,
    baseAmountForTaxDebit: 0,
    taxDebit: 0,
    state: "",
    controlCode: "",
    saleType: "",
    withTaxCreditRight: true,
    consolidationStatus: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createSalesRecord>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-sales-record",
        createSalesRecord: values,
      } as any,
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", {
        o: t("salesRecord"),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.salesRecord) {
          navigate(
            r.toRoute({
              main: r.salesRecord,
              routePrefix:[r.invoicing],
              routeSufix: [fetcher.data.salesRecord.invoice_no],
              q: {
                tab: "info",
                id:fetcher.data.salesRecord.uuid,
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  return (
    <div>
      <Card>
        <FormLayout>
          <Form {...form}>
            <fetcher.Form
              method="post"
              onSubmit={form.handleSubmit(onSubmit)}
              className={"gap-y-3 grid p-3"}
            >
              <div className="create-grid">

                <InvoiceAutocompleteForm
                label={t("saleInvoice")}
                partyType={r.saleInvoice}
                control={form.control}
                onSelect={(e)=>{
                  form.setValue("invoiceID",e.id)
                }}
                />
              <CustomerAutoCompleteForm
              label={t("customer")}
              control={form.control}
              roleActions={roleActions}
              onSelect={(e)=>{
                form.setValue("customerID",e.id)
                form.setValue("nameOrBusinessName",e.name)
              }}
              />

              <Separator className=" col-span-full"/>
                
              <CustomFormDate
                  control={form.control}
                  name="invoiceDate"
                  label={"FECHA DE LA FACTURA"}
                  required={true}
                />
                {/* Invoice No */}
                <CustomFormFieldInput
                  label={"Nº DE LA FACTURA"} // Spanish translation
                  control={form.control}
                  name="invoiceNo"
                  inputType="input"
                  required
                />

                {/* Authorization Code */}
                <CustomFormFieldInput
                  label={"CODIGO DE AUTORIZACIÓN"} // Spanish translation
                  control={form.control}
                  name="authorizationCode"
                  inputType="input"
                  required
                />

                {/* Customer Nit/Ci */}
                <CustomFormFieldInput
                  label={"NIT / CI CLIENTE"} // Spanish translation
                  control={form.control}
                  name="customerNitCi"
                  inputType="input"
                  required
                />

                {/* Supplement */}
                <CustomFormFieldInput
                  label={"COMPLEMENTO"} // Spanish translation
                  control={form.control}
                  name="supplement"
                  inputType="input"
                />

                {/* Name or Business Name */}
                <CustomFormFieldInput
                  label={"NOMBRE O RAZON SOCIAL"} // Spanish translation
                  control={form.control}
                  name="nameOrBusinessName"
                  inputType="input"
                  required
                />

                {/* Total Sale Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE TOTAL DE LA VENTA"} // Spanish translation
                  control={form.control}
                  name="totalSaleAmount"
                  inputType="input"
                  required
                />

                {/* Ice Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE ICE"} // Spanish translation
                  control={form.control}
                  name="iceAmount"
                  inputType="input"
                  required
                />

                {/* Iehd Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE IEHD"} // Spanish translation
                  control={form.control}
                  name="iehdAmount"
                  inputType="input"
                  required
                />

                {/* Ipj Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE IPJ"} // Spanish translation
                  control={form.control}
                  name="ipjAmount"
                  inputType="input"
                  required
                />

                {/* Tax Rates */}
                <CustomFormFieldInput
                  label={"TASAS"} // Spanish translation
                  control={form.control}
                  name="taxRates"
                  inputType="input"
                  required
                />

                {/* Other Not Subject to VAT */}
                <CustomFormFieldInput
                  label={"OTROS NO SUJETOS AL IVA"} // Spanish translation
                  control={form.control}
                  name="otherNotSubjectToVat"
                  inputType="input"
                />

                {/* Exports and Exempt Operations */}
                <CustomFormFieldInput
                  label={"EXPORTACIONES Y OPERACIONES EXENTAS"} // Spanish translation
                  control={form.control}
                  name="exportsAndExemptOperations"
                  inputType="input"
                />

                {/* Zero Rate Taxable Sales */}
                <CustomFormFieldInput
                  label={"VENTAS GRAVADAS A TASA CERO"} // Spanish translation
                  control={form.control}
                  name="zeroRateTaxableSales"
                  inputType="input"
                />

                {/* Subtotal */}
                <CustomFormFieldInput
                  label={"SUBTOTAL"} // Spanish translation
                  control={form.control}
                  name="subtotal"
                  inputType="input"
                  required
                />

                {/* Discounts, Bonus, and Rebates Subject to VAT */}
                <CustomFormFieldInput
                  label={"DESCUENTOS BONIFICACIONES Y REBAJAS SUJETAS AL IVA"} // Spanish translation
                  control={form.control}
                  name="discountsBonusAndRebatesSubjectToVat"
                  inputType="input"
                />

                {/* Gift Card Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE GIFT CARD"} // Spanish translation
                  control={form.control}
                  name="giftCardAmount"
                  inputType="input"
                />

                {/* Base Amount for Tax Debit */}
                <CustomFormFieldInput
                  label={"IMPORTE BASE PARA DEBITO FISCAL"} // Spanish translation
                  control={form.control}
                  name="baseAmountForTaxDebit"
                  inputType="input"
                  required
                />

                {/* Tax Debit */}
                <CustomFormFieldInput
                  label={"DEBITO FISCAL"} // Spanish translation
                  control={form.control}
                  name="taxDebit"
                  inputType="input"
                  required
                />

                {/* State */}
                <CustomFormFieldInput
                  label={"ESTADO"} // Spanish translation
                  control={form.control}
                  name="state"
                  inputType="input"
                  required
                />

                {/* Control Code */}
                <CustomFormFieldInput
                  label={"CODIGO DE CONTROL"} // Spanish translation
                  control={form.control}
                  name="controlCode"
                  inputType="input"
                  required
                />

                {/* Sale Type */}
                <CustomFormFieldInput
                  label={"TIPO DE VENTA"} // Spanish translation
                  control={form.control}
                  name="saleType"
                  inputType="input"
                  required
                />

                {/* With Tax Credit Right */}
                <CustomFormFieldInput
                  label={"CON DERECHO A CREDITO FISCAL"} // Spanish translation
                  control={form.control}
                  name="withTaxCreditRight"
                  inputType="check"
                  required
                />

                {/* Consolidation Status */}
                <CustomFormFieldInput
                  label={"ESTADO CONSOLIDACION"} // Spanish translation
                  control={form.control}
                  name="consolidationStatus"
                  inputType="input"
                  required
                />

                {/* Customer ID
                <CustomFormFieldInput
                  label={t("customerID")} // Spanish translation
                  control={form.control}
                  name="customerID"
                  inputType="input"
                /> */}

                <input ref={inputRef} type="submit" className="hidden" />
              </div>
            </fetcher.Form>
          </Form>
        </FormLayout>
      </Card>
    </div>
  );
}
