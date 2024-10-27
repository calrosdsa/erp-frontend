import {
  Outlet,
  useLoaderData,
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

export default function ItemDetailClient() {
  const r = routes;
  const params = useParams();
  const { item,activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [searchParams] = useSearchParams()
  const tab = searchParams.get("tab")
  const tabNavItems = [
    {
      title: t("info"),
      href: r.toItemDetail(item?.name || "", item?.uuid || ""),
    },
    // {
    //   title: t("stock"),
    //   href: r.toItemDetailStock(item?.name || "", item?.uuid || ""),
    // },
    // {
    //   title: t("_item.variants"),
    //   href: r.toItemDetailVariants(item?.name || "", item?.uuid || ""),
    // },
  ];

  setUpToolbar(()=>{
    return {
      
    }
  },[])

  return (
    <DetailLayout
    navItems={tabNavItems}
    activities={activities}
    partyID={item?.id}
    >
      {tab == "info" && 
      <ItemInfoTab/>
      }
      
    </DetailLayout>
  );
}
