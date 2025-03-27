import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { action, loader } from "../route";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { editGroupSchema } from "~/util/data/schemas/group-schema";
import { useEffect, useRef } from "react";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useEditFields } from "~/util/hooks/useEditFields";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { route } from "~/util/route";

type EditType = z.infer<typeof editGroupSchema>;
export default function GroupInfoTab() {
  const { group, actions } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const groupParty = params.party || "";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const r = route
  const [permission] = usePermission({ roleActions, actions });
  const fetcher = useFetcher<typeof action>();
  const allowEdit = permission.edit
  const {setRegister} = useSetupToolbarStore()
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editGroupSchema,
    defaultValues: {
      id: group?.id,
      name: group?.name,
      partyTypeGroup:groupParty,
    },
  });
  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e,
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

  useEffect(()=>{
    setRegister("tab",{
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    })
  },[hasChanged])
  

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
          <div className="detail-grid">
          <CustomFormFieldInput
              control={form.control}
              name="name"
              label={t("form.name")}
              inputType="input"
              allowEdit={allowEdit}
            />
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
