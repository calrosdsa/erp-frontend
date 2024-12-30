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
import { CustomerAutoCompleteForm } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { purchaseRecordDataSchema } from "~/util/data/schemas/invoicing/purchase-record-schema";
import { SupplierAutoCompleteForm } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import PurchaseRecordData from "~/routes/home.invoicing.purchaseRecord.new/purchase-record-data";
type EditData = z.infer<typeof purchaseRecordDataSchema>;
export default function PurchaseRecordInfo() {
  const { t } = useTranslation("common");
  const { purchaseRecord, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: purchaseRecordDataSchema,
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

  const onSubmit = (e: z.infer<typeof purchaseRecordDataSchema>) => {
    fetcher.submit(
      {
        action: "edit",
        purchaseRecordData: e as any,
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
    <PurchaseRecordData
    form={form}
    onSubmit={onSubmit}
    allowEdit={allowEdit}
    inputRef={inputRef}
    fetcher={fetcher}
    />
  );
}
