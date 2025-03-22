import {  useOutletContext } from "react-router";
import TermsAndConditionsData from "~/routes/home.terms-and-conditions.new/terms-and-conditions-data";
import { action, loader } from "../route";
import { useRef } from "react";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { State, stateFromJSON } from "~/gen/common";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditFields } from "~/util/hooks/useEditFields";
import { termsAndConditionsDataSchema, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import { setUpToolbarTab, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { bankAccountSchema, BankAccountType } from "~/util/data/schemas/accounting/bank-account.schema";
import BankAccountData from "~/routes/home.bank-account.new/bank-account-data";

export default function BankAccountInfo(){
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
      const { form, updateRef } = useEditFields<BankAccountType>({
        schema: bankAccountSchema,
        defaultValues: {
            id:entity?.id,
            account_name:entity?.account_name,
            bank_account_type:entity?.bank_account_type,
            bank:{
              id:entity?.bank_id,
              name:entity?.bank,
              uuid:entity?.bank_uuid,
            },
            partyType:entity?.party_type,
            party:{
              id:entity?.party_id,
              name:entity?.party,
              uuid:entity?.party_uuid
            },
            bank_account_number:entity?.bank_account_number,
            iban:entity?.iban,
            branch_code:entity?.branch_code,
            is_company_account:entity?.is_comapny_account,
            company_account:{
              id:entity?.company_account_id,
              name:entity?.company_account,
              uuid:entity?.company_account_uuid,
            },
       },
      });
    
      const onSubmit = (e: BankAccountType) => {
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
      setUpToolbarTab(() => {
        return {
          onSave: () => {
            inputRef.current?.click();
          },
          disabledSave: !allowEdit,
        };
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
      <>
        <BankAccountData
        fetcher={fetcher}
        form={form}
        onSubmit={onSubmit}
        inputRef={inputRef}
        allowEdit={allowEdit}
        />
        </>
    )
}