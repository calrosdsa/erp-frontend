import { KanbanBoard } from "@/components/layout/kanban/kanban-board";
import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";

export default function CrmClient() {
  const {deals,stages} = useLoaderData<typeof loader>();
  return (
    <>
      <KanbanBoard
      stages={stages}
      data={deals}
      />
      {/* {JSON.stringify(stages)} */}
    </>
  );
}
