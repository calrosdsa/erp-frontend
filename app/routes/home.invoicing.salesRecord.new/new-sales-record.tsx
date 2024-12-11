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

export default function NewSalesRecord() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = routes;
  const { companyDefaults } = useOutletContext<GlobalState>();
  
  // Default values for the form
  

  const form = useForm<z.infer<typeof createSalesRecord>>({
    resolver: zodResolver(createSalesRecord),
    defaultValues:{
    invoiceNo: "",
    authorizationCode: "",
    customerNitCi: "",
    supplement: "",
    nameOrBusinessName: "",
    totalSaleAmount: 0,
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
    withTaxCreditRight: false,
    consolidationStatus: "",
    customerID: 0,
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
              routeSufix: [fetcher.data.salesRecord.invoice_no],
              q: {
                tab: "info",
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
                {/* Invoice No */}
                <CustomFormFieldInput
                  label={t("invoiceNo")} // Spanish translation
                  control={form.control}
                  name="invoiceNo"
                  inputType="input"
                  required
                />

                {/* Authorization Code */}
                <CustomFormFieldInput
                  label={t("authorizationCode")} // Spanish translation
                  control={form.control}
                  name="authorizationCode"
                  inputType="input"
                  required
                />

                {/* Customer Nit/Ci */}
                <CustomFormFieldInput
                  label={t("customerNitCi")} // Spanish translation
                  control={form.control}
                  name="customerNitCi"
                  inputType="input"
                  required
                />

                {/* Supplement */}
                <CustomFormFieldInput
                  label={t("supplement")} // Spanish translation
                  control={form.control}
                  name="supplement"
                  inputType="input"
                />

                {/* Name or Business Name */}
                <CustomFormFieldInput
                  label={t("nameOrBusinessName")} // Spanish translation
                  control={form.control}
                  name="nameOrBusinessName"
                  inputType="input"
                  required
                />

                {/* Total Sale Amount */}
                <CustomFormFieldInput
                  label={t("totalSaleAmount")} // Spanish translation
                  control={form.control}
                  name="totalSaleAmount"
                  inputType="input"
                  required
                />

                {/* Ice Amount */}
                <CustomFormFieldInput
                  label={t("iceAmount")} // Spanish translation
                  control={form.control}
                  name="iceAmount"
                  inputType="input"
                  required
                />

                {/* Iehd Amount */}
                <CustomFormFieldInput
                  label={t("iehdAmount")} // Spanish translation
                  control={form.control}
                  name="iehdAmount"
                  inputType="input"
                  required
                />

                {/* Ipj Amount */}
                <CustomFormFieldInput
                  label={t("ipjAmount")} // Spanish translation
                  control={form.control}
                  name="ipjAmount"
                  inputType="input"
                  required
                />

                {/* Tax Rates */}
                <CustomFormFieldInput
                  label={t("taxRates")} // Spanish translation
                  control={form.control}
                  name="taxRates"
                  inputType="input"
                  required
                />

                {/* Other Not Subject to VAT */}
                <CustomFormFieldInput
                  label={t("otherNotSubjectToVat")} // Spanish translation
                  control={form.control}
                  name="otherNotSubjectToVat"
                  inputType="input"
                />

                {/* Exports and Exempt Operations */}
                <CustomFormFieldInput
                  label={t("exportsAndExemptOperations")} // Spanish translation
                  control={form.control}
                  name="exportsAndExemptOperations"
                  inputType="input"
                />

                {/* Zero Rate Taxable Sales */}
                <CustomFormFieldInput
                  label={t("zeroRateTaxableSales")} // Spanish translation
                  control={form.control}
                  name="zeroRateTaxableSales"
                  inputType="input"
                />

                {/* Subtotal */}
                <CustomFormFieldInput
                  label={t("subtotal")} // Spanish translation
                  control={form.control}
                  name="subtotal"
                  inputType="input"
                  required
                />

                {/* Discounts, Bonus, and Rebates Subject to VAT */}
                <CustomFormFieldInput
                  label={t("discountsBonusAndRebatesSubjectToVat")} // Spanish translation
                  control={form.control}
                  name="discountsBonusAndRebatesSubjectToVat"
                  inputType="input"
                />

                {/* Gift Card Amount */}
                <CustomFormFieldInput
                  label={t("giftCardAmount")} // Spanish translation
                  control={form.control}
                  name="giftCardAmount"
                  inputType="input"
                />

                {/* Base Amount for Tax Debit */}
                <CustomFormFieldInput
                  label={t("baseAmountForTaxDebit")} // Spanish translation
                  control={form.control}
                  name="baseAmountForTaxDebit"
                  inputType="input"
                  required
                />

                {/* Tax Debit */}
                <CustomFormFieldInput
                  label={t("taxDebit")} // Spanish translation
                  control={form.control}
                  name="taxDebit"
                  inputType="input"
                  required
                />

                {/* State */}
                <CustomFormFieldInput
                  label={t("state")} // Spanish translation
                  control={form.control}
                  name="state"
                  inputType="input"
                  required
                />

                {/* Control Code */}
                <CustomFormFieldInput
                  label={t("controlCode")} // Spanish translation
                  control={form.control}
                  name="controlCode"
                  inputType="input"
                  required
                />

                {/* Sale Type */}
                <CustomFormFieldInput
                  label={t("saleType")} // Spanish translation
                  control={form.control}
                  name="saleType"
                  inputType="input"
                  required
                />

                {/* With Tax Credit Right */}
                <CustomFormFieldInput
                  label={t("withTaxCreditRight")} // Spanish translation
                  control={form.control}
                  name="withTaxCreditRight"
                  inputType="check"
                />

                {/* Consolidation Status */}
                <CustomFormFieldInput
                  label={t("consolidationStatus")} // Spanish translation
                  control={form.control}
                  name="consolidationStatus"
                  inputType="input"
                  required
                />

                {/* Customer ID */}
                <CustomFormFieldInput
                  label={t("customerID")} // Spanish translation
                  control={form.control}
                  name="customerID"
                  inputType="input"
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
