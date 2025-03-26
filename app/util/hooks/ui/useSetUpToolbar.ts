import {
  DependencyList,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LoadingType, SetupToolbarOpts, useToolbar } from "./use-toolbar";
import { create } from "zustand";

export const setUpToolbar = (
  opts: (currentOpts: SetupToolbarOpts) => Partial<SetupToolbarOpts>,
  dependencies: DependencyList = []
) => {
  const { payload, isMounted, setToolbar, reset } = useToolbar();

  useEffect(() => {
    const newOpts = opts(payload);
    setToolbar(newOpts);
    return () => {
      console.log("RESET TOOLBAR...");
      reset();
    };
  }, dependencies);
};

export const setUpToolbarDetailPage = (
  opts: (currentOpts: SetupToolbarOpts) => Partial<SetupToolbarOpts>,
  dependencies: DependencyList = []
) => {
  const { payload, isMounted, setToolbar, reset } = useToolbar();

  useEffect(() => {
    if (isMounted) {
      console.log("MOUNTED DETAIL PAGE");
      const newOpts = opts(payload);
      setToolbar(newOpts);
      return () => {
        console.log("CLEAN UP DETAIL PAGE");
        reset();
      };
    }
  }, [...dependencies, isMounted]);
};

export const setUpToolbarTab = (
  opts: () => Partial<SetupToolbarOpts>,
  dependencies: DependencyList = []
) => {
  const { isMounted, setToolbar, reset, setMounted } = useToolbar();

  useEffect(() => {
    console.log("MOUNTED TAB");
    setMounted(true);
    const newOpts = opts();
    setToolbar(newOpts);
    return () => {
      console.log("CLEAN UP TAB");
      setMounted(false);
    };
  }, dependencies);
};

type ToolbarState = {
  loading: boolean;
  loadingType: LoadingType;
};

export function useLoadingTypeToolbar(
  initialOpts: ToolbarState,
  dependencyList: DependencyList = []
) {
  const toolbar = useToolbar();
  const optsRef = useRef(initialOpts);

  // Update the ref if initialOpts changes
  useEffect(() => {
    optsRef.current = initialOpts;
  }, [initialOpts]);

  const setToolbarLoading = useCallback(
    (newOpts?: Partial<ToolbarState>) => {
      const updatedOpts = { ...optsRef.current, ...newOpts };
      optsRef.current = updatedOpts;
      toolbar.setLoading(updatedOpts);
    },
    [toolbar]
  );

  useEffect(() => {
    setToolbarLoading();
    return () => {
      // Clean up by resetting loading state when the component unmounts
      toolbar.setLoading({
        loading: false,
        loadingType: "",
      });
    };
  }, [...dependencyList]);

  // Return an object with the current state and setter function
  return {
    toolbarState: optsRef.current,
    setToolbarLoading,
  };
}

export const setUpToolbarRegister = (
  opts: () => Partial<SetupToolbarOpts>,
  dependencies: DependencyList = []
) => {
  const { setToolbar, reset } = useToolbar();
  const { registers, resetRegisters } = useSetupToolbarStore();

  useEffect(() => {
    const newOpts = opts();

    // Combine all register options
    const optionsFromRegisters = Object.values(registers).reduce(
      (acc, register) => ({
        ...acc,
        ...register,
      }),
      {}
    );

    // Merge new options with register options
    setToolbar({ ...newOpts, ...optionsFromRegisters });

    return () => {
      reset();
    };
  }, [...dependencies, registers]);

  // Return the store actions for external use if needed
  return useSetupToolbarStore;
};

interface SetUpToolbarStore {
  registers: Record<string, Partial<SetupToolbarOpts>>;
  setRegister: (key: string, opts: Partial<SetupToolbarOpts>) => void;
  resetRegisters: () => void;
}

// Create the Zustand store
export const useSetupToolbarStore = create<SetUpToolbarStore>((set) => ({
  registers: {},
  setRegister: (key, opts) =>
    set((state) => ({
      registers: {
        ...state.registers,
        // [key]: state.registers[key] ? state.registers[key] : opts,
        [key]: opts,
      },
    })),
  resetRegisters: () => set({ registers: {} }),
}));
