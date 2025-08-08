import { Typography } from "@/components/typography";
import { useTranslation } from "react-i18next";
import { TaskData } from "~/util/data/schemas/task-schema";
import { StageSmartAutocomplete } from "~/util/hooks/fetchers/crm/use-stage.fetcher";
import { Entity } from "~/types/enums";
import { ProfileSmartField } from "~/util/hooks/fetchers/profile/profile-fetcher";
import { SmartField } from "@/components/form/smart-field";
import { useFormContext } from "@/components/form/form-provider";
import { ProjectSmartField, useProjectFetcher } from "~/util/hooks/fetchers/accounting/use-project-fetcher";
import { SmartAutocomplete } from "@/components/form/smart-autocomplete";


const taskPriorities = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];



export default function TaskForm({
  allowEdit,
  keyPayload,
}: {
  allowEdit: boolean;
  keyPayload: string;
}) {
  const { t } = useTranslation("common");
  const { form } = useFormContext();
  const formValues = form?.getValues() as TaskData;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SmartField name="title" label="Title" required />

        <SmartField
          name="priority"
          label="Priority"
          type="select"
          options={taskPriorities}
        />

        <StageSmartAutocomplete entityID={Entity.TASK} />

        <SmartField
          type="date"
          name="due_date"
          label="Due Date"
        />

        <ProfileSmartField
          name="assignee"
          label="Assignee"
        />

        <Typography variant="subtitle2" className="col-span-full">
          Project Details
        </Typography>

        <ProjectSmartField />

        <SmartField
          name="description"
          label="Description"
          type="textarea"
          className="col-span-full"
        />
      </div>
    </>
  );
}