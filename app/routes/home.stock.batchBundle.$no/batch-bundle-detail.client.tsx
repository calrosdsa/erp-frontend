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
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { format } from "date-fns";
import { ButtonToolbar } from "~/types/actions";
import { stateFromJSON } from "~/gen/common";

export default function BatchBundleDetailClient() {
  const { batchBundle, actions } = useLoaderData<typeof loader>();
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
    return r.toRoute({
      main: r.project,
      routeSufix: [batchBundle?.batch_bundle_no || ""],
      q: {
        tab: tab,
      },
    });
  };
  const navItems: NavItem[] = [
    {
      title: t("form.name"),
      href: toRoute("info"),
    },
  ];
  setUpToolbar(() => {
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
      buttons: buttons,
    };
  }, [permission]);
  return (
    <DetailLayout partyID={batchBundle?.id} navItems={navItems}>
      {tab == "info" && <BatchBundleInfo />}
    </DetailLayout>
  );
}
