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
import { editPurchaseRecord } from "~/util/data/schemas/invoicing/purchase-record-schema";
import { SupplierAutoCompleteForm } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
type EditData = z.infer<typeof editPurchaseRecord>;
export default function PurchaseRecordInfo() {
  const { t } = useTranslation("common");
  const { purchaseRecord, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editPurchaseRecord,
    defaultValues: {
      id: purchaseRecord?.id,
      invoice_dui_dim_date: new Date(purchaseRecord?.invoice_dui_dim_date || ""),
      invoice_no: purchaseRecord?.invoice_no,
      authorization_code: purchaseRecord?.authorization_code,
      supplier_nit: purchaseRecord?.supplier_nit,
      supplier_business_name: purchaseRecord?.supplier_business_name,
      total_purchase_amount: formatAmount(purchaseRecord?.total_purchase_amount),
      ice_amount: formatAmount(purchaseRecord?.ice_amount),
      iehd_amount: formatAmount(purchaseRecord?.iehd_amount),
      ipj_amount: formatAmount(purchaseRecord?.ipj_amount),
      dui_dim_no:purchaseRecord?.dui_dim_no,
      tax_rates: purchaseRecord?.tax_rates,
      exempt_amounts:formatAmount(purchaseRecord?.exempt_amounts),
      zero_rate_taxable_purchases_amount: formatAmount(purchaseRecord?.zero_rate_taxable_purchases_amount),
      subtotal: formatAmount(purchaseRecord?.subtotal),
      discounts_bonus_rebates_subject_to_vat: formatAmount(
        purchaseRecord?.discounts_bonus_rebates_subject_to_vat
      ),
      gift_card_amount: formatAmount(purchaseRecord?.gift_card_amount),
      cf_base_amount: formatAmount(
        purchaseRecord?.cf_base_amount
      ),
      tax_credit: formatAmount(purchaseRecord?.tax_credit),
      control_code: purchaseRecord?.control_code,
      purchase_type: purchaseRecord?.purchase_type,
      with_tax_credit_right: purchaseRecord?.with_tax_credit_right || false,
      consolidation_status: purchaseRecord?.consolidation_status,
      supplier: purchaseRecord?.supplier,
      supplier_id: purchaseRecord?.supplier_id,
      other_not_subject_to_tax_credit:purchaseRecord?.other_not_subject_to_tax_credit,
    },
  });
  const allowEdit = permission?.edit || false;

  const onSubmit = (e: z.infer<typeof editPurchaseRecord>) => {
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
        {/* {JSON.stringify(purchaseRecord)} */}
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
          <SupplierAutoCompleteForm
                  label={t("supplier")}
                  control={form.control}
                  roleActions={roleActions}
                  onSelect={(e) => {
                    form.setValue("supplier_id", e.id);
                    form.setValue("supplier_business_name", e.name);
                  }}
                  allowEdit={allowEdit}
                />
                <div className=" col-span-full" />

                <CustomFormFieldInput
                  label={"NIT Proveedor"}
                  control={form.control}
                  name="supplier_nit"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* Authorization Code */}
                <CustomFormFieldInput
                  label={"CÓDIGO DE AUTORIZACIÓN"}
                  control={form.control}
                  name="authorization_code"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                {/* Invoice No */}
                <CustomFormFieldInput
                  label={"Nº DE LA FACTURA"} // Spanish translation
                  control={form.control}
                  name="invoice_no"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* dui_dim_no */}
                <CustomFormFieldInput
                  label={"Número de DUI/DIM"}
                  control={form.control}
                  name="dui_dim_no"
                  inputType="input"
                  allowEdit={allowEdit}
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
                  allowEdit={allowEdit}
                  required
                />

                {/* ICE Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE ICE"}
                  control={form.control}
                  name="ice_amount"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* IEHD Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE IEHD"}
                  control={form.control}
                  name="iehd_amount"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* IPJ Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE IPJ"}
                  control={form.control}
                  name="ipj_amount"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                {/* Tax Rates */}
                <CustomFormFieldInput
                  label={"Tasas"}
                  control={form.control}
                  name="tax_rates"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* Other Not Subject to Tax Credit */}
                <CustomFormFieldInput
                  label={"OTRO NO SUJETO A CRÉDITO FISCAL"}
                  control={form.control}
                  name="other_not_subject_to_tax_credit"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                {/* Exempt Amounts */}
                <CustomFormFieldInput
                  label={"IMPORTE EXENTO"}
                  control={form.control}
                  name="exempt_amounts"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* Zero Rate Taxable Purchases Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE DE COMPRAS SUJETAS A TASA CERO"}
                  control={form.control}
                  name="zero_rate_taxable_purchases_amount"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* Subtotal */}
                <CustomFormFieldInput
                  label={"SUBTOTAL"}
                  control={form.control}
                  name="subtotal"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* Discounts, Bonus, Rebates Subject to VAT */}
                <CustomFormFieldInput
                  label={"DESCUENTOS, BONOS, REEMBOLSOS SUJETOS A IVA"}
                  control={form.control}
                  name="discounts_bonus_rebates_subject_to_vat"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                {/* Gift Card Amount */}
                <CustomFormFieldInput
                  label={"IMPORTE GIFT CARD"}
                  control={form.control}
                  name="gift_card_amount"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                 <CustomFormFieldInput
                  label={"IMPORTE BASE CRÉDITO FISCAL"}
                  control={form.control}
                  name="cf_base_amount"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                {/* Tax Credit */}
                <CustomFormFieldInput
                  label={"CRÉDITO FISCAL"}
                  control={form.control}
                  name="tax_credit"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                {/* Purchase Type */}
                <CustomFormFieldInput
                  label={"TIPO DE COMPRA"}
                  control={form.control}
                  name="purchase_type"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />
                {/* Control Code */}
                <CustomFormFieldInput
                  label={"CÓDIGO DE CONTROL"}
                  control={form.control}
                  name="control_code"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />

                {/* Consolidation Status */}
                <CustomFormFieldInput
                  label={"ESTADO DE CONSOLIDACIÓN"}
                  control={form.control}
                  name="consolidation_status"
                  inputType="input"
                  allowEdit={allowEdit}
                  required
                />      

                {/* With Tax Credit Right */}
                <CustomFormFieldInput
                  label={"CON DERECHO A CRÉDITO FISCAL"}
                  control={form.control}
                  name="with_tax_credit_right"
                  inputType="check"
                  allowEdit={allowEdit}
                  required
                />

          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
