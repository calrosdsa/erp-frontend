import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app-types";
import { editChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { useEffect, useRef, useState } from "react";
import { route } from "~/util/route";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { z } from "zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { usePermission } from "~/util/hooks/useActions";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { action, loader } from "../route";
import { AccountLedgerData, accountLedgerDataSchema, editAccountLedger } from "~/util/data/schemas/accounting/account-ledger.schema";
import { LedgerAutocompleteForm } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import SelectForm from "@/components/custom/select/SelectForm";
import {
  AccountType,
  CashFlowSection,
  cashFlowSectionToJSON,
  FinacialReport,
  finacialReportToJSON,
} from "~/gen/common";
import AccordationLayout from "@/components/layout/accordation-layout";
import AccountLedgerForm from "~/routes/home.account.new/account-ledger-form";
type EditData = z.infer<typeof editAccountLedger>;
export default function AccountInfo() {
  const { t } = useTranslation("common");
  const { account, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  

  const { form, hasChanged, updateRef } = useEditFields<AccountLedgerData>({
    schema: accountLedgerDataSchema,
    defaultValues: {
      id: account?.id,
      name: account?.name,
      is_group: account?.is_group,
      account_type: account?.account_type,
      account_root_type:account?.account_root_type,
      report_type: account?.report_type,
      cash_flow_section: account?.cash_flow_section,
      ledger_no: account?.ledger_no,
      parent:{
        id:account?.parent_id,
        name:account?.parent,
        uuid:account?.parent_uuid,
      },
      is_offset_account:account?.is_offset_account
      // accountRootType:account.
    },
  });
  const allowEdit = permission?.edit || false;
    const { setRegister } = useSetupToolbarStore();

  const onSubmit = (e: AccountLedgerData) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e,
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
      disabledSave: !hasChanged,
    });
  }, [allowEdit,hasChanged]);


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
    <AccountLedgerForm
    allowEdit={allowEdit}
    inputRef={inputRef}
    onSubmit={onSubmit}
    form={form}
    fetcher={fetcher}
    />
  );
}
