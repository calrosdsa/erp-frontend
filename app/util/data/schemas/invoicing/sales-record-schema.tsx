import { z } from "zod";

export const createSalesRecord = z.object({
    invoiceDate: z.coerce.date(), // Assuming `time.Time` is represented as a Date
    invoiceNo: z.string(),
    authorizationCode: z.string(),
    customerNitCi: z.string(),
    supplement: z.string(),
    nameOrBusinessName: z.string(),
    totalSaleAmount: z.coerce.number().int(),
    iceAmount: z.coerce.number().int(),
    iehdAmount: z.coerce.number().int(),
    ipjAmount: z.coerce.number().int(),
    taxRates: z.coerce.number().int(),
    otherNotSubjectToVat: z.coerce.number().int(),
    exportsAndExemptOperations: z.coerce.number().int(),
    zeroRateTaxableSales: z.coerce.number().int(),
    subtotal: z.coerce.number().int(),
    discountsBonusAndRebatesSubjectToVat: z.coerce.number().int(),
    giftCardAmount: z.coerce.number().int(),
    baseAmountForTaxDebit: z.coerce.number().int(),
    taxDebit: z.coerce.number().int(),
    state: z.string(),
    controlCode: z.string(),
    saleType: z.string(),
    withTaxCreditRight: z.boolean(),
    consolidationStatus: z.string(),
    customer:z.string(),
    customerID: z.coerce.number(), // Assumes `int64` maps to `bigint` in JavaScript/TypeScript
  });


  export const mapToSalesRecordData = (data: z.infer<typeof createSalesRecord>) =>{
    return {
      authorization_code: data.authorizationCode,
      base_amount_for_tax_debit: data.baseAmountForTaxDebit,
      consolidation_status: data.consolidationStatus,
      control_code: data.controlCode,
      customer_id: Number(data.customerID), // Converting BigInt to number
      customer_nit_ci: data.customerNitCi,
      discounts_bonus_and_rebates_subject_to_vat: data.discountsBonusAndRebatesSubjectToVat,
      exports_and_exempt_operations: data.exportsAndExemptOperations,
      gift_card_amount: data.giftCardAmount,
      ice_amount: data.iceAmount,
      iehd_amount: data.iehdAmount,
      invoice_date: data.invoiceDate.toISOString(), // Converting Date to string (ISO format)
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
    };
  }