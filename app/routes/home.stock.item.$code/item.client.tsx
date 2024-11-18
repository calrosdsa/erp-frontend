import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import DetailLayout from "@/components/layout/detail-layout";
import ItemInfoTab from "./components/tab/item-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { usePermission } from "~/util/hooks/useActions";
import { ButtonToolbar } from "~/types/actions";
import { PlusIcon } from "lucide-react";
import ItemDashboardTab from "./components/dashobard/item-dashboard";
import { endOfMonth, format, startOfMonth } from "date-fns";

export default function ItemDetailClient() {
  const r = routes;
  const params = useParams();
  const globalState = useOutletContext<GlobalState>();
  const { item, activities, associatedActions } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [itemPricePermission] = usePermission({
    roleActions: globalState.roleActions,
    actions: associatedActions && associatedActions[PartyType.itemPrice],
  });
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const tabNavItems = [
    {
      title: t("info"),
      href: r.toRoute({
        main: partyTypeToJSON(PartyType.item),
        routePrefix: [r.stockM],
        routeSufix: [item?.name || ""],
        q: {
          tab: "info",
          id: item?.uuid,
        },
      }),
    },
    {
      title: t("dashboard"),
      href: r.toRoute({
        main: partyTypeToJSON(PartyType.item),
        routePrefix: [r.stockM],
        routeSufix: [item?.name || ""],
        q: {
          tab: "dashboard",
          id: item?.uuid,
        },
      }),
    },
  ];

  setUpToolbar(() => {
    let view: ButtonToolbar[] = [];
    view.push({
      label: t("stockBalance"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.stockBalance,
            routePrefix: [r.stockM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              itemName: item?.name,
              item: item?.id.toString(),
            },
          })
        );
      },
    });
    view.push({
      label: t("stockLedger"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.stockLedger,
            routePrefix: [r.stockM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              itemName: item?.name,
              item: item?.id.toString(),
            },
          })
        );
      },
    });
    let actions: ButtonToolbar[] = [];
    if (itemPricePermission?.view) {
      actions.push({
        label: t("itemPrice"),
        Icon: PlusIcon,
        onClick: () => {
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.itemPrice),
              routePrefix: [r.stockM],
              routeSufix: ["new"],
            })
          );
        },
      });
    }
    return {
      actions: actions,
      view: view,
    };
  }, [itemPricePermission]);

  return (
    <DetailLayout
      navItems={tabNavItems}
      activities={activities}
      partyID={item?.id}
    >
      {tab == "info" && <ItemInfoTab />}
      {tab == "dashboard" && <ItemDashboardTab />}
    </DetailLayout>
  );
}
