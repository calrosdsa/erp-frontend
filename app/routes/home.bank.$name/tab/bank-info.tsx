import { useOutletContext } from "react-router";
import TermsAndConditionsData from "~/routes/home.terms-and-conditions.new/terms-and-conditions-data";
import { action, loader } from "../route";
import { useEffect, useRef } from "react";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { State, stateFromJSON } from "~/gen/common";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  bankDataSchema,
  BankDataType,
} from "~/util/data/schemas/accounting/bank.schema";
import BankData from "~/routes/home.bank.new/bank-data";

export default function BankInfoTab() {
  const { entity, actions } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const status = stateFromJSON(entity?.status);
  const fetcher = useFetcher<typeof action>();
  const allowEdit = permission.edit || status == State.ENABLED;
  const { form, updateRef } = useEditFields<BankDataType>({
    schema: bankDataSchema,
    defaultValues: {
      id: entity?.id,
      name: entity?.name,
    },
  });
  const { setRegister } = useSetupToolbarStore();

  const onSubmit = (e: BankDataType) => {
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
  }, [allowEdit, entity]);

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
    <BankData
      fetcher={fetcher}
      form={form}
      onSubmit={onSubmit}
      inputRef={inputRef}
      allowEdit={allowEdit}
    />
  );
}
