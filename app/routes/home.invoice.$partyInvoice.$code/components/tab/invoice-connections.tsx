import Connections from "@/components/layout/connections";
import FallBack from "@/components/layout/Fallback";
import {
  Await,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Connection,
  ConnectionModule,
  PartyTypeConnection,
} from "~/types/connections";
import { components } from "~/sdk";
import {
  Module,
  moduleToJSON,
  PartyType,
  partyTypeFromJSON,
  partyTypeToJSON,
  RegatePartyType,
  regatePartyTypeToJSON,
} from "~/gen/common";
import { routes } from "~/util/route";
import { loader } from "../../route";
import { useConnections } from "~/util/hooks/data/useConnections";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";

export default function InvoiceConnectionsTab() {
  const { connections, associatedActions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [paymentPermission] = usePermission({
    roleActions: globalState.roleActions,
    actions:
      associatedActions &&
      associatedActions[partyTypeToJSON(PartyType.payment)],
  });
  const [saleOrderPermission] = usePermission({
    roleActions: globalState.roleActions,
    actions:
      associatedActions &&
      associatedActions[partyTypeToJSON(PartyType.saleOrder)],
  });
  const [purchaseOrderPermission] = usePermission({
    roleActions: globalState.roleActions,
    actions:
      associatedActions &&
      associatedActions[partyTypeToJSON(PartyType.purchaseOrder)],
  });
  const [purchaseReceiptPermission] = usePermission({
    roleActions: globalState.roleActions,
    actions:
      associatedActions &&
      associatedActions[partyTypeToJSON(PartyType.purchaseReceipt)],
  });
  const params = useParams();
  
 

  return (
    <>
      <Suspense fallback={<FallBack />}>
        <Await resolve={connections}>
          {(data: any) => {
            const d =
              data.data as components["schemas"]["ResponseDataListPartyConnectionsBody"];
            const accounting = useConnections({
              data: d.result,
              moduleName: moduleToJSON(Module.accounting),
              references: [
                {
                  partyType: PartyType.payment,
                  permission: paymentPermission,
                },
              ],
            });
            const related = useConnections({
              data: d.result,
              references:[
                ...(params.partyInvoice === partyTypeToJSON(PartyType.saleInvoice) ? [{
                  partyType: PartyType.saleOrder,
                  permission: saleOrderPermission,
                  routePrefix:["order"]
                }] : []),
                ...(params.partyInvoice === partyTypeToJSON(PartyType.purchaseInvoice) ? [{
                  partyType: PartyType.purchaseOrder,
                  permission: purchaseOrderPermission,
                  routePrefix:["order"]
                },
                {
                  partyType: PartyType.purchaseReceipt,
                  permission: purchaseReceiptPermission,
                }] : []),
              ]
            });
            return (
              <div>
                <Connections connections={[related,accounting]} />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
