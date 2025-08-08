import { create } from "zustand";
import { TaskData } from "~/util/data/schemas/task-schema";

interface Payload extends TaskData {
  onSave?: () => void;
  data?: Partial<TaskData>;
  onCancel?: () => void;
  enableEdit?: boolean;
  open?: boolean;
}

interface TaskStore {
  payload: Partial<Payload>;
  setData: (update: Partial<TaskData>) => void;
  editPayload: (update: Partial<Payload>) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  payload: {
    enableEdit: false,
  },
  setData: (update) =>
    set((state) => ({
      payload: {
        enableEdit: true,
        data: update,
      },
    })),
  editPayload: (update) =>
    set((state) => ({
      payload: {
        ...state.payload,
        ...update,
      },
    })),
}));