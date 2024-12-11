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
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { GlobalState } from "~/types/app";
import { createPurchaseRecord } from "~/util/data/schemas/invoicing/purchase-record-schema";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomerAutoCompleteForm } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { SupplierAutoCompleteForm } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";

export default function NewPurchaseRecordClient() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = routes;
  const { roleActions } = useOutletContext<GlobalState>();

  // Default values for the form
  const form = useForm<z.infer<typeof createPurchaseRecord>>({
    resolver: zodResolver(createPurchaseRecord),
    defaultValues: {
      authorization_code: "",
      cf_base_amount: 0,
      consolidation_status: "",
      control_code: "",
      discounts_bonus_rebates_subject_to_vat: 0,
      dui_dim_no: "",
      exempt_amounts: 0,
      gift_card_amount: 0,
      ice_amount: 0,
      iehd_amount: 0,
      ipj_amount: 0,
      other_not_subject_to_tax_credit: 0,
      subtotal: 0,
      tax_credit: 0,
      tax_rates: 0,
      with_tax_credit_right: false,
      zero_rate_taxable_purchases_amount: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof createPurchaseRecord>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-purchase-record",
        createPurchaseRecord: values,
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
        if (fetcher.data?.purchaseRecord) {
          navigate(
            r.toRoute({
              main: r.purchaseRecord,
              routePrefix: [r.invoicing],
              routeSufix: [fetcher.data.purchaseRecord.invoice_no],
              q: {
                tab: "info",
                id: fetcher.data.purchaseRecord.uuid,
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
                <SupplierAutoCompleteForm
                  label={t("supplier")}
                  control={form.control}
                  required={true}
                  roleActions={roleActions}
                  onSelect={(e) => {
                    form.setValue("supplier_id", e.id);
                    form.setValue("supplier_business_name", e.name);
                  }}
                />
                <div className=" col-span-full" />

                <CustomFormFieldInput
                  label={"NIT Proveedor"}
                  control={form.control}
                  name="supplier_nit"
                  inputType="input"
                  required
                />

                {/* Authorization Code */}
                <CustomFormFieldInput
                  label={"CÓDIGO DE AUTORIZACIÓN"}
                  control={form.control}
                  name="authorization_code"
                  inputType="input"
                  required
                />
                {/* Invoice No */}
                <CustomFormFieldInput
                  label={"Nº DE LA FACTURA"} // Spanish translation
                  control={form.control}
                  name="invoice_no"
                  inputType="input"
                  required
                />

                {/* dui_dim_no */}
                <CustomFormFieldInput
                  label={"Número de DUI/DIM"}
                  control={form.control}
                  name="dui_dim_no"
                  inputType="input"
                  required
                />

                <CustomFormDate
                  control={form.control}
                  name="invoice_dui_dim_date"
                  label={"FECHA DE LA FACTURA DUI/DIM"}
                  required={true}
                />

                {/* Total Purchase Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE TOTAL DE LA COMPRA"}
                  control={form.control}
                  name="total_purchase_amount"
                  inputType="input"
                  required
                />

                {/* ICE Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE ICE"}
                  control={form.control}
                  name="ice_amount"
                  inputType="input"
                  required
                />

                {/* IEHD Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE IEHD"}
                  control={form.control}
                  name="iehd_amount"
                  inputType="input"
                  required
                />

                {/* IPJ Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE IPJ"}
                  control={form.control}
                  name="ipj_amount"
                  inputType="input"
                  required
                />
                {/* Tax Rates */}
                <CustomFormFieldInput
                  label={"Tasas"}
                  control={form.control}
                  name="tax_rates"
                  inputType="input"
                  required
                />

                {/* Other Not Subject to Tax Credit */}
                <CustomFormFieldInput
                  label={"OTRO NO SUJETO A CRÉDITO FISCAL"}
                  control={form.control}
                  name="other_not_subject_to_tax_credit"
                  inputType="input"
                  required
                />
                {/* Exempt Amounts */}
                <CustomFormFieldInput
                  label={"IMPORTE EXENTO"}
                  control={form.control}
                  name="exempt_amounts"
                  inputType="input"
                  required
                />

                {/* Zero Rate Taxable Purchases Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE DE COMPRAS SUJETAS A TASA CERO"}
                  control={form.control}
                  name="zero_rate_taxable_purchases_amount"
                  inputType="input"
                  required
                />

                {/* Subtotal */}
                <CustomFormFieldInput
                  label={"SUBTOTAL"}
                  control={form.control}
                  name="subtotal"
                  inputType="input"
                  required
                />

                {/* Discounts, Bonus, Rebates Subject to VAT */}
                <CustomFormFieldInput
                  label={"DESCUENTOS, BONOS, REEMBOLSOS SUJETOS A IVA"}
                  control={form.control}
                  name="discounts_bonus_rebates_subject_to_vat"
                  inputType="input"
                  required
                />
                {/* Gift Card Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE GIFT CARD"}
                  control={form.control}
                  name="gift_card_amount"
                  inputType="input"
                  required
                />
                <CustomFormFieldInput
                  label={"IMPORTE BASE CRÉDITO FISCAL"}
                  control={form.control}
                  name="cf_base_amount"
                  inputType="input"
                  required
                />
                {/* Tax Credit */}
                <CustomFormFieldInput
                  label={"CRÉDITO FISCAL"}
                  control={form.control}
                  name="tax_credit"
                  inputType="input"
                  required
                />
                {/* Purchase Type */}
                <CustomFormFieldInput
                  label={"TIPO DE COMPRA"}
                  control={form.control}
                  name="purchase_type"
                  inputType="input"
                  required
                />
                {/* Control Code */}
                <CustomFormFieldInput
                  label={"CÓDIGO DE CONTROL"}
                  control={form.control}
                  name="control_code"
                  inputType="input"
                  required
                />

                {/* Consolidation Status */}
                <CustomFormFieldInput
                  label={"ESTADO DE CONSOLIDACIÓN"}
                  control={form.control}
                  name="consolidation_status"
                  inputType="input"
                  required
                />

                {/* With Tax Credit Right */}
                <CustomFormFieldInput
                  label={"CON DERECHO A CRÉDITO FISCAL"}
                  control={form.control}
                  name="with_tax_credit_right"
                  inputType="check"
                  required
                />

                <input ref={inputRef} type="submit" className="hidden" />
              </div>
            </fetcher.Form>
          </Form>
        </FormLayout>
      </Card>
    </div>
  );
}
