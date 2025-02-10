import { useOutletContext } from "react-router";
import TermsAndConditionsData from "~/routes/home.terms-and-conditions.new/terms-and-conditions-data";
import { action, loader } from "../route";
import { useEffect, useRef } from "react";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { State, stateFromJSON } from "~/gen/common";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbarTab,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import BankAccountData from "~/routes/home.bank-account.new/bank-account-data";
import {
  cashOutflowDataSchema,
  CashOutflowDataType,
} from "~/util/data/schemas/accounting/cash-outflow.schema";
import CashOutflowForm from "~/routes/home.cash-outflow.new/cash-outflow-form";
import { formatAmount } from "~/util/format/formatCurrency";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";

export default function CashOutflowInfoTab() {
  const { entity, actions, taxLines } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const status = stateFromJSON(entity?.status);
  const fetcher = useFetcher<typeof action>();
  const allowEdit = permission.edit || status == State.ENABLED;
  const { form, updateRef } = useEditFields<CashOutflowDataType>({
    schema: cashOutflowDataSchema,
    defaultValues: {
      id: entity?.id,
      posting_time: entity?.posting_time,
      posting_date: new Date(entity?.posting_date || new Date()),
      tz: entity?.tz,
      party: {
        name: entity?.party,
        id: entity?.party_id,
        uuid: entity?.party_uuid,
      },
      party_type: entity?.party_type,
      concept: entity?.concept,
      cash_outflow_type: entity?.cash_outflow_type,
      ctrl_code:entity?.ctrl_code,
      invoice_no: entity?.invoice_no,
      nit: entity?.nit,
      auth_code: entity?.auth_code,
      emision_date: entity?.emision_date ? new Date(entity.emision_date) : null,

      taxLines:  taxLines.map((t) => toTaxAndChargeLineSchema(t)),
      amount: formatAmount(entity?.amount),
    },
  });
  const { setRegister } = useSetupToolbarStore();

  const onSubmit = (e: CashOutflowDataType) => {
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
  useEffect(() => {
    setRegister("tab", {
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
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
    <>
      <CashOutflowForm
        fetcher={fetcher}
        form={form}
        onSubmit={onSubmit}
        inputRef={inputRef}
        allowEdit={allowEdit}
      />
    </>
  );
}
