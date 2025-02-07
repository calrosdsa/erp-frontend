import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FetcherWithComponents,
  useFetcher,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { MutableRefObject, useEffect, useRef } from "react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { GlobalState } from "~/types/app";
import {
  purchaseRecordDataSchema,
} from "~/util/data/schemas/invoicing/purchase-record-schema";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomerAutoCompleteForm } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { SupplierAutoCompleteForm } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { InvoiceAutocompleteForm, InvoiceAutocompleteFormField } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import { Separator } from "@/components/ui/separator";
import Supplier from "../home.buying.supplier.$name/route";
type PurchaseRecordDataType = z.infer<typeof purchaseRecordDataSchema>;

export default function PurchaseRecordData({
  form,
  onSubmit,
  fetcher,
  inputRef,
  allowEdit,
}: {
  form: UseFormReturn<PurchaseRecordDataType, any, undefined>;
  onSubmit: (e: PurchaseRecordDataType) => void;
  fetcher: FetcherWithComponents<any>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?:boolean
}) {
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const { roleActions } = useOutletContext<GlobalState>();
  const formValues = form.getValues();
  return (
    <div>
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
                roleActions={roleActions}
                required={true}
                allowEdit={allowEdit}
                onSelect={(e) => {
                  form.setValue("supplier_id", e.id);
                  form.setValue("supplier_business_name", e.name);
                }}
              />

              <InvoiceAutocompleteFormField
                label={t("purchaseInvoice")}
                partyType={r.purchaseInvoice}
                partyID={formValues.supplier_id}
                allowEdit={allowEdit}
                control={form.control}
              />

              <Separator className=" col-span-full" />

              <CustomFormFieldInput
                label={"NIT Proveedor"}
                control={form.control}
                name="supplier_nit"
                allowEdit={allowEdit}
                inputType="input"
                required
              />
              
              <CustomFormFieldInput
                label={"Razon Social"}
                control={form.control}
                name="supplier_business_name"
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
                required
                allowEdit={allowEdit}
              />
              {/* Invoice No */}
              <CustomFormFieldInput
                label={"Nº DE LA FACTURA"} // Spanish translation
                control={form.control}
                name="invoice_no"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* dui_dim_no */}
              <CustomFormFieldInput
                label={"Número de DUI/DIM"}
                control={form.control}
                name="dui_dim_no"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              <CustomFormDate
                control={form.control}
                name="invoice_dui_dim_date"
                label={"FECHA DE LA FACTURA DUI/DIM"}
                required={true}
                allowEdit={allowEdit}
              />

              {/* Total Purchase Amount */}
              <CustomFormFieldInput
                label={"IMPORTE TOTAL DE LA COMPRA"}
                control={form.control}
                name="total_purchase_amount"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* ICE Amount */}
              <CustomFormFieldInput
                label={"IMPORTE ICE"}
                control={form.control}
                name="ice_amount"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* IEHD Amount */}
              <CustomFormFieldInput
                label={"IMPORTE IEHD"}
                control={form.control}
                name="iehd_amount"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* IPJ Amount */}
              <CustomFormFieldInput
                label={"IMPORTE IPJ"}
                control={form.control}
                name="ipj_amount"
                inputType="input"
                required
                allowEdit={allowEdit}
              />
              {/* Tax Rates */}
              <CustomFormFieldInput
                label={"Tasas"}
                control={form.control}
                name="tax_rates"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* Other Not Subject to Tax Credit */}
              <CustomFormFieldInput
                label={"OTRO NO SUJETO A CRÉDITO FISCAL"}
                control={form.control}
                name="other_not_subject_to_tax_credit"
                inputType="input"
                required
                allowEdit={allowEdit}
              />
              {/* Exempt Amounts */}
              <CustomFormFieldInput
                label={"IMPORTE EXENTO"}
                control={form.control}
                name="exempt_amounts"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* Zero Rate Taxable Purchases Amount */}
              <CustomFormFieldInput
                label={"IMPORTE DE COMPRAS SUJETAS A TASA CERO"}
                control={form.control}
                name="zero_rate_taxable_purchases_amount"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* Subtotal */}
              <CustomFormFieldInput
                label={"SUBTOTAL"}
                control={form.control}
                name="subtotal"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* Discounts, Bonus, Rebates Subject to VAT */}
              <CustomFormFieldInput
                label={"DESCUENTOS, BONOS, REEMBOLSOS SUJETOS A IVA"}
                control={form.control}
                name="discounts_bonus_rebates_subject_to_vat"
                inputType="input"
                required
                allowEdit={allowEdit}
              />
              {/* Gift Card Amount */}
              <CustomFormFieldInput
                label={"IMPORTE GIFT CARD"}
                control={form.control}
                name="gift_card_amount"
                inputType="input"
                required
                allowEdit={allowEdit}
              />
              <CustomFormFieldInput
                label={"IMPORTE BASE CRÉDITO FISCAL"}
                control={form.control}
                name="cf_base_amount"
                inputType="input"
                required
                allowEdit={allowEdit}
              />
              {/* Tax Credit */}
              <CustomFormFieldInput
                label={"CRÉDITO FISCAL"}
                control={form.control}
                name="tax_credit"
                inputType="input"
                required
                allowEdit={allowEdit}
              />
              {/* Purchase Type */}
              <CustomFormFieldInput
                label={"TIPO DE COMPRA"}
                control={form.control}
                name="purchase_type"
                inputType="input"
                required
                allowEdit={allowEdit}
              />
              {/* Control Code */}
              <CustomFormFieldInput
                label={"CÓDIGO DE CONTROL"}
                control={form.control}
                name="control_code"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* Consolidation Status */}
              <CustomFormFieldInput
                label={"ESTADO DE CONSOLIDACIÓN"}
                control={form.control}
                name="consolidation_status"
                inputType="input"
                required
                allowEdit={allowEdit}
              />

              {/* With Tax Credit Right */}
              <CustomFormFieldInput
                label={"CON DERECHO A CRÉDITO FISCAL"}
                control={form.control}
                name="with_tax_credit_right"
                inputType="check"
                required
                allowEdit={allowEdit}
              />

              <input ref={inputRef} type="submit" className="hidden" />
            </div>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
