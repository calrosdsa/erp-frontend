import { Await, useLoaderData } from "@remix-run/react";
import TimeSchedule from "../components/time-schedule";
import { loader } from "../route";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { setUpToolbarTab } from "~/util/hooks/ui/useSetUpToolbar";

export default function CourtSchedule() {
  const { courtRates, court } = useLoaderData<typeof loader>();
  setUpToolbarTab(() => {
    return {};
  }, []);
  return (
    <div>
      <Suspense fallback={<FallBack />}>
        <Await resolve={courtRates}>
          {(courtRates: any) => {
            const vData = courtRates.data as any;
            const { result } = vData;
            return (
              <div>
                <TimeSchedule courtRates={result || []} />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
