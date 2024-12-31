import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
// import { Connection, ConnectionModule } from "~/types/connections";
import { components } from "~/sdk";
import { loader } from "../../route";
import Connections from "@/components/layout/connections";

export default function OrderConnectionsTab() {
  const { connections, order } = useLoaderData<typeof loader>();
  return (
    <>
      <Suspense fallback={<FallBack />}>
        <Await resolve={connections}>
          {(data: any) => {
            const d =
              data.data as components["schemas"]["ResponseDataListPartyConnectionsBody"];
            return (
              <div>
                <Connections
                    data={d.result || []}
                    q={{
                      order_code:order?.code,
                      order_id:order?.id.toString(),
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

