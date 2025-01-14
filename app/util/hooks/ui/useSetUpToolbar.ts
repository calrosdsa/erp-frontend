import { DependencyList, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { LoadingType, SetupToolbarOpts, useToolbar } from "./useToolbar";

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
      const newOpts = opts(payload);
      setToolbar(newOpts);
      return () => {
        console.log("RESET TOOLBAR...");
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
    setMounted(true);
    const newOpts = opts();
    setToolbar(newOpts);
    return () => {
      console.log("RESET TAB...");
      setMounted(false);
    };
  }, dependencies);
};

type ToolbarState = {
  loading: boolean
  loadingType: LoadingType
}

export function useLoadingTypeToolbar(
  initialOpts: ToolbarState,
  dependencyList: DependencyList = []
) {
  const toolbar = useToolbar()
  const optsRef = useRef(initialOpts)

  // Update the ref if initialOpts changes
  useEffect(() => {
    optsRef.current = initialOpts
  }, [initialOpts])

  const setToolbarLoading = useCallback((newOpts?: Partial<ToolbarState>) => {
    const updatedOpts = { ...optsRef.current, ...newOpts }
    optsRef.current = updatedOpts
    toolbar.setLoading(updatedOpts)
  }, [toolbar])

  useEffect(() => {
    setToolbarLoading()

    return () => {
      // Clean up by resetting loading state when the component unmounts
      toolbar.setLoading({
        loading: false,
        loadingType: '',
      })
    }
  }, [...dependencyList])

  // Return an object with the current state and setter function
  return {
    toolbarState: optsRef.current,
    setToolbarLoading,
  }
}
