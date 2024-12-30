import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { formatAmount, formatCurrency } from "~/util/format/formatCurrency";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { State, stateFromJSON } from "~/gen/common";
import { action, loader } from "../route";
import { z } from "zod";
import {
  mapToPaymentReferenceSchema,
  paymentDataSchema,
} from "~/util/data/schemas/accounting/payment-schema";
import { useEffect, useRef, useState } from "react";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import PaymentData from "~/routes/home.payment.new/payment-data";
import { isEmpty } from "lodash";
import { useToolbar } from "~/util/hooks/ui/useToolbar";

type PaymentDataSchema = z.infer<typeof paymentDataSchema>;
export default function PaymentInfoTab() {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const { payment, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<PaymentDataSchema>({
    schema: paymentDataSchema,
    defaultValues: {
      id: payment?.id,
      postingDate: new Date(payment?.posting_date || new Date()),
      amount: formatAmount(payment?.amount),
      partyType: payment?.party_type,
      paymentType: payment?.payment_type,
      // paymentTypeT: t(payment?.payment_type || ""),
      party: payment?.party_name,
      partyID: payment?.party_id,
      accountPaidFromID: payment?.paid_from_id,
      accountPaidFromName: payment?.paid_from_name,
      accountPaidToID: payment?.paid_to_id,
      accountPaidToName: payment?.paid_to_name,
      paymentReferences:
        payment?.payment_references?.map((t) =>
          mapToPaymentReferenceSchema(t)
        ) || [],
      taxLines: [],
      project: payment?.project,
      projectID: payment?.project_id,
      costCenterID: payment?.cost_center_id,
      costCenter: payment?.cost_center,
    },
  });
  const formValues = form.getValues();
  const toolbar = useToolbar();
  const allowEdit =
    permission?.edit || stateFromJSON(payment?.status) == State.DRAFT;

  const onSubmit = (e: PaymentDataSchema) => {
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

  useEffect(() => {
    toolbar.setToolbar({
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    });
  }, [hasChanged]);

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
    <>
      {!isEmpty(formValues) && (
        <PaymentData
          form={form}
          onSubmit={onSubmit}
          inputRef={inputRef}
          fetcher={fetcher}
        />
      )}
    </>
  );
}
