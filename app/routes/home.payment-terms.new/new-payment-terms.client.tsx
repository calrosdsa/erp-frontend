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
import { entity } from "~/data/entites";


export default function NewTermsAndConditionsClient(){
    const fetcher = useFetcher<typeof action>()
    const form = useForm<TermsAndCondtionsDataType>({
        resolver:zodResolver(termsAndConditionsDataSchema),
        defaultValues:{}
    })
    const inputRef = useRef<HTMLInputElement | null>(null)
     const navigate = useNavigate();
      const { t } = useTranslation("common");
       const onSubmit = (e: TermsAndCondtionsDataType) => {
          fetcher.submit({
            action:"create",
            createData:e
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
              o: t("termsAndConditions"),
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
              if (fetcher.data?.termsAndConditions) {
                navigate(
                  route.toRoute({
                    main: route.termsAndConditions,
                    routeSufix: [fetcher.data.termsAndConditions?.name],
                    q: {
                      tab: "info",
                      id:fetcher.data.termsAndConditions?.uuid,
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
            <TermsAndConditionsData
            fetcher={fetcher}
            form={form}
            inputRef={inputRef}
            onSubmit={onSubmit}
            />
        </Card>
    )
}