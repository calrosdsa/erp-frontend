import { DependencyList, useCallback, useEffect, useLayoutEffect } from "react";
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

export function useLoadingTypeToolbar(
  opts: {
    loadingType: LoadingType;
    loading: boolean;
  },
  dependencyList: DependencyList = []
) {
  const toolbar = useToolbar();

  const setToolbarLoading = useCallback(() => {
    toolbar.setLoading({
      ...opts,
    });
  }, [toolbar, opts]);

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

  // Return the setToolbarLoading function in case it needs to be called manually
  // return setToolbarLoading;
}
