import { create } from "zustand";
import { EventState, State } from "~/gen/common";
import { ButtonToolbar } from "~/types/actions";
export interface SetupToolbarOpts {
  actions?: ButtonToolbar[];
  buttons?: ButtonToolbar[];
  view?: ButtonToolbar[];
  viewTitle?: string;
  status?: State;
  titleToolbar?: string;
  onChangeState?: (event: EventState) => void;
  onSave?: () => void;
  disabledSave?: boolean;
  addNew?: () => void;
  triggerTabs?: boolean;
}

interface ToolbarStore {
  payload: SetupToolbarOpts;
  loading?: boolean;
  isMounted: boolean;
  setLoading: (loading: boolean) => void;
  setToolbar: (opts: SetupToolbarOpts) => void;
}
export const useToolbar = create<ToolbarStore>((set) => ({
  payload: {},
  isMounted: false,
  loading: false,
  setLoading: (e) => set((state) => ({ loading: e })),
  setToolbar: (opts) =>
    set((state) => ({
      payload: opts,
    })),
}));
