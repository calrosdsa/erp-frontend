import { DependencyList, useCallback, useEffect } from "react";
import { LoadingType, SetupToolbarOpts, useToolbar } from "./useToolbar";



export const setUpToolbar = (
  opts: (currentOpts: SetupToolbarOpts) => Partial<SetupToolbarOpts>,
  dependencies: DependencyList = []
) => {
  const { payload, setToolbar, reset } = useToolbar()

  useEffect(() => {
    const newOpts = opts({})
    console.log("NEW PAYLOAD",newOpts)
    setToolbar(newOpts)


    return () => {
      console.log("UNMOUNT...")
      reset()
    }
  }, dependencies)
}


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
