import CustomFormField from "@/components/custom/form/CustomFormField";
import FormLayout from "@/components/custom/form/FormLayout";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Input } from "@/components/ui/input";
import { GlobalState } from "~/types/app";
import { DEFAULT_CURRENCY } from "~/constant";
import { createCurrencyExchangeSchema } from "~/util/data/schemas/core/currency-exchange-schema";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { Separator } from "@/components/ui/separator";

export default function NewCurrencyExchangeClient() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = routes;
  const { companyDefaults } = useOutletContext<GlobalState>();
  const form = useForm<z.infer<typeof createCurrencyExchangeSchema>>({
    resolver: zodResolver(createCurrencyExchangeSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof createCurrencyExchangeSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-currency-exchange",
        createCurrencyExchange: values,
      } as any,
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

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", {
        o: t("currencyExchange"),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.currencyExchange) {
          navigate(
            r.toRoute({
              main: r.currencyExchange,
              routeSufix: [fetcher.data.currencyExchange.name],
              q: {
                tab: "info",
                id: fetcher.data.currencyExchange.uuid,
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );
  return (
    <div>
      <Card>
        <FormLayout>
          <Form {...form}>
            <fetcher.Form
              method="post"
              onSubmit={form.handleSubmit(onSubmit)}
              className={"gap-y-3 grid p-3"}
            >
              <div className="create-grid">
                <CustomFormFieldInput
                  label={t("form.name")}
                  control={form.control}
                  name="name"
                  inputType="input"
                />
                <Separator className=" col-span-full" />
                <CurrencyAutocompleteForm
                  control={form.control}
                  name="fromCurrency"
                  label="Moneda de Origen"
                  onSelect={(e) => {}}
                />
                <CurrencyAutocompleteForm
                  control={form.control}
                  name="toCurrency"
                  label="Moneda de Destino"
                  onSelect={(e) => {}}
                />
                <CustomFormFieldInput
                  label={"Para Comprar"}
                  control={form.control}
                  name="forBuying"
                  inputType="check"
                />
                <CustomFormFieldInput
                  label={"Para Vender"}
                  control={form.control}
                  name="forSelling"
                  inputType="check"
                />

                <CustomFormFieldInput
                  label={"Tipo de cambio"}
                  control={form.control}
                  name="exchangeRate"
                  inputType="input"
                />
              </div>

              <input ref={inputRef} type="submit" className="hidden" />
            </fetcher.Form>
          </Form>
        </FormLayout>
      </Card>
    </div>
  );
}
