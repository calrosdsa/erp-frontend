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
import { ButtonToolbar } from "~/types/actions";
import { UpdateCourtRate, useUpdateCourtRate } from "./use-update-court-rate";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function CourtDetailClient() {
  const { court, activities } = useLoaderData<typeof loader>();
  const params = useParams();
  const { t } = useTranslation("common");
  const r = routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const updateCourtRate = useUpdateCourtRate();
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.courtM,
      routeSufix: [court?.name || ""],
      q: {
        tab: tab,
        id:court?.uuid,
      },
    });
  };
  const navTabs: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
    {
      title: t("regate.schedule"),
      href: toRoute("schedule"),
    },
    // {
    //   title: "Reservas",
    //   href: toRoute("reservas"),
    // },
  ];

  setUpToolbar(() => {
    const actions: ButtonToolbar[] = [];
    actions.push({
      label: "Editar precio por hora",
      onClick: () => {
        updateCourtRate.onOpenDialog({
          court: court,
          title: "Editar precio por hora",
          isEdit:true,
        });
      },
    });
    actions.push({
      label: "Agregar precio por hora",
      onClick: () => {
        updateCourtRate.onOpenDialog({
          court: court,
          title: "Agregar precio por hora",
          isEdit:false,
        });
      },
    });
  
    return {
      titleToolbar: params.name,
      actions: actions,
    };
  }, []);

  return (
    <DetailLayout
      navItems={navTabs}
      activities={activities}
      partyID={court?.id}
    >
      {updateCourtRate.open && <UpdateCourtRate />}

      {tab == "info" && <CourtInfoTab />}
      {tab == "schedule" && <CourtSchedule />}
    </DetailLayout>
  );
}
