import AccordationLayout from "@/components/layout/accordation-layout";
import { useTranslation } from "react-i18next";
import FormAutocomplete from "../../select/FormAutocomplete";
import { Control, UseFormReturn } from "react-hook-form";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { PriceListAutocompleteFormField } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";

export default function CurrencyAndPriceList({
  form,
  allowEdit,
  isSelling,
  isBuying,
}: {
  form: any;
  allowEdit?: boolean;
  isSelling?: boolean;
  isBuying?: boolean;
}) {
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const { t } = useTranslation("common");
  return (
    <AccordationLayout
      title={"Moneda y Lista de Precios"}
      containerClassName=" col-span-full"
      className="create-grid"
    >
      <FormAutocomplete
        data={currencyDebounceFetcher.data?.currencies || []}
        form={form}
        name="currency"
        allowEdit={allowEdit}
        required={true}
        nameK={"code"}
        onValueChange={onCurrencyChange}
        label={t("form.currency")}
      />
      <PriceListAutocompleteFormField
        form={form}
        allowEdit={allowEdit}
        name="priceList"
        label={t("priceList")}
        isBuying={isBuying}
        isSelling={isSelling}
      />
    </AccordationLayout>
  );
}
