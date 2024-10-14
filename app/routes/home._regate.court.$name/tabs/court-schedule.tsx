import { Await, useLoaderData } from "@remix-run/react";
import TimeSchedule from "../components/time-schedule";
import { loader } from "../route";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { components } from "~/sdk";


export default function CourtSchedule(){
    const { courtRates } = useLoaderData<typeof loader>();

    return (
        <div>
            <Suspense fallback={<FallBack />}>
            <Await resolve={courtRates}>
              {(courtRates:any) => {
                const vData =courtRates.data as components["schemas"]["EntityResponseResultEntityListCourtRateDtoBody"];
                const { result } =  vData
                return (
                    <div>
                        <TimeSchedule
                        courtRates={result.entity}
                            />
                    </div>
                );
            }}
            </Await>
          </Suspense>
        </div>
    )
}