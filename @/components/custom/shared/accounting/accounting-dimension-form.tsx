import AccordationLayout from "@/components/layout/accordation-layout";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCostCenterFetcher } from "~/util/hooks/fetchers/accounting/useCostCenterFetcher";
import { useProjectFetcher } from "~/util/hooks/fetchers/accounting/useProjectFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";

export default function AccountingDimensionForm({
  form,
  disabled
}: {
  form: UseFormReturn<any, any, undefined>;
  disabled?:boolean
}) {
  const { t } = useTranslation("common");
  const [projectsFetcher, onProjectChange] = useProjectFetcher();
  const [costCenterFetcher, onCostCenterChange] = useCostCenterFetcher();
  return (
    <AccordationLayout
      title={"Dimensiones Contables"}
      containerClassName=" col-span-full"
      className="create-grid"
    >
      <FormAutocomplete
        data={projectsFetcher.data?.projects || []}
        form={form}
        name="projectName"
        nameK={"name"}
        disabled={disabled}
        onValueChange={onProjectChange}
        label={t("project")}
        onSelect={(v) => {
          form.setValue("projectID", v.id);
        }}
      />
      <FormAutocomplete
        data={costCenterFetcher.data?.costCenters || []}
        form={form}
        name="costCenterName"
        nameK={"name"}
        onValueChange={onCostCenterChange}
        disabled={disabled}
        label={t("costCenter")}
        onSelect={(v) => {
          form.setValue("costCenterID", v.id);
        }}
      />
    </AccordationLayout>
  );
}
