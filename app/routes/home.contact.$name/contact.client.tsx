import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import Typography, { subtitle } from "@/components/typography/Typography";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { PartyReferences } from "../home.party/components/party-references";
import DetailLayout from "@/components/layout/detail-layout";
import { routes } from "~/util/route";
import { ContactInfo } from "./tab/contact-info";

export default function ContactClient() {
  const { contact, actions } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info"
  const globalState = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  const r = routes;
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.customerM,
      routePrefix: [r.sellingM],
      routeSufix: [contact?.given_name || ""],
      q: {
        tab: tab,
        id: contact?.uuid || "",
      },
    });
  };
  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
    // {
    //   title: t("connections"),
    //   href: toRoute("connections"),
    // },
  ];

  return (
  <DetailLayout 
  navItems={navItems}
  partyID={contact?.id}
  >
    {tab == "info" && 
    <ContactInfo/>
    }
  </DetailLayout>
  )
}
