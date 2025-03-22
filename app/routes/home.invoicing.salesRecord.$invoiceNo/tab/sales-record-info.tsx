import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app-types";
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
import { salesRecordDataSchema } from "~/util/data/schemas/invoicing/sales-record-schema";
import { CustomerAutoCompleteForm } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { Separator } from "@radix-ui/react-select";
import { InvoiceAutocompleteForm } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import { route } from "~/util/route";
import SalesRecordData from "~/routes/home.invoicing.salesRecord.new/sales-record-data";
type EditData = z.infer<typeof salesRecordDataSchema>;
export default function SalesRecordInfo() {
  const { t } = useTranslation("common");
  const { salesRecord, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const r = route

  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: salesRecordDataSchema,
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
      invoice: salesRecord?.invoice_code,
      invoiceID: salesRecord?.invoice_id,
    },
  });
  const allowEdit = permission?.edit || false;

  const onSubmit = (e: z.infer<typeof salesRecordDataSchema>) => {
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
  <SalesRecordData
  form={form}
  onSubmit={onSubmit}
  fetcher={fetcher}
  inputRef={inputRef}
  allowEdit={allowEdit}
  />
  );
}
