import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { editCourtSchema } from "~/util/data/schemas/regate/court-schema";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import {
  setUpToolbar,
  setUpToolbarTab,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { useEditFields } from "~/util/hooks/useEditFields";
import { route } from "~/util/route";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { Entity } from "~/types/enums";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { SerializeFrom } from "@remix-run/node";
import { setUpModalTabPage } from "@/components/ui/custom/modal-layout";

type EditType = z.infer<typeof editCourtSchema>;
export default function CourtInfoTab({
  appContext,
  data,
}: {
  data?:SerializeFrom<typeof loader>;
  appContext: GlobalState;
}) {
  const { t } = useTranslation("common");
  const court = data?.court;
  const key = route.court
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });
  const fetcher = useFetcher<typeof action>();
  const defaultValues = {
    name: court?.name,
    courtID: court?.id,
  } as EditType;
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editCourtSchema,
    defaultValues: defaultValues,
  });
  const { setRegister } = useSetupToolbarStore();
  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit-court",
        editCourt: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action:route.toRoute({
          main:route.court,
          routeSufix:[court?.id.toString() || ""]
        })
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

  setUpModalTabPage(key,()=>{
    return {
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !hasChanged,
    }
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
    <div className="grid grid-cols-9 gap-3">
      <div className="col-span-4">
        <FormLayout>
          <Form {...form}>
            <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
              <input className="hidden" type="submit" ref={inputRef} />
              <div className="grid md:grid-cols-2 gap-3">
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
                        inputType="input"
                        title={t("form.name")}
                        readOnly={!permission?.edit}
                      />
                    );
                  }}
                />

                {/* <DisplayTextValue title={t("_item.code")} value={item?.code} />
  
              <DisplayTextValue
                title={t("form.item-group")}
                value={item?.group_name}
                to=""
              />
  
              <DisplayTextValue title={t("form.uom")} value={item?.uom_name} /> */}
              </div>
            </fetcher.Form>
          </Form>
        </FormLayout>
      </div>

       {court?.id && (
              <div className=" col-span-5">
                <ActivityFeed
                  appContext={appContext}
                  activities={data?.activities || []}
                  partyID={court?.id}
                  partyName={court?.name}
                  entityID={Entity.COURT}
                />
              </div>
            )}
    </div>
  );
}
