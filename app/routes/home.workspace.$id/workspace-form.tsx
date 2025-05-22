import { moduleSelectionColumn } from "@/components/custom/table/columns/core/module-columns";
import { DataTable } from "@/components/custom/table/CustomTable";
import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";

import { useTranslation } from "react-i18next";
import { WorkSpaceData } from "~/util/data/schemas/core/workspace-schema";
import { useActionsFieldArray } from "~/util/hooks/use-actions-field-array";

import { route } from "~/util/route";

export default function WorkspaceForm({
  allowEdit,
  keyPayload,
}: {
  allowEdit: boolean;
  keyPayload: string;
}) {
  const { form, isEditing, hasChanged, setIsEditing } =
    useFormContext<WorkSpaceData>();
  const formValues = form?.getValues();
  const { t } = useTranslation("common");
  const [arrayFields, metaOptions] = useActionsFieldArray({
    control: form?.control,
    name: "modules",
    onChange: () => {
      setIsEditing(true);
    },
  });
  const { update } = arrayFields;
  const updateCell = (row: number, column: string, value: string) => {
    setIsEditing(true);
    let module = formValues?.modules[row] as any;
    if (module) {
      module[column as keyof any] = value;
      // form.setValue(`sections.${row}`,module)
      update(row, module);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SmartField name="name" label={t("form.name")} required={true} />
      <div className="col-span-full">
        <DataTable
          data={formValues?.modules || []}
          columns={moduleSelectionColumn({
            allowEdit: isEditing,
          })}
          metaOptions={{
            meta: {
              ...metaOptions,

              updateCell: updateCell,
            },
          }}
        />
      </div>
    </div>
  );
}
