import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import CostCenterInfo from "./tab/purchase-record-info";
import { setUpToolbar, setUpToolbarRegister, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { ButtonToolbar } from "~/types/actions";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import PurchaseRecordInfo from "./tab/purchase-record-info";
import { DownloadIcon } from "lucide-react";
import { components } from "~/sdk";
import { useExporter } from "~/util/hooks/ui/useExporter";

export default function PurchaseRecordDetailClient() {
  const { purchaseRecord, actions,activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const {exportPdf} = useExporter()
  
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.purchaseRecord,
      routePrefix: [r.invoicing],
      routeSufix: [purchaseRecord?.invoice_no || ""],
      q: {
        tab: tab,
        id: purchaseRecord?.uuid || "",
      },
    });
  };

  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  const onChangeState = (e: EventState) => {
    const body: z.infer<typeof updateStatusWithEventSchema> = {
      current_state: purchaseRecord?.status || "",
      party_id: purchaseRecord?.uuid || "",
      events: [e],
    };
    fetcher.submit(
      {
        action: "update-status",
        updateStatus: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "STATE",
    },
    [fetcher.state]
  );

 useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
 },[fetcher.data])

  setUpToolbarRegister(()=>{
     let actions: ButtonToolbar[] = [];
     actions.push({
      label:t("form.download"),
      Icon:DownloadIcon,
      onClick:()=>{
        const exportData:components["schemas"]["ExportDocumentData"] =  {
          id:searchParams.get("id") || "",
        }
        exportPdf("/purchase-record/export/document",exportData)
      }
    })
     return {
      actions:actions,
      status:stateFromJSON(purchaseRecord?.status),
      titleToolbar:`Nº de la Factura(${purchaseRecord?.invoice_no})`,
      onChangeState:onChangeState

    }
  },[purchaseRecord,permission])

  
  return (
    <DetailLayout partyID={purchaseRecord?.id} navItems={navItems}
    activities={activities}>
      {tab == "info" && <PurchaseRecordInfo />}
    </DetailLayout>
  );
}
