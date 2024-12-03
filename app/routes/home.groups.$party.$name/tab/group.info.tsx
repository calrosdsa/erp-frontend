import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { action, loader } from "../route";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { z } from "zod";
import { editGroupSchema } from "~/util/data/schemas/group-schema";
import { useRef } from "react";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { useEditFields } from "~/util/hooks/useEditFields";

type EditType = z.infer<typeof editGroupSchema>;
export default function GroupInfoTab() {
  const { group, actions } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const groupParty = params.party || "";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const defaultValues = {
    name: group?.name,
    groupID: group?.id,
    partyTypeGroup: groupParty,
  } as EditType;
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editGroupSchema,
    defaultValues: defaultValues,
  });
  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit-group",
        editGroup: e,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );
  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <input className="hidden" type="submit" ref={inputRef} />
          <div className="info-grid">
          <CustomFormField
              form={form}
              name="name"
              children={(field) => {
                return (
                  <DisplayTextValue
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("name");
                    }}
                    title={t("form.name")}
                    readOnly={!permission?.edit}
                  />
                );
              }}
            />

            {/* {group &&
                  <DisplayTextValue
                  title={t("table.createdAt")}
                  value={formatLongDate(group.created_at,i18n.language)}
                  />
                } */}
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
