import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
// import { Connection, ConnectionModule } from "~/types/connections";
import { components } from "~/sdk";
import { loader } from "../../route";
import Connections from "@/components/layout/connections";
import { setUpToolbarTab } from "~/util/hooks/ui/useSetUpToolbar";

export default function ReceiptConnectionsTab() {
  const { connections, receipt } = useLoaderData<typeof loader>();
  setUpToolbarTab(() => {
    return {};
  }, []);
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
                    receipt: receipt?.code,
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
