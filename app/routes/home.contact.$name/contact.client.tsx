import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useTranslation } from "react-i18next";
import DetailLayout from "@/components/layout/detail-layout";
import { route } from "~/util/route";
import { ContactInfo } from "./tab/contact-info";
import { setUpToolbar, setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar";
import { Entity } from "~/types/enums";

export default function ContactClient() {
  const { contact, actions, activities } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const globalState = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  const r = route;
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.customer,
      routeSufix: [contact?.name || ""],
      q: {
        tab: tab,
        id: contact?.id.toString() || "",
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
      titleToolbar:contact?.name,
    };
  }, [contact]);

  return (
    <DetailLayout
      navItems={navItems}
      partyID={contact?.id}
      partyName={contact?.name}
      entityID={Entity.CONTACT}
      activities={activities}
    >
      {tab == "info" && <ContactInfo />}
    </DetailLayout>
  );
}
