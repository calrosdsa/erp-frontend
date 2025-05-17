import { GlobalState } from "~/types/app-types";
import { action, loader } from "./route";
import { SerializeFrom } from "@remix-run/node";
import { route } from "~/util/route";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { workSpaceSchema, WorkSpaceData } from "~/util/data/schemas/core/workspace-schema";
import { toast } from "sonner";
import { CREATE, DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import ActivityFeed from "../home.activity/components/activity-feed";
import { Entity } from "~/types/enums";
import WorkspaceForm from "./workspace-form";
import { SmartForm } from "@/components/form/smart-form";
import { useTranslation } from "react-i18next";

export const WorkSpaceInfo = ({
    appContext,
      data,
      load,
      closeModal,
    }: {
      appContext: GlobalState;
      data?: SerializeFrom<typeof loader>;
      load: () => void;
      closeModal: () => void;
    }
) =>{
    const key = route.workspace;
    const payload = useModalStore((state) => state.payload[key]) || {};
    const workspace = data?.result?.entity;
    const fetcher = useFetcher<typeof action>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [toastID, setToastID] = useState<string | number>("");
    const id = searchParams.get(route.workspace);
    const paramAction = searchParams.get("action");
    const {t} = useTranslation("common")
  
    const onSubmit = (e: WorkSpaceData) => {
      console.log("ONSUBMIT", e);
      const id = toast.loading(LOADING_MESSAGE);
      setToastID(id);
      let action = payload.isNew ? "create-workspace" : "edit-workspace";
      fetcher.submit(
        {
          action,
          customerData: e,
        },
        {
          method: "POST",
          encType: "application/json",
          action: route.toRoute({
            main: route.workspace,
            routeSufix: [workspace?.id.toString() || ""],
          }),
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
    return(
    <div className="grid grid-cols-9 gap-3">
          <div className="col-span-4">
            <SmartForm
              isNew={payload.isNew || false}
              title={t("_customer.info")}
              schema={workSpaceSchema}
              keyPayload={key}
              defaultValues={{
                name: workspace?.name || "",
              }}
              onSubmit={onSubmit}
            >
              <WorkspaceForm />
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
    )
}