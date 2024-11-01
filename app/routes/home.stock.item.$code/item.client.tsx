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
import { ActionToolbar } from "~/types/actions";
import { PlusIcon } from "lucide-react";

export default function ItemDetailClient() {
  const r = routes;
  const params = useParams();
  const globalState = useOutletContext<GlobalState>();
  const { item,activities,associatedActions } = useLoaderData<typeof loader>();
  const navigate = useNavigate()
  const [itemPricePermission] = usePermission({
    roleActions:globalState.roleActions,
    actions:associatedActions && associatedActions[PartyType.itemPrice]
  })
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams()
  const tab = searchParams.get("tab")
  const tabNavItems = [
    {
      title: t("info"),
      href:r.toRoute({
        main:partyTypeToJSON(PartyType.item),
        routePrefix:[r.stockM],
        routeSufix:[item?.name || ""],
        q:{
          id:item?.uuid,
          tab:"info",
        }
      }),
    },
  ];

  setUpToolbar(()=>{
    let actions:ActionToolbar[] = []
    if(itemPricePermission?.view){
      actions.push({
        label:t("itemPrice"),
        Icon:PlusIcon,
        onClick:()=>{
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.itemPrice),
              routePrefix: [r.stockM],
              routeSufix: ["new"],
            })
          );
        }
      })
    }
    return {
      actions:actions,
    }
  },[itemPricePermission])

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
