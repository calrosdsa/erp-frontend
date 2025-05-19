import { GlobalState } from "~/types/app-types";
import { action, loader } from "./route";
import { SerializeFrom } from "@remix-run/node";
import { route } from "~/util/route";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import {
  workSpaceSchema,
  WorkSpaceData,
} from "~/util/data/schemas/core/workspace-schema";
import { toast } from "sonner";
import { CREATE, DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import ActivityFeed from "../home.activity/components/activity-feed";
import { Entity } from "~/types/enums";
import WorkspaceForm from "./workspace-form";
import { SmartForm } from "@/components/form/smart-form";
import { useTranslation } from "react-i18next";
import { usePermission } from "~/util/hooks/useActions";
import { mapModuleDtoToItem } from "~/util/data/schemas/core/module-schema";

export const WorkSpaceInfo = ({
  appContext,
  data,
  load,
  closeModal,
  allowEdit,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  load: () => void;
  closeModal: () => void;
  allowEdit: boolean;
}) => {
  const key = route.workspace;
  const payload = useModalStore((state) => state.payload[key]) || {};
  const workspace = data?.result?.entity;
  const fetcher = useFetcher<typeof action>();

  const [searchParams, setSearchParams] = useSearchParams();
  const [toastID, setToastID] = useState<string | number>("");
  const id = searchParams.get(route.workspace);
  const paramAction = searchParams.get("action");
  const { t } = useTranslation("common");
  const onSubmit = (e: WorkSpaceData) => {
    console.log("ONSUBMIT", e);
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = payload.isNew ? "create-workspace" : "edit-workspace";
    fetcher.submit(
      {
        action,
        workspaceData: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRouteDetail(route.workspace, workspace?.id),
      }
    );
  };

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (id == DEFAULT_ID) {
          if (paramAction == CREATE) {
            closeModal();
          }
          if (fetcher.data?.workspace) {
            searchParams.set(
              route.workspace,
              fetcher.data?.workspace.id.toString()
            );
            setSearchParams(searchParams, {
              preventScrollReset: true,
              replace: true,
            });
          }
        } else {
          load();
        }
      },
    },
    [fetcher.data]
  );
  return (
    <div className="grid grid-cols-9 gap-3">
      <div className="col-span-4">
        <SmartForm
          isNew={payload.isNew || false}
          title={t("_customer.info")}
          schema={workSpaceSchema}
          keyPayload={key}
          defaultValues={{
            id: workspace?.id,
            name: workspace?.name || "",
            modules: workspace?.modules?.map((item) =>
              mapModuleDtoToItem(item)
            ),
          }}
          onSubmit={onSubmit}
        >
          <WorkspaceForm allowEdit={allowEdit} keyPayload={key} />
        </SmartForm>
      </div>
      {workspace?.id != undefined && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.result?.activities || []}
            partyID={workspace?.id}
            partyName={workspace.name}
            entityID={Entity.WORKSPACE}
          />
        </div>
      )}
    </div>
  );
};
