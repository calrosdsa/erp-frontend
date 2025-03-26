import {  useOutletContext } from "react-router";
import { action, loader } from "../route";
import { useEffect, useRef } from "react";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { State, stateFromJSON } from "~/gen/common";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditFields } from "~/util/hooks/useEditFields";
import { setUpToolbarTab, useLoadingTypeToolbar, useSetupToolbarStore } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { mapToPaymentTermsLineSchema, paymentTermsTemplateDataSchema, PaymentTermsTemplateType } from "~/util/data/schemas/document/payment-terms-template.schema";
import PaymentTermsTemplateData from "~/routes/home.payment-terms-template.new/payment-terms-template-data";

export default function TermsAndConditionsInfo(){
    const { entity, actions,paymentTermLines } = useLoaderData<typeof loader>();
      const inputRef = useRef<HTMLInputElement | null>(null);
      const { roleActions } = useOutletContext<GlobalState>();
      const [permission] = usePermission({
        roleActions,
        actions,
      });
      const status = stateFromJSON(entity?.status);
      const fetcher = useFetcher<typeof action>();
      const allowEdit = permission.edit || status == State.ENABLED;
      const {setRegister} =  useSetupToolbarStore()
      const { form, updateRef } = useEditFields<PaymentTermsTemplateType>({
        schema: paymentTermsTemplateDataSchema,
        defaultValues: {
            id:entity?.id,
            name:entity?.name,
            payment_term_lines:paymentTermLines.map(t=>mapToPaymentTermsLineSchema(t))
            // terms_and_conditions:entity?.terms_and_conditions,
       },
      });
    
      const onSubmit = (e: PaymentTermsTemplateType) => {
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
      useEffect(()=>{
        setRegister("tab",{
          onSave: () => {
            inputRef.current?.click();
          },
          disabledSave: !allowEdit,
        })
      },[allowEdit,entity])
      
  
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
        <PaymentTermsTemplateData
        fetcher={fetcher}
        form={form}
        onSubmit={onSubmit}
        inputRef={inputRef}
        allowEdit={allowEdit}
        />
        </>
    )
}