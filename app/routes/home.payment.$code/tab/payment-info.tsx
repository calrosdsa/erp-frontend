import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import { formatAmount, formatCurrency } from "~/util/format/formatCurrency";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { State, stateFromJSON } from "~/gen/common";
import { action, loader } from "../route";
import { z } from "zod";
import {
  mapToPaymentReferenceSchema,
  paymentDataSchema,
} from "~/util/data/schemas/accounting/payment-schema";
import { useEffect, useRef, useState } from "react";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbarTab,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import PaymentData from "~/routes/home.payment.new/payment-data";
import { isEmpty } from "lodash";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type PaymentDataSchema = z.infer<typeof paymentDataSchema>;
export default function PaymentInfoTab() {
  const { t, i18n } = useTranslation("common");
  const r = route;
  const { payment, actions, taxLines } = useLoaderData<typeof loader>();
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
      party: {
        id: payment?.party_id,
        name: payment?.party_name,
      },
      accountPaidFrom: {
        id: payment?.paid_from_id,
        name: payment?.paid_from_name,
      },
      accountPaidTo: {
        id: payment?.paid_to_id,
        name: payment?.paid_to_name,
      },
      paymentReferences:
        payment?.payment_references?.map((t) =>
          mapToPaymentReferenceSchema(t)
        ) || [],
      taxLines: taxLines.map((t) => toTaxAndChargeLineSchema(t)),
      project: {
        id: payment?.project_id,
        name: payment?.project,
        uuid: payment?.project_uuid,
      },
      costCenter: {
        id: payment?.cost_center_id,
        name: payment?.cost_center,
        uuid: payment?.cost_center_uuid,
      },
      company_bank_account: {
        id: payment?.company_bank_account_id,
        name: payment?.company_bank_account,
        uuid: payment?.company_bank_account_uuid,
      },
      party_bank_account: {
        id: payment?.party_bank_account_id,
        name: payment?.party_bank_account,
        uuid: payment?.party_bank_account_uuid,
      },
      cheque_reference_date: payment?.cheque_reference_date
        ? new Date(payment?.cheque_reference_date)
        : undefined,
      cheque_reference_no:payment?.cheque_reference_no
    },
  });
  const formValues = form.getValues();
  const toolbar = useToolbar();
  const { setRegister } = useSetupToolbarStore();

  const allowEdit =
    permission?.edit && stateFromJSON(payment?.status) == State.DRAFT;
  const allowCreate =
    permission?.create && stateFromJSON(payment?.status) == State.DRAFT;

  const onSubmit = (e: PaymentDataSchema) => {
    fetcher.submit(
      {
        action: "edit",
        editionData: e as any,
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
    setRegister("tab", {
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

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
      {/* {JSON.stringify(payment?.paid_from_name)} */}
      <PaymentData
        form={form}
        onSubmit={onSubmit}
        inputRef={inputRef}
        fetcher={fetcher}
        allowEdit={allowEdit}
        allowCreate={allowCreate}
      />
    </>
  );
}
