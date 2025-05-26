import { useSearchParams } from "@remix-run/react";

export const useModalNav = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const openModal = (key: string, value: any, args?: Record<string, any>) => {
    searchParams.set(key, value);
    if (args) {
      Object.entries(args).forEach(([key, value]) => {
        searchParams.set(key, value);
      });
    }
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  return { searchParams, setSearchParams, openModal };
};
