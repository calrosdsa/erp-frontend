import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { Typography } from "@/components/typography";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { z } from "zod";
import { editPriceListSchema } from "~/util/data/schemas/stock/price-list-schema";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useEffect, useRef } from "react";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";

type EditData = z.infer<typeof editPriceListSchema>;
export default function PriceListInfo() {
  const { t } = useTranslation("common");
  const { priceList, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [currencyExchangePerm] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { setRegister } = useSetupToolbarStore();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editPriceListSchema,
    defaultValues: {
      id: priceList?.id,
      name: priceList?.name,
      isBuying: priceList?.is_buying,
      isSelling: priceList?.is_selling,
      currency: priceList?.currency,
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

  useEffect(() => {
    setRegister("tab", {
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    });
  }, [hasChanged]);

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
          <div className="detail-grid">
            <CustomFormFieldInput
              label={t("form.name")}
              control={form.control}
              name="name"
              inputType="input"
              allowEdit={allowEdit}
            />
            <CurrencyAutocompleteForm
              control={form.control}
              label="Moneda de Origen"
              onSelect={(e) => {}}
              allowEdit={allowEdit}
            />

            <CustomFormFieldInput
              label={"Para Comprar"}
              control={form.control}
              name="isBuying"
              inputType="check"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              label={"Para Vender"}
              control={form.control}
              name="isSelling"
              inputType="check"
              allowEdit={allowEdit}
            />
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
