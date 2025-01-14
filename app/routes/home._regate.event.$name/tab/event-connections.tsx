import Connections from "@/components/layout/connections";
import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData, useNavigate } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Connection, ConnectionModule } from "~/types/connections";
import { loader } from "../route";
import { components } from "~/sdk";
import { RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { route } from "~/util/route";


export default function EventConnectionsTab() {
  const {connections,event} = useLoaderData<typeof loader>()
  return (
    <>
        <Suspense fallback={<FallBack />}>
            <Await resolve={connections}>
              {(data: any) => {
                const d =
                data.data as components["schemas"]["ResponseDataListPartyConnectionsBody"];
                const relateds = eventConnections({
                  data:d.result  || [],
                  event:event
                });
                return (
                  <div>
                    
                    <Connections
                    connections={relateds}
                    />
                  </div>
                );
              }}
            </Await>
          </Suspense>
     </>
    );
  }

const eventConnections = ({data,event}:{
   data:components["schemas"]["PartyConnections"][]
   event?:components["schemas"]["EventBookingDto"]
}): ConnectionModule[] => {
  const { t } = useTranslation("common");
  let res: ConnectionModule[] = [];
  let connections:Connection[] = []
  const r = route
  const navigate = useNavigate()
  connections.push({
    entity: regatePartyTypeToJSON(RegatePartyType.booking),
    href: r.toBookings({
      "event":event?.id.toString(),
      "eventName":event?.name.toString()
    }),
    count:data.find(t=>t.party_type == regatePartyTypeToJSON(RegatePartyType.booking))?.connections,
    add: () => {
      console.log("NAVIGATE")
      navigate(r.toCreateBooking())
    },
  })
  // data.map((t)=>{
  //   if(t.party_type == regatePartyTypeToJSON(RegatePartyType.booking)){
  //     connections.push({
  //       entity: regatePartyTypeToJSON(RegatePartyType.booking),
  //       count:t.connections,
  //       href: r.toBookings({
  //         "event":event?.id.toString(),
  //         "eventName":event?.name.toString()
  //       }),
  //       add: () => {
  //         console.log("NAVIGATE")
  //         navigate(r.toCreateBooking())
  //       },
  //     })
  //   }
  // })

  res.push({
    title:"Relacionados",
    connections:connections,
  });
//   res.push(payment)
  return res;
};
