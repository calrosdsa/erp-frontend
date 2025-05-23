import AccordationLayout from "@/components/layout/accordation-layout";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCostCenterFetcher } from "~/util/hooks/fetchers/accounting/useCostCenterFetcher";
import { useProjectFetcher } from "~/util/hooks/fetchers/accounting/useProjectFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";
import FormAutocompleteField from "../../select/form-autocomplete";
import { components } from "~/sdk";
import { OpenModalFunc } from "~/types";
import { useNavigate } from "@remix-run/react";
import { route } from "~/util/route";

export default function AccountingDimensionForm({
  form,
  allowEdit,
  openModal,
}: {
  form: UseFormReturn<any, any, undefined>;
  allowEdit?: boolean;
  openModal: OpenModalFunc;
}) {
  const { t } = useTranslation("common");
  const [projectsFetcher, onProjectChange] = useProjectFetcher();
  const [costCenterFetcher, onCostCenterChange] = useCostCenterFetcher();
  const formValues = form.getValues();
  const navigate = useNavigate();
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
        {...(formValues.project?.id && {
          navigate: () => {
            navigate(
              route.toRouteDetail(route.project, formValues.project.name, {
                tab: "info",
                id: formValues.project.id,
              })
            );
            // openModal(route.customer, formValues.party.id);
          },
        })}
      />
      <FormAutocompleteField
        data={costCenterFetcher.data?.costCenters || []}
        form={form}
        name="costCenter"
        nameK={"name"}
        onValueChange={onCostCenterChange}
        allowEdit={allowEdit}
        label={t("costCenter")}
        {...(formValues.costCenter?.id && {
          navigate: () => {
            navigate(
              route.toRouteDetail(route.costCenter, formValues.costCenter.name, {
                tab: "info",
                id: formValues.costCenter.id,
              })
            );
            // openModal(route.customer, formValues.party.id);
          },
        })}
      />
    </AccordationLayout>
  );
}
