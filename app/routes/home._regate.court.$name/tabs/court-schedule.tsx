import { Await, useLoaderData } from "@remix-run/react";
import TimeSchedule from "../components/time-schedule";
import { loader } from "../route";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { components } from "~/sdk";
import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import { useUpdateCourtRate } from "../use-update-court-rate";

export default function CourtSchedule() {
  const { courtRates,court} = useLoaderData<typeof loader>();
  const updateCourtRate = useUpdateCourtRate();

  return (
    <div>
      
      <Suspense fallback={<FallBack />}>
        <Await resolve={courtRates}>
          {(courtRates: any) => {
            const vData =
              courtRates.data as any;
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
