import { formatRFC3339 } from "date-fns";
import { z } from "zod";
import { components } from "~/sdk";

export const createPurchaseRecord = z.object({
  supplier_nit:z.string(),
  supplier_business_name: z.string(),
  authorization_code: z.string(),
  cf_base_amount: z.coerce.number(), // Format: int32
  consolidation_status: z.string(),
  control_code: z.string(),
  discounts_bonus_rebates_subject_to_vat: z.coerce.number(), // Format: int32
  dui_dim_no: z.string(),
  exempt_amounts: z.coerce.number(), // Format: int32
  gift_card_amount: z.coerce.number(), // Format: int32
  ice_amount: z.coerce.number(), // Format: int32
  iehd_amount: z.coerce.number(), // Format: int32
  invoice_dui_dim_date: z.date(), // Format: date-time (ISO 8601 string)
  invoice_no: z.string(),
  ipj_amount: z.coerce.number(), // Format: int32
  other_not_subject_to_tax_credit: z.coerce.number(), // Format: int32
  purchase_type: z.string(),
  subtotal: z.coerce.number(), // Format: int32
  supplier: z.string(),
  supplier_id: z.coerce.number(), // Format: int64 (use BigInt if necessary)
  tax_credit: z.coerce.number(), // Format: int32
  tax_rates: z.coerce.number(), // Format: int32
  total_purchase_amount: z.coerce.number(), // Format: int32
  with_tax_credit_right: z.boolean(),
  zero_rate_taxable_purchases_amount: z.coerce.number(), // Format: int32
});


export const editPurchaseRecord = z.object({
    authorization_code: z.string(),
    cf_base_amount: z.coerce.number(), // Format: int32
    consolidation_status: z.string(),
    control_code: z.string(),
    discounts_bonus_rebates_subject_to_vat: z.coerce.number(), // Format: int32
    dui_dim_no: z.string(),
    supplier_nit:z.string(),
    exempt_amounts: z.coerce.number(), // Format: int32
    gift_card_amount: z.coerce.number(), // Format: int32
    ice_amount: z.coerce.number(), // Format: int32
    id: z.coerce.number().int(), // Format: int64 (use BigInt if necessary)
    iehd_amount: z.coerce.number(), // Format: int32
    invoice_dui_dim_date: z.date(), // Format: date-time (ISO 8601 string)
    invoice_no: z.string(),
    ipj_amount: z.coerce.number(), // Format: int32
    other_not_subject_to_tax_credit: z.coerce.number(), // Format: int32
    purchase_type: z.string(),
    subtotal: z.coerce.number(), // Format: int32
    supplier: z.string(),
    supplier_business_name: z.string(),
    supplier_id: z.coerce.number(), // Format: int64 (use BigInt if necessary)
    tax_credit: z.coerce.number(), // Format: int32
    tax_rates: z.coerce.number(), // Format: int32
    total_purchase_amount: z.coerce.number(), // Format: int32
    with_tax_credit_right: z.boolean(),
    zero_rate_taxable_purchases_amount: z.coerce.number(), // Format: int32
  });


  export const mapToPurchaseRecordData = (data: any)=> {
    const d = {
        authorization_code: data.authorization_code,
        cf_base_amount: data.cf_base_amount,
        consolidation_status: data.consolidation_status,
        control_code: data.control_code,
        discounts_bonus_rebates_subject_to_vat: data.discounts_bonus_rebates_subject_to_vat,
        dui_dim_no: data.dui_dim_no,
        exempt_amounts: data.exempt_amounts,
        gift_card_amount: data.gift_card_amount,
        ice_amount: data.ice_amount,
        iehd_amount: data.iehd_amount,
        invoice_dui_dim_date:formatRFC3339(data.invoice_dui_dim_date),
        invoice_no: data.invoice_no,
        ipj_amount: data.ipj_amount,
        other_not_subject_to_tax_credit: data.other_not_subject_to_tax_credit,
        purchase_type: data.purchase_type,
        subtotal: data.subtotal,
        supplier_business_name: data.supplier_business_name,
        supplier_id: data.supplier_id,
        supplier_nit: data.supplier_nit,
        tax_credit: data.tax_credit,
        tax_rates: data.tax_rates,
        total_purchase_amount:data.total_purchase_amount,
        with_tax_credit_right: data.with_tax_credit_right,
        zero_rate_taxable_purchases_amount: data.zero_rate_taxable_purchases_amount
    }
    return d
  };