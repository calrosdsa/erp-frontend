import { Card } from "@/components/ui/card";
import TermsAndConditionsData from "./payment-terms-template-data";
import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "./route";
import { useForm } from "react-hook-form";
import { termsAndConditionsDataSchema, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { paymentTermsTemplateDataSchema, PaymentTermsTemplateType } from "~/util/data/schemas/document/payment-terms-template.schema";
import PaymentTermsTemplateData from "./payment-terms-template-data";
import CreateLayout from "@/components/layout/create-layout";


export default function NewPaymentTermsTemplateClient(){
    const fetcher = useFetcher<typeof action>()
    const form = useForm<PaymentTermsTemplateType>({
        resolver:zodResolver(paymentTermsTemplateDataSchema),
        defaultValues:{
          payment_term_lines:[],
        }
    })
    const inputRef = useRef<HTMLInputElement | null>(null)
     const navigate = useNavigate();
      const { t } = useTranslation("common");
       const onSubmit = (e: PaymentTermsTemplateType) => {
          fetcher.submit({
            action:"create",
            creationData:e
          },{
            method:"POST",
            encType:"application/json",
          })
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
              o: t("paymentTermsTemplate"),
            }),
            onSave: () => {
              inputRef.current?.click();
            },
          };
        }, [t]);
      
        useDisplayMessage(
          {
            error: fetcher.data?.error,
            success: fetcher.data?.message,
            onSuccessMessage: () => {
              if (fetcher.data?.paymentTermsTemplate) {
                navigate(
                  route.toRoute({
                    main: route.paymentTermsTemplate,
                    routeSufix: [fetcher.data.paymentTermsTemplate?.name],
                    q: {
                      tab: "info",
                      id:fetcher.data.paymentTermsTemplate?.id.toString(),
                    },
                  })
                );
              }
            },
          },
          [fetcher.data]
        );
    return (
        <CreateLayout>
            <PaymentTermsTemplateData
            fetcher={fetcher}
            form={form}
            inputRef={inputRef}
            onSubmit={onSubmit}
            isNew={true}
            />
        </CreateLayout>
    )
}