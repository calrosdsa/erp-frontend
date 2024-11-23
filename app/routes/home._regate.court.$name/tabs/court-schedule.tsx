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
      <div className=" flex space-x-3">
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => {
            updateCourtRate.onOpenDialog({
              court: court,
              title:"Editar precio por hora"
            });
          }}
        >
          <EditIcon size={13} />
        </Button>
        {/* <Button variant={"outline"} size={"icon"}
        onClick={() => {
            updateCourtRate.onOpenDialog({
              court: court,
              title:"Editar precio por hora"
            });
          }}
        >
          <TrashIcon size={13} />
        </Button> */}
      </div>
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
