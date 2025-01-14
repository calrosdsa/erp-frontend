

import Connections from "@/components/layout/connections";
import FallBack from "@/components/layout/Fallback";
import { Await, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Connection, ConnectionModule } from "~/types/connections";
import { components } from "~/sdk";
import { PartyType, partyTypeFromJSON, partyTypeToJSON, RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { route } from "~/util/route";
import { loader } from "../../route";


export default function QuotationConnections() {
  const {connections,quotation} = useLoaderData<typeof loader>()
  return (
    <>
       
     </>
    );
  }
