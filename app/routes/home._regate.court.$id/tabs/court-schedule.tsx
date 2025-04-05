import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import TimeSchedule from "../components/time-schedule";
import { loader } from "../route";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { setUpToolbarTab } from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";
import { SerializeFrom } from "@remix-run/node";
import { GlobalState } from "~/types/app-types";

export default function CourtSchedule({
    appContext,
    data,
  }: {
    data?:SerializeFrom<typeof loader>;
    appContext: GlobalState;
  }
) {
  
  return (
    <div>
      <TimeSchedule courtRates={data?.courtRates || []} />
    </div>
  );
}
