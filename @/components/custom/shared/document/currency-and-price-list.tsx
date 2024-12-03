import AccordationLayout from "@/components/layout/accordation-layout";
import { useTranslation } from "react-i18next";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";
import { UseFormReturn } from "react-hook-form";


export default function CurrencyAndPriceList({form,disabled}:{
    form: UseFormReturn<any>;
    disabled?:boolean
}){
    const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
    const {t} = useTranslation("common")
    return (
        <AccordationLayout
              title={t("form.currency")}
              containerClassName=" col-span-full"
              className="create-grid"
            >
              <FormAutocomplete
                data={currencyDebounceFetcher.data?.currencies || []}
                control={form.control}
                name="currency"
                disabled={disabled}
                required={true}
                nameK={"code"}
                onValueChange={onCurrencyChange}
                label={t("form.currency")}
              />
            </AccordationLayout>
    )
}