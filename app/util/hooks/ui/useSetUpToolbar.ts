import { DependencyList, useCallback, useEffect } from "react";
import { LoadingType, SetupToolbarOpts, useToolbar } from "./useToolbar";

export const setUpToolbar = (
  opts: (opts:SetupToolbarOpts) => SetupToolbarOpts,
  dependencyList: DependencyList = []
) => {
  const toolbar = useToolbar();
  const setUpToolbar = () => {
    toolbar.setToolbar(opts(toolbar.payload));
  };
  useEffect(() => {
    setUpToolbar();
  }, dependencyList);
};

// export const setLoadingToolbar = (
//   loading: boolean,
//   dependencyList: DependencyList = []
// ) => {
//   const toolbar = useToolbar();
//   useEffect(() => {
//     toolbar.setLoading(loading);
//   }, dependencyList);
// };

export function useLoadingTypeToolbar(
  opts:{
    loadingType: LoadingType,
    loading: boolean, 
  },
  dependencyList: DependencyList = []
) {
  const toolbar = useToolbar();

  const setToolbarLoading = useCallback(() => {
    toolbar.setLoading({
      ...opts
    });
  }, [toolbar, opts]);

  useEffect(() => {
    setToolbarLoading();

    return () => {
      // Clean up by resetting loading state when the component unmounts
      toolbar.setLoading({
        loading:false,
        loadingType:"",
      });
    };
  }, [...dependencyList]);

  // Return the setToolbarLoading function in case it needs to be called manually
  // return setToolbarLoading;
}