import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { components } from "~/sdk";
import { route } from "~/util/route";

interface TaskContentHeaderProps {
  tasks: components["schemas"]["TaskDto"][];
  stage: components["schemas"]["StageDto"];
  openModal: (key: string, value: string) => void;
}

export default function TaskContentHeader({
  tasks,
  openModal,
}: TaskContentHeaderProps) {
  
  const taskCount = useMemo(() => {
    return tasks.length;
  }, [tasks]);

  return (
    <div className="p-2">
      <div className="flex justify-center py-2">
        <span className="text-xl">
          {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>

      <Button
        className="w-full rounded-full"
        variant={"outline"}
        onClick={() => {
          // TODO: Implement task creation modal when task route is available
          openModal(route.task, "0");
        }}
      >
        <span>Create Task</span>
        <PlusIcon />
      </Button>
    </div>
  );
}