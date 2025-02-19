import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { components } from "~/sdk";
import { route } from "~/util/route";

export const useProfileFetcher = () => {
  const r = route;
//   const fetcherDebounce = useDebounceFetcher<{
//     actions: components["schemas"]["ActionDto"][];
//     results: components["schemas"]["PricingDto"][];
//   }>();

//   const onChange = (e: string) => {
//     fetcherDebounce.submit(
//       {
//         query:{
//             code:`["like","${e}"]`,
//             size:DEFAULT_SIZE,
//         } as operations["pricings"]["parameters"]["query"],
//         action: "get",
//       },
//       {
//         method: "POST",
//         encType: "application/json",
//         debounceTimeout: DEFAULT_DEBOUNCE_TIME,
//         action: r.toRoute({
//           main: r.p.pricing,
//         }),
//       }
//     );
//   };
//   return [fetcherDebounce, onChange] as const;
};
