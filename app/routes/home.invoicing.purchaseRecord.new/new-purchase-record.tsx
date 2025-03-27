import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { GlobalState } from "~/types/app-types";
import { purchaseRecordDataSchema } from "~/util/data/schemas/invoicing/purchase-record-schema";
import PurchaseRecordData from "./purchase-record-data";
import { usePurchaseRecordStore } from "./purchase-record-store";
import CreateLayout from "@/components/layout/create-layout";

export default function NewPurchaseRecordClient() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const { roleActions } = useOutletContext<GlobalState>();
  // Default values for the form
  const { payload,setPayload } = usePurchaseRecordStore();
  const form = useForm<z.infer<typeof purchaseRecordDataSchema>>({
    resolver: zodResolver(purchaseRecordDataSchema),
    defaultValues: {
      ...payload,
      authorization_code: payload.authorization_code
        ? payload.authorization_code
        : "",
      cf_base_amount: payload.cf_base_amount ? payload.cf_base_amount : 0,
      consolidation_status: payload.consolidation_status
        ? payload.consolidation_status
        : "",
      control_code: payload.control_code ? payload.control_code : "",
      discounts_bonus_rebates_subject_to_vat:
        payload.discounts_bonus_rebates_subject_to_vat
          ? payload.discounts_bonus_rebates_subject_to_vat
          : 0,
      dui_dim_no: payload.dui_dim_no ? payload.dui_dim_no : "",
      exempt_amounts: payload.exempt_amounts ? payload.exempt_amounts : 0,
      gift_card_amount: payload.gift_card_amount ? payload.gift_card_amount : 0,
      ice_amount: payload.ice_amount ? payload.ice_amount : 0,
      iehd_amount: payload.iehd_amount ? payload.iehd_amount : 0,
      ipj_amount: payload.ipj_amount ? payload.ipj_amount : 0,
      other_not_subject_to_tax_credit: payload.other_not_subject_to_tax_credit
        ? payload.other_not_subject_to_tax_credit
        : 0,
      subtotal: payload.subtotal ? payload.subtotal : 0,
      tax_credit: payload.tax_credit ? payload.tax_credit : 0,
      tax_rates: payload.tax_rates ? payload.tax_rates : 0,
      with_tax_credit_right:
        payload.with_tax_credit_right != undefined
          ? payload.with_tax_credit_right
          : false,
      zero_rate_taxable_purchases_amount:
        payload.zero_rate_taxable_purchases_amount
          ? payload.zero_rate_taxable_purchases_amount
          : 0,
    },
  });
  const watchedFields = useWatch({
    control: form.control,
  });

  const onSubmit = (values: z.infer<typeof purchaseRecordDataSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-purchase-record",
        purchaseRecordData: values,
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
        if (fetcher.data?.purchaseRecord) {
          navigate(
            r.toRoute({
              main: r.purchaseRecord,
              routePrefix: [r.invoicing],
              routeSufix: [fetcher.data.purchaseRecord.invoice_no],
              q: {
                tab: "info",
                id: fetcher.data.purchaseRecord.uuid,
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    setPayload(form.getValues());
  }, [watchedFields]);

  return (
    <div>
      <CreateLayout>
        <PurchaseRecordData
          form={form}
          onSubmit={onSubmit}
          inputRef={inputRef}
          fetcher={fetcher}
          isNew={true}
        />
      </CreateLayout>
    </div>
  );
}
