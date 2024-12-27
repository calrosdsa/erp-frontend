import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
// import { Connection, ConnectionModule } from "~/types/connections";
import { components } from "~/sdk";
import Connections from "@/components/layout/connections";
import { loader } from "../route";

export default function PricingConnections() {
  const { connections, pricing } = useLoaderData<typeof loader>();
  return (
    <>
      <Suspense fallback={<FallBack />} >
        <Await resolve={connections}>
          {(data: any) => {
            const d =
              data.data as components["schemas"]["ResponseDataListPartyConnectionsBody"];
            return (
              <div>
                {/* {JSON.stringify(d)} */}
                <Connections
                    data={d?.result || []}
                    q={{
                      pricing:pricing?.id.toString(),
                    }}
                    />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

