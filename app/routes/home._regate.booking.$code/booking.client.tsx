import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import { routes } from "~/util/route";
import { loader } from "./route";
import { BookingInfo } from "./components/tabs/booking-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import { stateFromJSON } from "~/gen/common";
import ActivityFeed from "@/components/custom-ui/activity-feed";

export const BookingDetailClient = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const r = routes
  const {booking,actions,activities} = useLoaderData<typeof loader>()
  const {t} = useTranslation("common")
  const params = useParams()
  const navTabs: NavItem[] = [
    { title: t("info"), href: r.toBookingDetail(booking?.code || "","info") },
  ];
  setUpToolbar({
    title:params.code,
    status:stateFromJSON(booking?.status),
  })
  return (
    <DetailLayout navItems={navTabs} activities={activities} partyID={booking?.id}>
    {tab == "info" && 
    <BookingInfo/>
    }
    
  </DetailLayout>
  );
};
