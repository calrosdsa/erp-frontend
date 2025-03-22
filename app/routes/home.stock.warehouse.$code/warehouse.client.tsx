import { Outlet, useLoaderData, useNavigate, useOutletContext, useParams, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { GlobalState, WarehouseGlobalState } from "~/types/app-types";
import { route } from "~/util/route";
import DetailLayout from "@/components/layout/detail-layout";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import WarehouseInfo from "./tab/warehouse-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import { endOfMonth, format, startOfMonth } from "date-fns";

export default function WareHouseClient() {
  const globalState = useOutletContext<GlobalState>()
  const { warehouse,activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams()
  const tab = searchParams.get("tab")
  const navigate = useNavigate()
  const navItems = [
    {
      title: t("info"),
      href: r.toRoute({
        main:partyTypeToJSON(PartyType.warehouse),
        routePrefix:[r.stockM],
        routeSufix:[warehouse?.name || ""],
        q:{
          tab:"info",
          id:warehouse?.uuid,
        }
      }),
    }
  ];

  setUpToolbar(()=>{
    let views: ButtonToolbar[] = [];
    views.push({
      label: t("stockBalance"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.stockBalance,
            routePrefix: [r.stockM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              warehouseName: warehouse?.name,
              warehouse: warehouse?.id.toString(),
            },
          })
        );
      },
    });
    return {
      view:views
    }
  },[])
  return (
   <DetailLayout 
   navItems={navItems}
   partyID={warehouse?.id}
   activities={activities}
   >
    {tab == "info" && 
    <WarehouseInfo/>
    }
    {/* <Outlet
    context={{
      warehouse:warehouse,
      globalState:globalState,
    } as WarehouseGlobalState}
    /> */}
    </DetailLayout>
  );
}
