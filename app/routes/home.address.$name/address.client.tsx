import { useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { PartyReferences } from "../home.party/components/party-references";
import { Entity, PartyType } from "~/types/enums";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import AddressInfoTab from "./tab/address-info";

export default function AddressClient() {
  const { address, actions, activities } = useLoaderData<typeof loader>();
   const [searchParams, setSearchParams] = useSearchParams();
   const tab = searchParams.get("tab") || "info";
   const globalState = useOutletContext<GlobalState>();
   const { t } = useTranslation("common");
   const [permission] = usePermission({
     actions: actions,
     roleActions: globalState.roleActions,
   });
   const toRoute = (tab: string) => {
     return route.toRoute({
       main: route.address,
       routeSufix: [address?.title || ""],
       q: {
         tab: tab,
         id: address?.id.toString() || "",
       },
     });
   };
   const navItems = [
     {
       title: t("info"),
       href: toRoute("info"),
     },
   ];
 
   setUpToolbarRegister(() => {
     return {
       titleToolbar:address?.title,
     };
   }, [address]);
  return (
    <DetailLayout
      navItems={navItems}
      partyID={address?.id}
      partyName={address?.title}
      entityID={Entity.ADDRESS}
      activities={activities}
    >
      {tab == "info" && <AddressInfoTab />}
    </DetailLayout>
  );
}
