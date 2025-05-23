import { Card } from "@/components/ui/card";
import BankData from "./bank-data";
import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "./route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { bankDataSchema, BankDataType } from "~/util/data/schemas/accounting/bank.schema";
import CreateLayout from "@/components/layout/create-layout";


export default function NewBankClient(){
    const fetcher = useFetcher<typeof action>()
    const form = useForm<BankDataType>({
        resolver:zodResolver(bankDataSchema),
        defaultValues:{}
    })
    const inputRef = useRef<HTMLInputElement | null>(null)
     const navigate = useNavigate();
      const { t } = useTranslation("common");
       const onSubmit = (e: BankDataType) => {
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
              o: t("bank"),
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
              if (fetcher.data?.bank) {
                navigate(
                  route.toRoute({
                    main: route.bank,
                    routeSufix: [fetcher.data.bank?.name],
                    q: {
                      tab: "info",
                      id:fetcher.data.bank?.id.toString(),
                    },
                  }),{
                    replace:true
                  }
                );
              }
            },
          },
          [fetcher.data]
        );
    return (
        <CreateLayout>
            <BankData
            fetcher={fetcher}
            form={form}
            inputRef={inputRef}
            onSubmit={onSubmit}
            isNew={true}
            />
        </CreateLayout>
    )
}