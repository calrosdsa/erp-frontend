import { create } from "zustand";
import { EventState, State } from "~/gen/common";
import { ButtonToolbar } from "~/types/actions";
export interface SetupToolbarOpts {
  actions?: ButtonToolbar[];
  buttons?: ButtonToolbar[];
  view?: ButtonToolbar[];
  viewTitle?:string
  status?: State;
  title?: string;
  onChangeState?: (event: EventState) => void;
  onSave?: () => void;
  disabledSave?: boolean;
  addNew?: () => void;
}

interface ToolbarStore {
  actions: ButtonToolbar[];
  buttons: ButtonToolbar[];
  view: ButtonToolbar[];
  viewTitle?:string
  isMounted: boolean;
  title?: string;
  loading?: boolean;
  status?: State;
  disabledSave?: boolean;
  onChangeState?: (event: EventState) => void;
  onSave?: () => void;
  addNew?: () => void;
  resetState: () => void;
  setLoading: (loading: boolean) => void;
  setToolbar: (opts: SetupToolbarOpts) => void;
}
export const useToolbar = create<ToolbarStore>((set) => ({
  actions: [],
  buttons: [],
  view: [],
  viewTitle:undefined,
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
      buttons: opts.buttons || [],
      view: opts.view || [],
      viewTitle:opts.viewTitle,
      title: opts.title,
      status: opts.status,
      disabledSave: opts.disabledSave,
      onSave: opts.onSave,
      addNew: opts.addNew,
      onChangeState: opts.onChangeState,
    })),
}));
