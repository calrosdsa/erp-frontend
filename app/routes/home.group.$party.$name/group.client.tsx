import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";
import { TreeDescendents } from "@/components/layout/tree/TreeDescendents";
import { TreeGroupLayout } from "@/components/layout/tree/TreeLayout";
import DetailLayout from "@/components/layout/detail-layout";
import GroupInfoTab from "./tab/group.info";
import { route } from "~/util/route";
import { setUpToolbar, setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar";
import { party } from "~/util/party";
import { Entity } from "~/types/enums";

export default function GroupClient() {
  const { group, actions, groupDescendents, activities } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const r = route;
  const params = useParams();
  const groupParty = params.party || "";
  const tab = searchParams.get("tab");
  const navs = [
    {
      title: t("info"),
      href: r.toRoute({
        main: groupParty,
        routePrefix: [r.group],
        routeSufix: [group?.name || ""],
        q: {
          tab: "info",
          id: group?.id,
        },
      }),
    },
  ];

  const getEntity = () => {
    switch (params.party) {
      case party.itemGroup: {
        return Entity.ITEM_GROUP;
      }
      case party.customerGroup: {
        return Entity.CUSTOMER_GROUP;
      }
      case party.supplierGroup: {
        return Entity.SUPPLIER_GROUP;
      }
    }
    return 0
  };

  setUpToolbarRegister(() => {
    return {
      titleToolbar:group?.name
    };
  }, [group]);
  return (
    <DetailLayout
      navItems={navs}
      activities={activities}
      partyID={group?.id}
      partyName={group?.name}
      entityID={getEntity()}
    >
      {tab == "info" && <GroupInfoTab />}
    </DetailLayout>
  );
}
