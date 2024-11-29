import AccordationLayout from "@/components/layout/accordation-layout";
import { useTranslation } from "react-i18next";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";
import { UseFormReturn } from "react-hook-form";


export default function CurrencyAndPriceList({form}:{
    form: UseFormReturn<any>;
    
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
                required={true}
                nameK={"code"}
                onValueChange={onCurrencyChange}
                label={t("form.currency")}
                onSelect={(v) => {
                  form.setValue("currency", v.code);
                  form.trigger("currency");
                }}
              />
            </AccordationLayout>
    )
}