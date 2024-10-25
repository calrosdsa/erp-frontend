import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useEffect } from "react";
import DetailLayout from "@/components/layout/detail-layout";
import { NavItem } from "~/types";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { CourtState, GlobalState } from "~/types/app";
import CourtInfoTab from "./tabs/court-info";
import CourtSchedule from "./tabs/court-schedule";
import { ActionToolbar } from "~/types/actions";
import { UpdateCourtRate, useUpdateCourtRate } from "./use-update-court-rate";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function CourtDetailClient() {
  const { court,activities } = useLoaderData<typeof loader>();
  const params = useParams();
  const { t } = useTranslation("common");
  const r = routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const toolbar = useToolbar();
  const updateCourtRate = useUpdateCourtRate();
  const navTabs: NavItem[] = [
    {
      title: t("info"),
      href: r.toCourtDetail(court?.name || "", court?.uuid || "", "info"),
    },
    {
      title: t("regate.schedule"),
      href: r.toCourtDetail(court?.name || "", court?.uuid || "", "schedule"),
    },
  ];

  setUpToolbar(() => {
    const actions: ActionToolbar[] = [];
    actions.push({
      label: "Editar precio por hora",
      onClick: () => {
        updateCourtRate.onOpenDialog({
          court: court,
          title: "Editar precio por hora",
        });
      },
    });
    return {
      title: params.name,
      actions: actions,
    };
  }, []);

  return (
    <DetailLayout navItems={navTabs}
    activities={activities}
    partyID={court?.id}>
      {updateCourtRate.open && <UpdateCourtRate />}

      {tab == "info" && <CourtInfoTab />}
      {tab == "schedule" && <CourtSchedule />}
    </DetailLayout>
  );
}
