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
import { InvoiceAutocompleteForm } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import { Separator } from "@/components/ui/separator";
import Supplier from "../home.buying.supplier.$name/route";
import { salesRecordDataSchema } from "~/util/data/schemas/invoicing/sales-record-schema";
type SalesRecordType = z.infer<typeof salesRecordDataSchema>;

export default function SalesRecordData({
  form,
  onSubmit,
  fetcher,
  inputRef,
  allowEdit,
}: {
  form: UseFormReturn<SalesRecordType, any, undefined>;
  onSubmit: (e: SalesRecordType) => void;
  fetcher: FetcherWithComponents<any>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?:boolean
}) {
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const { roleActions } = useOutletContext<GlobalState>();
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
            <InvoiceAutocompleteForm
              label={t("saleInvoice")}
              partyType={r.saleInvoice}
              control={form.control}
              onSelect={(e) => {
                form.setValue("invoiceID", e.id);
              }}
            />
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
            <Separator className=" col-span-full"/>
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
              <input ref={inputRef} type="submit" className="hidden" />
            </div>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
