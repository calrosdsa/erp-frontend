import { create } from "zustand";
import { EventState, State } from "~/gen/common";
import { ActionToolbar } from "~/types/actions";
export interface SetupToolbarOpts {
  actions?: ActionToolbar[];
  status?: State;
  title?: string;
  onChangeState?: (event: EventState) => void;
  onSave?: () => void;
}

interface ToolbarStore {
  actions: ActionToolbar[];
  isMounted: boolean;
  title?: string;
  loading?: boolean;
  status?: State;
  onChangeState?: (event: EventState) => void;
  onSave?: () => void;
  resetState: () => void;
  setLoading: (loading: boolean) => void;
  setToolbar: (opts: SetupToolbarOpts) => void;
}
export const useToolbar = create<ToolbarStore>((set) => ({
  actions: [],
  isMounted: false,
  title: undefined,
  status: undefined,
  loading: false,
  setLoading: (e) => set((state) => ({ loading: e })),
  resetState: () =>
    set((state) => ({
      actions: [],
      title: undefined,
      status: undefined,
    })),
  setToolbar: (opts) =>
    set((state) => ({
      isMounted: true,
      actions: opts.actions || [],
      title: opts.title,
      status: opts.status,
      onSave: opts.onSave,
      onChangeState: opts.onChangeState,
    })),
}));
