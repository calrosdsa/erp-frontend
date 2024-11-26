import Connections from "@/components/layout/connections";
import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Connection, ConnectionModule } from "~/types/connections";
import { components } from "~/sdk";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";
import { routes } from "~/util/route";
import { loader } from "../../route";


export default function OrderConnectionsTab() {
  const {connections,order} = useLoaderData<typeof loader>()
  return (
    <>
        <Suspense fallback={<FallBack />}>
            <Await resolve={connections}>
              {(data: any) => {
                const d =
                data.data as components["schemas"]["ResponseDataListPartyConnectionsBody"];
                const relateds = orderConnections({
                  data:d.result  || [],
                  order:order
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

const orderConnections = ({data,order}:{
   data:components["schemas"]["PartyConnections"][]
   order?:components["schemas"]["OrderDto"]
}): ConnectionModule[] => {
  const { t } = useTranslation("common");
  const params= useParams()
  const partyType = partyTypeFromJSON(params.partyOrder)
  let res: ConnectionModule[] = [];
  let connections:Connection[] = []
  const r = routes
  const navigate = useNavigate()
  connections.push({
    entity: t(partyTypeToJSON(PartyType.purchaseInvoice)),
    href: "",
    count:data.find(t=>t.party_type == partyTypeToJSON(PartyType.purchaseInvoice))?.connections,
    add: () => {
      // navigate(r.toCreateInvoice(partyType))
    },
  })

  connections.push({
    entity: t(partyTypeToJSON(PartyType.purchaseReceipt)),
    href: r.toReceipts(PartyType.purchaseReceipt,{
        "orderCode":order?.code,
        "order":order?.id.toString(),
    }),
    count:data.find(t=>t.party_type == partyTypeToJSON(PartyType.purchaseReceipt))?.connections,
    add: () => {
      // navigate(r.toCreateInvoice(partyType))
    },
  })

  connections.push({
    entity: t(partyTypeToJSON(PartyType.payment)),
    href: "",
    count:data.find(t=>t.party_type == partyTypeToJSON(PartyType.payment))?.connections,
    add: () => {
      // navigate(r.toCreateInvoice(partyType))
    },
  })
  // data.map((t)=>{
  //   if(t.party_type == regatePartyTypeToJSON(RegatePartyType.booking)){
  //     connections.push({
  //       entity: regatePartyTypeToJSON(RegatePartyType.booking),
  //       count:t.connections,
  //       href: r.toBookings({
  //         "order":order?.id.toString(),
  //         "eventName":order?.name.toString()
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
