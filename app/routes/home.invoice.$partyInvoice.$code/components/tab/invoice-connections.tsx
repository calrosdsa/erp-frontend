import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData, useParams } from "@remix-run/react";
import { Suspense } from "react";
// import { Connection, ConnectionModule } from "~/types/connections";
import { components } from "~/sdk";
import { loader } from "../../route";
import Connections from "@/components/layout/connections";
import { party } from "~/util/party";
import { setUpToolbarTab } from "~/util/hooks/ui/useSetUpToolbar";

export default function InvoiceConnectionsTab() {
  const { connections, invoice } = useLoaderData<typeof loader>();
  const params = useParams()
  const partyInvoice = params.partyInvoice ||""
  const p = party

   setUpToolbarTab(()=>{
      return {
      }
    },[])
  
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
                      ...(partyInvoice == p.purchaseInvoice && {
                        pi_id:invoice?.id.toString(),
                        pi_code:invoice?.code,
                      }),
                      ...(partyInvoice == p.saleInvoice && {
                        si_id:invoice?.id.toString(),
                        si_code:invoice?.code,
                      })
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

