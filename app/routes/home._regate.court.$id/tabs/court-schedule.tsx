import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import TimeSchedule from "../components/time-schedule";
import { loader } from "../route";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { setUpToolbarTab } from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";

export default function CourtSchedule() {
  const fetcherLoader = useFetcher<typeof loader>({key:route.court});
  
  const data = fetcherLoader.data;
  return (
    <div>
      <TimeSchedule courtRates={data?.courtRates || []} />
    </div>
  );
}
