import {  useOutletContext } from "react-router";
import { action, loader } from "../route";
import { useRef } from "react";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { State, stateFromJSON } from "~/gen/common";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditFields } from "~/util/hooks/useEditFields";
import { setUpToolbarTab, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { paymentTermsDataSchema, PaymentTermsType } from "~/util/data/schemas/document/payment-terms.schema";
import PaymentTermsData from "~/routes/home.payment-terms.new/payment-term-data";

export default function PaymentTermsIndo(){
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
      const { form, updateRef } = useEditFields<PaymentTermsType>({
        schema: paymentTermsDataSchema,
        defaultValues: {
            id:entity?.id,
            name:entity?.name,
            invoice_portion:entity?.invoice_portion,
            credit_days:entity?.credit_days,
            due_date_base_on:entity?.due_date_base_on,
            description:entity?.description,
       },
      });
    
      const onSubmit = (e: PaymentTermsType) => {
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
        <PaymentTermsData
        fetcher={fetcher}
        form={form}
        onSubmit={onSubmit}
        inputRef={inputRef}
        allowEdit={allowEdit}
        />
    )
}