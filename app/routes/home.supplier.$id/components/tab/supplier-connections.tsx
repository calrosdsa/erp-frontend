
import Connections from "@/components/layout/connections";
import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData, useNavigate } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Connection, ConnectionModule } from "~/types/connections";
import { components } from "~/sdk";
import { PartyType, partyTypeToJSON, RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { route } from "~/util/route";
import { loader } from "../../route";


export default function CustomerConnections() {
  const {connections,customer} = useLoaderData<typeof loader>()
  return (
    <>
        <Suspense fallback={<FallBack />}>
            <Await resolve={connections}>
              {(data: any) => {
                // const d =
                // data.data as components["schemas"]["ResponseDataListPartyConnectionsBody"];
                // const relateds = customerConnections({
                //   data:d.result  || [],
                //   customer:customer
                // });
                return (
                  <div>
                    {JSON.stringify(data)}
                    {/* <Connections
                    connections={relateds}
                    /> */}
                  </div>
                );
              }}
            </Await>
          </Suspense>
     </>
    );
  }

const customerConnections = ({data,customer}:{
   data:components["schemas"]["PartyConnections"][]
   customer?:components["schemas"]["CustomerDto"]
}): ConnectionModule[] => {
  const { t } = useTranslation("common");
  let res: ConnectionModule[] = [];
  let connections:Connection[] = []
  const r = route
  const navigate = useNavigate()
  connections.push({
    entity: "Reservas",
    href: r.toBookings({
        "party":customer?.id.toString(),
        "partyName":customer?.name,
    }),
    count:data.find(t=>t.party_type == regatePartyTypeToJSON(RegatePartyType.booking))?.connections,
    add: () => {
      console.log("NAVIGATE")
      navigate(r.toCreateBooking())
    },
  })

  connections.push({
    entity: partyTypeToJSON(PartyType.saleOrder),
    href: "",
    count:data.find(t=>t.party_type == partyTypeToJSON(PartyType.saleOrder))?.connections,
    add: () => {
      navigate(r.toCreateOrder(PartyType.saleOrder))
    },
  })

  res.push({
    title:"Relacionados",
    connections:connections,
  });
//   res.push(payment)
  return res;
};
