import { Card } from "@/components/ui/card";
import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "./route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { paymentTermsDataSchema, PaymentTermsType } from "~/util/data/schemas/document/payment-terms.schema";
import PaymentTermsData from "./payment-term-data";


export default function NewPaymentTermsClient(){
    const fetcher = useFetcher<typeof action>()
    const form = useForm<PaymentTermsType>({
        resolver:zodResolver(paymentTermsDataSchema),
        defaultValues:{}
    })
    const inputRef = useRef<HTMLInputElement | null>(null)
     const navigate = useNavigate();
      const { t } = useTranslation("common");
       const onSubmit = (e: PaymentTermsType) => {
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
              o: "Condiciones de pago",
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
              if (fetcher.data?.paymentTerms) {
                navigate(
                  route.toRoute({
                    main: route.paymentTerms,
                    routeSufix: [fetcher.data.paymentTerms?.name],
                    q: {
                      tab: "info",
                      id:fetcher.data.paymentTerms?.uuid,
                    },
                  })
                );
              }
            },
          },
          [fetcher.data]
        );
    return (
        <Card>
            <PaymentTermsData
            fetcher={fetcher}
            form={form}
            inputRef={inputRef}
            onSubmit={onSubmit}
            />
        </Card>
    )
}