import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import BatchBundleInfo from "./tab/project-info";
import { setUpToolbar, setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { format } from "date-fns";
import { ButtonToolbar } from "~/types/actions";
import { stateFromJSON } from "~/gen/common";
import { Entity } from "~/types/enums";

export default function BatchBundleDetailClient() {
  const { batchBundle, actions, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { roleActions } = useOutletContext<GlobalState>();
  const navigate = useNavigate();
  const [permission] = usePermission({
    roleActions: roleActions,
    actions: actions,
  });
  const toRoute = (tab: string) => {
    return r.toRouteDetail(route.batchBundle,batchBundle?.batch_bundle_no || "",{
      tab:tab
    });
  };
  const navItems: NavItem[] = [
    {
      title: t("form.name"),
      href: toRoute("info"),
    },
  ];
  setUpToolbarRegister(() => {
    let buttons: ButtonToolbar[] = [];
    if (permission?.view) {
      buttons.push({
        label: t("form.sumary"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.serialNoResume,
              routePrefix: [r.stockM],
              q: {
                batchBundleNo: batchBundle?.batch_bundle_no || "",
                fromDate: format(
                  new Date(batchBundle?.created_at || ""),
                  "yyyy-MM-dd"
                ),
              },
            })
          );
        },
      });
    }
    return {
      titleToolbar:batchBundle?.batch_bundle_no,
      buttons: buttons,
    };
  }, [permission,batchBundle]);
  return (
    <DetailLayout
      partyID={batchBundle?.id}
      partyName={batchBundle?.batch_bundle_no}
      entityID={Entity.BATCH_BUNDLE}
      navItems={navItems}
      activities={activities}
    >
      {tab == "info" && <BatchBundleInfo />}
    </DetailLayout>
  );
}
