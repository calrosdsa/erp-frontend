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

export type LoadingType = "SAVE" | "STATE" | "" | "SUBMIT" | "CANCEL";

interface ToolbarState {
  payload: SetupToolbarOpts;
  loading: boolean;
  loadingType: LoadingType;
  isMounted: boolean;
}

interface ToolbarActions {
  setLoading: (opts: { loading: boolean; loadingType: LoadingType }) => void;
  setToolbar: (opts: Partial<SetupToolbarOpts>) => void;
  updateToolbar: (opts: Partial<SetupToolbarOpts>) => void;
  setMounted: (e: boolean) => void;
  reset: () => void;
}

const initialState: ToolbarState = {
  payload: {},
  loading: false,
  loadingType: "",
  isMounted: false,
};

export const useToolbar = create<ToolbarState & ToolbarActions>((set) => ({
  ...initialState,
  setLoading: ({ loading, loadingType }) => set({ loading, loadingType }),
  setMounted: (e) =>
    set((state) => {
      return {
        isMounted: e,
      };
    }),
  setToolbar: (opts) =>
    set((state) => ({
      payload: {
        ...state.payload,
        ...opts,
      },
    })),
  updateToolbar: (opts) =>
      set((state) => ({
        payload: {
          ...state.payload,
          ...opts
        },
      })),
  reset: () => set(initialState),
}));
