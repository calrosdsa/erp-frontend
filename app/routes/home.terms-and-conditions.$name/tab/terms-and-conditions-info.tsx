import {  useOutletContext } from "react-router";
import TermsAndConditionsData from "~/routes/home.terms-and-conditions.new/terms-and-conditions-data";
import { action, loader } from "../route";
import { useRef } from "react";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { State, stateFromJSON } from "~/gen/common";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditFields } from "~/util/hooks/useEditFields";
import { termsAndConditionsDataSchema, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import { setUpToolbarTab, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function TermsAndConditionsInfo(){
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
      const { form, updateRef } = useEditFields<TermsAndCondtionsDataType>({
        schema: termsAndConditionsDataSchema,
        defaultValues: {
            id:entity?.id,
            name:entity?.name,
            terms_and_conditions:entity?.terms_and_conditions,
       },
      });
    
      const onSubmit = (e: TermsAndCondtionsDataType) => {
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
        <TermsAndConditionsData
        fetcher={fetcher}
        form={form}
        onSubmit={onSubmit}
        inputRef={inputRef}
        allowEdit={allowEdit}
        />
    )
}