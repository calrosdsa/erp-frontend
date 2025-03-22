import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app-types";
import { useRef } from "react";
import { route } from "~/util/route";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { z } from "zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { usePermission } from "~/util/hooks/useActions";
import { editCurrencyExchangeSchema } from "~/util/data/schemas/core/currency-exchange-schema";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { formatAmount } from "~/util/format/formatCurrency";
type EditData = z.infer<typeof editCurrencyExchangeSchema>;
export default function CurrencyExchangeInfo() {
  const { t } = useTranslation("common");
  const { currencyExchange, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [currencyExchangePerm] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editCurrencyExchangeSchema,
    defaultValues: {
      name: currencyExchange?.name,
      id: currencyExchange?.id,
      fromCurrency:currencyExchange?.from_currency,
      toCurrency:currencyExchange?.to_currency,
      forBuying:currencyExchange?.for_buying,
      forSelling:currencyExchange?.for_selling,
      exchangeRate:formatAmount(currencyExchange?.exchange_rate),
    },
  });
  const allowEdit = currencyExchangePerm?.edit || false;

  const onSubmit = (e: EditData) => {
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

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
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
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="info-grid">
            <CustomFormFieldInput
              label={t("form.name")}
              control={form.control}
              name="name"
              inputType="input"
              allowEdit={allowEdit}
            />
            <CurrencyAutocompleteForm
              control={form.control}
              name="fromCurrency"
              label="Moneda de Origen"
              onSelect={(e) => {}}
              allowEdit={allowEdit}
            />
            <CurrencyAutocompleteForm
              control={form.control}
              name="toCurrency"
              label="Moneda de Destino"
              onSelect={(e) => {}}
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              label={"Para Comprar"}
              control={form.control}
              name="forBuying"
              inputType="check"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              label={"Para Vender"}
              control={form.control}
              name="forSelling"
              inputType="check"
              allowEdit={allowEdit}
            />

            <CustomFormFieldInput
              label={"Tipo de cambio"}
              control={form.control}
              name="exchangeRate"
              inputType="input"
              allowEdit={allowEdit}
            />
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
