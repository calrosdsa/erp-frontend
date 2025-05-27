import { journalEntryLineColumns } from "@/components/custom/table/columns/accounting/journal-entry-columns";
import { DataTable } from "@/components/custom/table/CustomTable";
import { useFormContext } from "@/components/form/form-provider";
import { SelectOption, SmartField } from "@/components/form/smart-field";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { dealTypes } from "~/data";
import { JournalEntryType, PartyType } from "~/gen/common";
import { GlobalState } from "~/types/app-types";
import { Permission } from "~/types/permission";
import { JournalEntrySchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import { useActionsFieldArray } from "~/util/hooks/use-actions-field-array";
import { usePermission } from "~/util/hooks/useActions";

export default function JournalEntryForm({
  permission,
}: {
  permission: Permission;
}) {
  const { form, isEditing, disableEdit, setIsEditing } =
    useFormContext<JournalEntrySchema>();
  const formValues = form?.getValues();
  const { t } = useTranslation("common");
  const allowEdit = permission.edit && isEditing;
  const [arrayFields, metaOptions] = useActionsFieldArray({
    control: form?.control,
    name: "lines",
    onChange: () => {
      setIsEditing(true);
    },
  });
  const { update } = arrayFields;

  const entryTypes: SelectOption[] = [
    {
      label: t("journalEntry"),
      value: PartyType[PartyType.journalEntry],
    },
    {
      label: t("cashEntry"),
      value: JournalEntryType[JournalEntryType.cashEntry],
    },
    {
      label: t("bankEntry"),
      value: JournalEntryType[JournalEntryType.bankEntry],
    },
    {
      label: t("creditCardEntry"),
      value: JournalEntryType[JournalEntryType.creditCardEntry],
    },
  ];

  const updateCell = (row: number, column: string, value: string) => {
    setIsEditing(true);
    let line = formValues?.lines[row] as any;
    if (line) {
      const currentValue = line[column];
      line[column] = typeof currentValue === "number" ? Number(value) : value;
      // form.setValue(`sections.${row}`,line)
      update(row, line);
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SmartField
          type="date"
          name="postingDate"
          label={t("form.postingDate")}
          required
        />
        <SmartField
          name="entryType"
          label={t("form.entryType")}
          type="select"
          options={entryTypes}
        />
        <div className="col-span-full">
          <DataTable
            data={formValues?.lines || []}
            columns={journalEntryLineColumns({
              allowEdit: isEditing,
            })}
            metaOptions={{

              meta: {
                ...metaOptions,                
                updateCell: updateCell,
                disableEdit:disableEdit,
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
