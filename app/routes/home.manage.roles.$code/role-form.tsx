import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";
import { useTranslation } from "react-i18next";
import { OpenModalFunc } from "~/types";
import { GlobalState } from "~/types/app-types";
import { RoleSchema } from "~/util/data/schemas/manage/role-schema";
import { WorkspaceForm } from "~/util/hooks/fetchers/core/use-workspace-fetcher";
import { route } from "~/util/route";

export default function RoleForm({
  allowEdit,
  openModal,
  appContext,
}: {
  allowEdit: boolean;
  openModal: OpenModalFunc;
  appContext:GlobalState
}) {
  const key = route.role;
  const { form, isEditing, hasChanged } = useFormContext<RoleSchema>();
  const formValues = form?.getValues();
  const { t } = useTranslation("common");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
      <SmartField name="code" label={t("form.name")} required={true} />
      <SmartField
        name="description"
        label={t("form.description")}
        required={true}
      />
      <WorkspaceForm openModal={openModal}
      roleActions={appContext.roleActions} />
    </div>
  );
}
