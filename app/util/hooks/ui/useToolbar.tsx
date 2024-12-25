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
export type LoadingType = 'SAVE' | 'STATE' | '';

interface ToolbarStore {
  payload: SetupToolbarOpts;
  loading?: boolean;
  loadingType?: LoadingType
  isMounted: boolean;
  setLoading: (opts: {
    loading:boolean
    loadingType:LoadingType
  }) => void;
  setToolbar: (opts: SetupToolbarOpts) => void;
}
export const useToolbar = create<ToolbarStore>((set) => ({
  payload: {
  },
  isMounted: false,
  loading: false,
  setLoading: (opts) => set((state) => ({ loading: opts.loading,loadingType:opts.loadingType })),
  setToolbar: (opts) =>
    set((state) => ({
      payload: {
        ...state.payload,
        ...opts,
      },
    })),
}));
