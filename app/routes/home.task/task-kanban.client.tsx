import { KanbanBoard } from "@/components/layout/kanban/kanban-board";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import TaskContentHeader from "./components/task-content-header";
import TaskCard from "./components/task-card";
import { DraggableLocation } from "@hello-pangea/dnd";
import { components } from "~/sdk";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { DEFAULT_ID } from "~/constant";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useState } from "react";
import ActivityDeadlineTab from "../home.activity/tab/activity-deadline-tab";
import { Entity } from "~/types/enums";

export default function TaskKanban() {
  const { tasks, stages, actions } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const appContext = useOutletContext<GlobalState>();
  const { roleActions } = appContext;
  const [searchParams, setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    actions: actions,
    roleActions: roleActions,
  });

  const [selectedTask, setSelectedTask] = useState<
    components["schemas"]["TaskDto"] | undefined
  >(undefined);

  const dataTransition = (
    source: DraggableLocation<string>,
    destination: DraggableLocation<string>,
    data: components["schemas"]["TaskDto"],
    srcColumn: string,
    tgtColumn: string
  ) => {
    const body: components["schemas"]["EntityTransitionData"] = {
      id: data.id,
      destination_index: destination.index,
      destination_stage_id: Number(destination.droppableId),
      source_index: source.index,
      source_stage_id: Number(source.droppableId),
      source_name: srcColumn,
      destination_name: tgtColumn,
    };
    fetcher.submit(
      {
        action: "task-transition",
        taskTransition: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  setUpToolbar(() => {
    return {
      titleToolbar: "Tasks",
    };
  });

  const openModal = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  return (
    <>
      {selectedTask && (
        <DrawerLayout
          open={selectedTask != undefined}
          onOpenChange={() => setSelectedTask(undefined)}
          className=""
        >
          <ActivityDeadlineTab
            partyID={selectedTask.id}
            partyName={selectedTask.title}
            entityID={Entity.TASK}
            appContext={appContext}
            defaultSelected={true}
            className="p-1"
            defaultFocused={true}
            onClose={() => setSelectedTask(undefined)}
          />
        </DrawerLayout>
      )}
      <ListLayout
        title="Tasks"
        {...(permission.create && {
          onCreate: () => {
            openModal(route.task, DEFAULT_ID);
          },
        })}
      >
        <div className="w-full relative">
          <KanbanBoard
            stages={stages}
            data={tasks}
            headerComponent={(tasks, stage) => {
              return (
                <TaskContentHeader
                  tasks={tasks}
                  stage={stage}
                  openModal={openModal}
                />
              );
            }}
            cardComponent={(task) => {
              return (
                <TaskCard
                  task={task}
                  openModal={openModal}
                  openActivity={(task) => setSelectedTask(task)}
                />
              );
            }}
            dataTransition={dataTransition}
          />
        </div>
      </ListLayout>
    </>
  );
}