import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import { useRef } from "react";
import { setUpToolbarTab, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { EventState, State, stateFromJSON } from "~/gen/common";
import {
    mapToModuleSectionSchema,
  moduleDataSchema,
  ModuleDataType,
} from "~/util/data/schemas/core/module-schema";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import ModuleData from "~/routes/home.module.new/module-data";

export default function ModuleInfo() {
  const { module, sections, actions } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const status = stateFromJSON(module?.status);
  const fetcher = useFetcher<typeof action>();
  const allowEdit = permission.edit
  const { form, updateRef } = useEditFields<ModuleDataType>({
    schema: moduleDataSchema,
    defaultValues: {
        id:module?.id,
        icon_code:module?.icon_code,
        icon_name:module?.icon_name,
        href:module?.href,
        label:module?.label,
        sections:sections?.map(t=>mapToModuleSectionSchema(t,module?.id || 0)) || [],
        has_direct_access:module?.has_direct_access,
        priority:module?.priority,
    },
  });

  const onSubmit = (e: ModuleDataType) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

    
  

  setUpToolbarTab(() => {
  
    return {
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    };
  }, [module,allowEdit]);

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
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
    <div>
      <ModuleData
      form={form}
      fetcher={fetcher}
      inputRef={inputRef}
      allowEdit={permission.edit}
      onSubmit={onSubmit}
      />
    </div>
  );
}
