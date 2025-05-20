import AccordationLayout from "@/components/layout/accordation-layout";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCostCenterFetcher } from "~/util/hooks/fetchers/accounting/useCostCenterFetcher";
import { useProjectFetcher } from "~/util/hooks/fetchers/accounting/useProjectFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";
import FormAutocompleteField from "../../select/form-autocomplete";

export default function AccountingDimensionForm({
  form,
  allowEdit,
}: {
  form: UseFormReturn<any, any, undefined>;
  allowEdit?: boolean;
}) {
  const { t } = useTranslation("common");
  const [projectsFetcher, onProjectChange] = useProjectFetcher();
  const [costCenterFetcher, onCostCenterChange] = useCostCenterFetcher();
  return (
    <AccordationLayout
      title={"Dimensiones Contables"}
      containerClassName=" col-span-full"
      open={true}
      className="create-grid"
    >
      <FormAutocompleteField
        data={projectsFetcher.data?.projects || []}
        form={form}
        name="project"
        nameK={"name"}
        allowEdit={allowEdit}
        onValueChange={onProjectChange}
        label={t("project")}
      />
      <FormAutocompleteField
        data={costCenterFetcher.data?.costCenters || []}
        form={form}
        name="costCenter"
        nameK={"name"}
        onValueChange={onCostCenterChange}
        allowEdit={allowEdit}
        label={t("costCenter")}
      />
    </AccordationLayout>
  );
}
