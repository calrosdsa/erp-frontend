import StagesHeader from "../home.stage/components/stages-header";
import TaskInfoTab from "./tab/task-info";

import ModalLayout from "@/components/ui/custom/modal-layout";
import { GlobalState } from "~/types/app-types";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";

import { TaskViewModel } from "./task-viewmodel";

export default function TaskModal({ appContext }: { appContext: GlobalState }) {
  const {
    key,
    data,
    stages,
    load,
    task,
    loading,
    setOpen,
    open,
    taskTransition,
    payload,
    tab,
    searchParams,
    setSearchParams,
    permission,
  } = TaskViewModel({
    appContext: appContext,
  });

  return (
    <div>
      <ModalLayout
        keyPayload={key}
        open={open}
        onOpenChange={(e) => {
          setOpen(e);
        }}
      >
        <StagesHeader
          stages={stages || []}
          selectedStageID={0} // TODO: Use actual stage ID when available
          transition={taskTransition}
        />
        {loading && !data ? (
          <LoadingSpinner />
        ) : (
          <>
              <>
              <TabNavigation
                defaultValue={tab}
                onValueChange={(value) => {
                  searchParams.set("tab", value);
                  setSearchParams(searchParams, {
                    preventScrollReset: true,
                  });
                }}
                items={[
                  {
                    label: "Info",
                    value: "info",
                    children: (
                      <>
                      <TaskInfoTab
                        appContext={appContext}
                        data={data}
                        keyPayload={key}
                        load={load}
                        permission={permission}
                        />
                        </>
                    ),
                  },
                ]}
              />
                </>
          </>
        )}
      </ModalLayout>
    </div>
  );
}