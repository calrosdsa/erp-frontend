import { formatRFC3339 } from "date-fns";
import { z } from "zod";
import { components } from "~/sdk";
import { field } from "..";
export const salesRecordDataSchema = z.object({
  id: z.number().optional(),
  invoiceDate: z.coerce.date(), // Assuming `time.Time` is represented as a Date
  invoiceNo: z.string(),
  authorizationCode: z.string(),
  customerNitCi: z.string(),
  supplement: z.string(),
  nameOrBusinessName: z.string(),
  totalSaleAmount: z.coerce.number(),
  iceAmount: z.coerce.number(),
  iehdAmount: z.coerce.number(),
  ipjAmount: z.coerce.number(),
  taxRates: z.coerce.number(),
  otherNotSubjectToVat: z.coerce.number(),
  exportsAndExemptOperations: z.coerce.number(),
  zeroRateTaxableSales: z.coerce.number(),
  subtotal: z.coerce.number(),
  discountsBonusAndRebatesSubjectToVat: z.coerce.number(),
  giftCardAmount: z.coerce.number(),
  baseAmountForTaxDebit: z.coerce.number(),
  taxDebit: z.coerce.number(),
  state: z.string(),
  controlCode: z.string(),
  saleType: z.string(),
  withTaxCreditRight: z.boolean(),
  consolidationStatus: z.string(),
  customer: field,
  invoice: field,
});

export const mapToSalesRecordData = (
  data: z.infer<typeof salesRecordDataSchema>
) => {
  return {
    id: data.id,
    authorization_code: data.authorizationCode,
    base_amount_for_tax_debit: data.baseAmountForTaxDebit,
    consolidation_status: data.consolidationStatus,
    control_code: data.controlCode,
    customer_id: data.customer.id, // Converting BigInt to number
    customer_nit_ci: data.customerNitCi,
    discounts_bonus_and_rebates_subject_to_vat:
    data.discountsBonusAndRebatesSubjectToVat,
    exports_and_exempt_operations: data.exportsAndExemptOperations,
    gift_card_amount: data.giftCardAmount,
    ice_amount: data.iceAmount,
    iehd_amount: data.iehdAmount,
    invoice_date: formatRFC3339(data.invoiceDate), // Converting Date to string (ISO format)
    invoice_no: data.invoiceNo,
    ipj_amount: data.ipjAmount,
    name_or_business_name: data.nameOrBusinessName,
    other_not_subject_to_vat: data.otherNotSubjectToVat,
    sale_type: data.saleType,
    state: data.state,
    subtotal: data.subtotal,
    supplement: data.supplement,
    tax_debit: data.taxDebit,
    tax_rates: data.taxRates,
    total_sale_amount: data.totalSaleAmount,
    with_tax_credit_right: data.withTaxCreditRight,
    zero_rate_taxable_sales: data.zeroRateTaxableSales,
    invoice_id: data.invoice.id,
  } as components["schemas"]["SalesRecordData"];
};
