import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app";
import { useRef } from "react";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { z } from "zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { usePermission } from "~/util/hooks/useActions";
import { formatAmount, formatAmountToInt } from "~/util/format/formatCurrency";
import { editSalesRecord } from "~/util/data/schemas/invoicing/sales-record-schema";
import { CustomerAutoCompleteForm } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
type EditData = z.infer<typeof editSalesRecord>;
export default function CurrencyExchangeInfo() {
  const { t } = useTranslation("common");
  const { salesRecord, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();

  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editSalesRecord,
    defaultValues: {
      id: salesRecord?.id,
      invoiceDate: new Date(salesRecord?.invoice_date || ""),
      invoiceNo: salesRecord?.invoice_no,
      authorizationCode: salesRecord?.authorization_code,
      customerNitCi: salesRecord?.customer_nit_ci,
      supplement: salesRecord?.supplement,
      nameOrBusinessName: salesRecord?.name_or_business_name,
      totalSaleAmount: formatAmount(salesRecord?.total_sale_amount),
      iceAmount: formatAmount(salesRecord?.ice_amount),
      iehdAmount: formatAmount(salesRecord?.iehd_amount),
      ipjAmount: formatAmount(salesRecord?.ipj_amount),
      taxRates: salesRecord?.tax_rates,
      otherNotSubjectToVat: formatAmount(salesRecord?.other_not_subject_to_vat),
      exportsAndExemptOperations: formatAmount(
        salesRecord?.exports_and_exempt_operations
      ),
      zeroRateTaxableSales: formatAmount(salesRecord?.zero_rate_taxable_sales),
      subtotal: formatAmount(salesRecord?.subtotal),
      discountsBonusAndRebatesSubjectToVat: formatAmount(
        salesRecord?.discounts_bonus_and_rebates_subject_to_vat
      ),
      giftCardAmount: formatAmount(salesRecord?.gift_card_amount),
      baseAmountForTaxDebit: formatAmount(
        salesRecord?.base_amount_for_tax_debit
      ),
      taxDebit: formatAmount(salesRecord?.tax_debit),
      state: salesRecord?.state,
      controlCode: salesRecord?.control_code,
      saleType: salesRecord?.sale_type,
      withTaxCreditRight: salesRecord?.with_tax_credit_right,
      consolidationStatus: salesRecord?.consolidation_status,
      customer: salesRecord?.customer,
      customerID: salesRecord?.customer_id,
    },
  });
  const allowEdit = permission?.edit || false;

  const onSubmit = (e: z.infer<typeof editSalesRecord>) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e as any,
      },
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

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            <CustomerAutoCompleteForm
              label={t("customer")}
              control={form.control}
              roleActions={roleActions}
              allowEdit={allowEdit}
              onSelect={(e) => {
                form.setValue("customerID", e.id);
                form.setValue("nameOrBusinessName", e.name);
              }}
            />

            <CustomFormDate
              control={form.control}
              name="invoiceDate"
              label={"FECHA DE LA FACTURA"}
              required={true}
              allowEdit={allowEdit}
            />
            {/* Invoice No */}
            <CustomFormFieldInput
              label={"Nº DE LA FACTURA"} // Spanish translation
              control={form.control}
              name="invoiceNo"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Authorization Code */}
            <CustomFormFieldInput
              label={"CODIGO DE AUTORIZACIÓN"} // Spanish translation
              control={form.control}
              name="authorizationCode"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Customer Nit/Ci */}
            <CustomFormFieldInput
              label={"NIT / CI CLIENTE"} // Spanish translation
              control={form.control}
              name="customerNitCi"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Supplement */}
            <CustomFormFieldInput
              label={"COMPLEMENTO"} // Spanish translation
              control={form.control}
              name="supplement"
              inputType="input"
              allowEdit={allowEdit}
            />

            {/* Name or Business Name */}
            <CustomFormFieldInput
              label={"NOMBRE O RAZON SOCIAL"} // Spanish translation
              control={form.control}
              name="nameOrBusinessName"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Total Sale Amount */}
            <CustomFormFieldInput
              label={"IMPORTE TOTAL DE LA VENTA"} // Spanish translation
              control={form.control}
              name="totalSaleAmount"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Ice Amount */}
            <CustomFormFieldInput
              label={"IMPORTE ICE"} // Spanish translation
              control={form.control}
              name="iceAmount"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Iehd Amount */}
            <CustomFormFieldInput
              label={"IMPORTE IEHD"} // Spanish translation
              control={form.control}
              name="iehdAmount"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Ipj Amount */}
            <CustomFormFieldInput
              label={"IMPORTE IPJ"} // Spanish translation
              control={form.control}
              name="ipjAmount"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Tax Rates */}
            <CustomFormFieldInput
              label={"TASAS"} // Spanish translation
              control={form.control}
              name="taxRates"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Other Not Subject to VAT */}
            <CustomFormFieldInput
              label={"OTROS NO SUJETOS AL IVA"} // Spanish translation
              control={form.control}
              name="otherNotSubjectToVat"
              inputType="input"
              allowEdit={allowEdit}
            />

            {/* Exports and Exempt Operations */}
            <CustomFormFieldInput
              label={"EXPORTACIONES Y OPERACIONES EXENTAS"} // Spanish translation
              control={form.control}
              name="exportsAndExemptOperations"
              inputType="input"
              allowEdit={allowEdit}
            />

            {/* Zero Rate Taxable Sales */}
            <CustomFormFieldInput
              label={"VENTAS GRAVADAS A TASA CERO"} // Spanish translation
              control={form.control}
              name="zeroRateTaxableSales"
              inputType="input"
              allowEdit={allowEdit}
            />

            {/* Subtotal */}
            <CustomFormFieldInput
              label={"SUBTOTAL"} // Spanish translation
              control={form.control}
              name="subtotal"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Discounts, Bonus, and Rebates Subject to VAT */}
            <CustomFormFieldInput
              label={"DESCUENTOS BONIFICACIONES Y REBAJAS SUJETAS AL IVA"} // Spanish translation
              control={form.control}
              name="discountsBonusAndRebatesSubjectToVat"
              inputType="input"
              allowEdit={allowEdit}
            />

            {/* Gift Card Amount */}
            <CustomFormFieldInput
              label={"IMPORTE GIFT CARD"} // Spanish translation
              control={form.control}
              name="giftCardAmount"
              inputType="input"
              allowEdit={allowEdit}
            />

            {/* Base Amount for Tax Debit */}
            <CustomFormFieldInput
              label={"IMPORTE BASE PARA DEBITO FISCAL"} // Spanish translation
              control={form.control}
              name="baseAmountForTaxDebit"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Tax Debit */}
            <CustomFormFieldInput
              label={"DEBITO FISCAL"} // Spanish translation
              control={form.control}
              name="taxDebit"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* State */}
            <CustomFormFieldInput
              label={"ESTADO"} // Spanish translation
              control={form.control}
              name="state"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Control Code */}
            <CustomFormFieldInput
              label={"CODIGO DE CONTROL"} // Spanish translation
              control={form.control}
              name="controlCode"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* Sale Type */}
            <CustomFormFieldInput
              label={"TIPO DE VENTA"} // Spanish translation
              control={form.control}
              name="saleType"
              inputType="input"
              required
              allowEdit={allowEdit}
            />

            {/* With Tax Credit Right */}
            <CustomFormFieldInput
              label={"CON DERECHO A CREDITO FISCAL"} // Spanish translation
              control={form.control}
              name="withTaxCreditRight"
              inputType="check"
              required
              allowEdit={allowEdit}
            />

            {/* Consolidation Status */}
            <CustomFormFieldInput
              label={"ESTADO CONSOLIDACION"} // Spanish translation
              control={form.control}
              name="consolidationStatus"
              inputType="input"
              required
              allowEdit={allowEdit}
            />
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
