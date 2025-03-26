import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import ProjectInfo from "./tab/project-info";
import {
  setUpToolbar,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import { stateFromJSON } from "~/gen/common";
import { Entity } from "~/types/enums";

export default function ProjectDetailClient() {
  const { project, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.project,
      routeSufix: [project?.name || ""],
      q: {
        tab: tab,
        id: project?.id.toString() || "",
      },
    });
  };
  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];
  setUpToolbarRegister(() => {
    return {
      status: stateFromJSON(project?.status),
    };
  }, []);
  return (
    <DetailLayout
      partyID={project?.id}
      partyName={project?.name}
      entityID={Entity.PROJECT}
      activities={activities}
      navItems={navItems}
    >
      {tab == "info" && <ProjectInfo />}
    </DetailLayout>
  );
}
